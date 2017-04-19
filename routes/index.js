const express = require('express');
const router = express.Router();
const Books = require("../models").Book;
const Loans = require("../models").Loan;
const Patrons = require("../models").Patron;

/* GET home page. */

router.get('/', function (req, res, next) {
    res.render('home', {title: 'Express'});
});

module.exports = router;
