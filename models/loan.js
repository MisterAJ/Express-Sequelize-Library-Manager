'use strict';
module.exports = function (sequelize, DataTypes) {
    const Loan = sequelize.define('Loan', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        book_id: DataTypes.INTEGER,
        patron_id: DataTypes.INTEGER,
        loaned_on: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
                isDate: true,
                isAfter: "2017-05-05"
            }
        },
        return_by: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
                isDate: true,
                isAfter: "2017-05-05"
            }
        },
        returned_on: {
            type: DataTypes.DATE,
            validate: {
                notEmpty: true,
                isDate: true,
                isAfter: "2017-05-05"
            }
        },
    }, {
        classMethods: {
            associate: function (models) {
                Loan.belongsTo(models.Patron, {foreignKey: 'patron_id'});
                Loan.belongsTo(models.Book, {foreignKey: 'book_id'});
            }
        }
    });
    return Loan;
};