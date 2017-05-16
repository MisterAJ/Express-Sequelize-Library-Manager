const express = require('express');
const router = express.Router();
const Books = require("../models").Book;
const Loans = require("../models").Loan;
const Patrons = require("../models").Patron;

// Loans

// TODO - BUG - Fix Sequelize error - NULL id
router.route('/new')
    .get(function (req, res, next) {
        Books.findAll({
            include: {
                model: Loans,
                where: {
                    $and: [{
                        loaned_on: {
                            $not: null
                        }
                    }, {
                        returned_on: null
                    }]
                }
            }
        }).then(function (books) {
            let idArray = [];
            for(id of books) {
                idArray.push(id.dataValues.id);
            }
            let p1 = Books.findAll({
                where: {
                    $not: {
                        id: idArray
                    }
                },
                order: [["title", "ASC"]]
            });
            let p2 = Patrons.findAll();
            Promise.all([p1, p2]).then(function (values) {
                "use strict";
                const d = new Date();
                const n = d.toISOString();
                const returnDate = new Date();
                returnDate.setDate(d.getDate() + 7);
                res.render("new", {
                    loan: true,
                    date: n,
                    returnDate: returnDate,
                    books: values[0],
                    patrons: values[1],
                    title: "New Loan"
                });
            });
        });

    })
    .post(function (req, res, next) {
        Loans.create(req.body).then(function (loan) {
            console.log(loan);
            res.redirect('/loans/all');
        })
    });

router.get('/all', function (req, res, next) {
    Loans.findAll({
        include: [{model: Books}, {model: Patrons}],
        order: [[{model: Books}, "title", "ASC"]],

    })
        .then(function (loans) {
            console.log(loans);
            res.render("main", {loans: loans, title: "All Loans"});
        });
});

router.get('/overdue', function (req, res, next) {
    const d = new Date();
    const n = d.toISOString();
    Loans.findAll({
        include: [{model: Books}, {model: Patrons}],
        order: [[{model: Books}, "title", "ASC"]],
        where: {
            $and: [{
                return_by: {
                    $lt: n
                }
            }, {
                returned_on: null
            }]
        }
    }).then(function (loans) {
        res.render("main", {loans: loans, title: "Overdue Loans"})
    });
});

router.get('/checked', function (req, res, next) {
    Loans.findAll({
        include: [{model: Books}, {model: Patrons}],
        order: [[{model: Books}, "title", "ASC"]],
        where: {
            $and: [{
                loaned_on: {
                    $not: null
                }
            }, {
                returned_on: null
            }]
        }
    }).then(function (loans) {
        res.render("main", {loans: loans, title: "Checked Loans"})
    });
});

module.exports = router;