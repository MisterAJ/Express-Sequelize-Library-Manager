const express = require('express');
const router = express.Router();
const Books = require("../models").Book;
const Loans = require("../models").Loan;
const Patrons = require("../models").Patron;

// Books

// TODO - Client side form validation

router.route('/new')
    .get(function (req, res, next) {
        res.render("new", {book: true, title: "New Book"})
    })
    .post(function (req, res, next) {

        Books.create(req.body).then(function (book) {
            console.log(book);
            res.redirect('/books/' + book.dataValues.id)
        })
    });

router.get('/all', function (req, res, next) {
    Books.findAll().then(function (books) {
        res.render("main", {books: books, title: "All Books"});
    });
});

// TODO - Fix Query for Overdue
router.get('/overdue', function (req, res, next) {
    const d = new Date();
    const n = d.toISOString();
    Loans.findAll({
        include: Books,
        where: {
            $and: [{
                return_by: {
                    $lt: n
                }
            }, {
                returned_on: null
            }]
        }
    }).then(function (book) {
        console.log(book);
        res.render("main", {overdueOrCheckedBook: book, title: "Overdue Books"})
    })
});
// TODO - Fix Query for checked out
router.get('/checked', function (req, res, next) {
    Loans.findAll({
        include: Books,
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
        res.render("main", {overdueOrCheckedBook: book, title: "Overdue Books"})
    })
});


router.get('/:id', function (req, res, next) {
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

module.exports = router;