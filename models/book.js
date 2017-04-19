'use strict';
module.exports = function (sequelize, DataTypes) {
    var Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        genre: DataTypes.STRING,
        first_published: DataTypes.STRING
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