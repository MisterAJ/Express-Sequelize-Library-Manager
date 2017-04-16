const express = require('express');
const router = express.Router();
const Books = require("../models").Book;
const Loans = require("../models").Loan;
const Patrons = require("../models").Patron;

/* GET home page. */


router.get('/', function (req, res, next) {
    res.render('home', {title: 'Express'});
});

// Books

// TODO - Client side form validation

router.route('/books/new')
    .get(function (req, res, next) {
        res.render("new", {book: Books.build(), title: "New Book"})
    })
    .post(function (req, res, next) {

        Books.create(req.body).then(function (book) {
            console.log(book);
            res.redirect('/books/' + book.dataValues.id)
        })
    });

router.get('/books/all', function (req, res, next) {
    Books.findAll().then(function (books) {
        res.render("main", {books: books, title: "All Books"});
    });
});

router.get('/books/overdue', function (req, res, next) {
    const d = new Date();
    const n = d.toISOString();
    Loans.findAll({
        where: {
            return_by: {
                $lt: n
            }
        }
    }).then(function (book) {
        console.log(book);
        res.render("main", {overdueBook: book, title: "Overdue Books"})
    })
});

router.get('/books/checked', function (req, res, next) {
    Loans.findAll({
        where: {
            $and: [{
                loaned_on: {
                    $not: null
                }
            }, {
                returned_on: null
            }]
        }
    }).then(function (book) {
        console.log(book);
        res.render("main", {checkedBook: book, title: "Overdue Books"})
    })
});


// TODO - Set up Relationships

router.get('/books/:id', function (req, res, next) {
    Books.findByPrimary(req.params.id)
        .then(function (book) {
            Loans.findAll({
                where: {
                    book_id: book.dataValues.id
                }
            })
                .then(function (loans) {
                    if (loans.length > 0) {
                        Patrons.findByPrimary(loans[0].dataValues.patron_id)
                            .then(function (patron) {
                                res.render("main", {
                                    bookDetail: book.dataValues,
                                    patronDetails: patron,
                                    loanDetails: loans,
                                    title: "Book Details"
                                })
                            });
                    } else {
                        res.render("main", {
                            bookDetail: book.dataValues,
                            loanDetails: loans,
                            title: "Book Details"
                        })
                    }
                })
        })

});


// GET - Patrons

router.route('/patrons/new')
    .get(function (req, res, next) {
        res.render("new", {patron: true, title: "New Book"}
        );
    })
    .post(function (req, res, next) {
        Patrons.create(req.body).then(function (patron) {
            console.log(patron);
            res.redirect('/patrons/' + patron.dataValues.id)
        })
    });

router.get('/patrons/all', function (req, res, next) {
    Patrons.findAll().then(function (patrons) {
        res.render("main", {patrons: patrons, title: "All Patrons"});
    });
});

// TODO - Update detail changes to patrons and books

router.get('/patrons/:id', function (req, res, next) {
    Patrons.findByPrimary(req.params.id)
        .then(function (patron) {
            console.log(patron);
            res.render("main", {
                patronDetail: patron.dataValues,
                title: "Patron Details"
            })
        })

});


// GET - Loans
// TODO - POST for new loan entry
router.get('/loans/new', function (req, res, next) {
    // Promises
    let p1 = Books.findAll();
    let p2 = Patrons.findAll();
    const d = new Date();
    const n = d.toISOString();
    const returnDate = new Date();
    returnDate.setDate(d.getDate()+7);
    Promise.all([p1, p2]).then(function (values) {
        "use strict";
        res.render("new", {loan: true, date: n, returnDate: returnDate, books: values[0], patrons: values[1], title: "New Book"})
    });
});

router.get('/loans/all', function (req, res, next) {
    Loans.findAll().then(function (loans) {
        console.log(loans);
        res.render("main", {loans: loans, title: "All Loans"});
    });
});

router.get('/loans/overdue', function (req, res, next) {
    res.render("main", {overdueLoan: true, title: "Overdue Loans"}
    );
});

router.get('/loans/checked', function (req, res, next) {
    res.render("main", {checkedLoan: true, title: "Checked Loans"}
    );
});

module.exports = router;
