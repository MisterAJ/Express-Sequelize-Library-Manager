'use strict';
module.exports = function (sequelize, DataTypes) {
    var Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2,40]
            }
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2,15]
            }
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2,15]
            }
        },
        first_published: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [4,15]
            }
        },
    }, {
        classMethods: {
            associate: function(models) {
                Book.hasMany(models.Loan, {foreignKey: 'book_id'});
            }
        },
        timestamps: false
    });
    return Book;
};