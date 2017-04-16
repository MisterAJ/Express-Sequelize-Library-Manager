'use strict';
module.exports = function (sequelize, DataTypes) {
    var Patron = sequelize.define('Patron', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        address: DataTypes.STRING,
        email: DataTypes.STRING,
        library_id: DataTypes.STRING,
        zip_code: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function (models) {
                function getFullName() {
                    return (models.first_name + ' ' + models.last_name)
                }
            }
        }
    });
    return Patron;
};