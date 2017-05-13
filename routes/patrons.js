const express = require('express');
const router = express.Router();
const Books = require("../models").Book;
const Loans = require("../models").Loan;
const Patrons = require("../models").Patron;


// Patrons

router.route('/new')
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

router.get('/all', function (req, res, next) {
    Patrons.findAll().then(function (patrons) {
        res.render("main", {patrons: patrons, title: "All Patrons"});
    });
});

// TODO - Update detail changes to patrons and books

router.get('/:id', function (req, res, next) {
    Loans.findAll({
        include: [{model: Patrons},{model: Books}],
        order: [[{model: Books}, "title", "ASC"]],
        where: {id: req.params.id}
    })
        .then(function (loans) {
            console.log(loans[0].dataValues);
            res.render("main", {
                patronDetail: loans[0].dataValues.Patron.dataValues,
                patronDetailLoans: loans,
                title: "Patron Details",

            });

        });
});

module.exports = router;
