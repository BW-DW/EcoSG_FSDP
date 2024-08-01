// models/Contact.js
module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define('Contact', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },{
      tableName:"ContactMessages"
    });
    return Contact;
  };