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
        }).catch(function (err) {
            if (err.name === 'SequelizeValidationError') {
                res.render("new", {
                    patron: true,
                    title: "New Book",
                    errors: err.errors
                })
            }
        })

    }, function (req, res) {
        res.redirect('/patrons/all')
    }]);

router.get('/all', function (req, res, next) {
    Patrons.findAll().then(function (patrons) {
        res.render("main", {patrons: patrons, title: "All Patrons"});
    }).catch(function (err) {
        res.send(500);
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

            }).catch(function (err) {
            res.send(500);
        });
    })
    .post([function (req, res, next) {
        req.body.id = req.params.id;
        Patrons.upsert(req.body)
            .then(function () {
                next();
            })
            .catch(function (err) {
                if(err.name === 'SequelizeValidationError') {
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
                                    errors: err.errors
                                });
                            } else {
                                Patrons.findByPrimary(req.params.id)
                                    .then(function (patron) {
                                        res.render("main", {
                                            patronDetail: patron.dataValues,
                                            title: "Patron Details",
                                            errors: err.errors
                                        });
                                    })
                            }

                        })
                }
            });

    }, function (req, res) {
        res.redirect('/patrons/all')
    }]);

module.exports = router;
