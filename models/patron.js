'use strict';
module.exports = function (sequelize, DataTypes) {
    const Patron = sequelize.define('Patron', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2,20]
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2,20]
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 30]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true,
                len: [2,50]
            }
        },
        library_id: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2,15]
            }
        },
        zip_code: {
            type: DataTypes.INTEGER,

            validate: {
                notEmpty: true,
                len: 5
            }
        },
    }, {
        classMethods: {
            associate: function (models) {
                Patron.hasMany(models.Loan, {foreignKey: 'patron_id'});
            }
        },
        timestamps: false
    });
    return Patron;
};