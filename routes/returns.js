const express = require('express');
const router = express.Router();
const Books = require("../models").Book;
const Loans = require("../models").Loan;
const Patrons = require("../models").Patron;

router.route('/:id')
    .get(function (req, res, next) {
        Loans.findAll({
            include: [{
                model: Books
            }, {
                model: Patrons
            }],
            where: {
                id: req.params.id
            }
        })
            .then(function (loan) {
                res.render("main", {
                    returns: loan[0],
                    returnPatron: loan[0].dataValues.Patron,
                    returnBook: loan[0].dataValues.Book,
                    title: "Checked Loans"
                })

            })
    })
    .post([function (req, res, next) {
        Loans.findByPrimary(req.params.id)
            .then(function (loan) {
                console.log(req.body);
                loan.updateAttributes({returned_on: req.body.returned_on});
                next();
            })
    }, function (req, res) {
        res.redirect('/returns');
    }]);

router.get('/', function (req, res, next) {
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