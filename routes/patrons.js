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
    .post([function (req, res, next) {
        Patrons.create(req.body).then(function (patron) {
            next();
        })
    }, function (req, res) {
        res.redirect('/patrons/all')
    }]);

router.get('/all', function (req, res, next) {
    Patrons.findAll().then(function (patrons) {
        res.render("main", {patrons: patrons, title: "All Patrons"});
    });
});

router.route('/:id')
    .get(function (req, res, next) {
        Loans.findAll({
            include: [{model: Patrons},{model: Books}],
            order: [[{model: Books}, "title", "ASC"]],
            where: {patron_id: req.params.id}
        })
            .then(function (loans) {
                if(loans.length > 0){
                    res.render("main", {
                        patronDetail: loans[0].dataValues.Patron.dataValues,
                        patronDetailLoans: loans,
                        title: "Patron Details",
                    });
                } else {
                    Patrons.findByPrimary(req.params.id)
                        .then(function (patron) {
                            res.render("main", {
                                patronDetail: patron.dataValues,
                                title: "Patron Details",
                            });
                        })
                }

            });
    })
    .post([function (req, res, next) {
        Patrons.findByPrimary(req.params.id)
            .then(function (patron) {
                console.log(req.body);
                patron.update(req.body);
                next();
            })
    }, function (req, res) {
        res.redirect('/patrons/all')
    }]);

module.exports = router;
