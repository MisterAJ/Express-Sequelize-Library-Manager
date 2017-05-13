const express = require('express');
const router = express.Router();
const Books = require("../models").Book;
const Loans = require("../models").Loan;
const Patrons = require("../models").Patron;

// Books

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
    let bookItem;
    Books.findByPrimary(req.params.id)
        .then(function (book) {
            bookItem = book;
            Loans.findAll({
                include: {model: Patrons},
                where: {
                    book_id: book.dataValues.id
                }
            })
                .then(function (loans) {
                    if(loans.length > 0) {
                        console.log(loans);
                        res.render("main", {
                            bookDetail: book.dataValues,
                            patronDetails: loans[0].dataValues.Patron.dataValues,
                            loanDetails: loans,
                            title: "Book Details"
                        })

                    }
                    else {
                        res.render("main", {
                            bookDetail: book.dataValues,
                            title: "Book Details"
                        })
                    }
                })
        })

});

module.exports = router;