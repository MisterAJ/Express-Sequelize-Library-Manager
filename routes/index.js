var express = require('express');
var router = express.Router();
const Book = require("../models").Book;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home', {title: 'Express'});
});

// GET - Books


router.get('/books/new', function (req, res, next) {
    res.render("new", {book: Book.build(), title: "New Book"}
    );
});

router.get('/books/all', function (req, res, next) {
    res.render("main", {book: true, title: "All Books"}
    );
});

router.get('/books/overdue', function (req, res, next) {
    res.render("main", {overdueBook: true, title: "Overdue Books"}
    );
});

router.get('/books/checked', function (req, res, next) {
    res.render("main", {checkedBook: true, title: "Checked Books"}
    );
});

router.get('/books/:id', function (req, res, next) {
    res.render("main", {bookDetail: true, title: "Book Details"}
    );
});

// POST - Books

router.post('/books/new', function (req, res, next) {
    const name = req.body.name;
    console.log(name);
    res.end("yes");
});

// GET - Patrons

router.get('/patrons/new', function (req, res, next) {
    res.render("new", {patron: true, title: "New Book"}
    );
});

router.get('/patrons/all', function (req, res, next) {
    res.render("main", {patron: true, title: "All Patrons"}
    );
});

router.get('/patrons/:id', function (req, res, next) {
    res.render("main", {patronDetail: true, title: "Patron Details"}
    );
});


// GET - Loans

router.get('/loans/new', function (req, res, next) {
    res.render("new", {loan: true, title: "New Book"}
    );
});

router.get('/loans/all', function (req, res, next) {
    res.render("main", {loan: true, title: "All Loans"}
    );
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
