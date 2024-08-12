// models/Contact.js



const Contact = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },{
    tableName:"ContactMessages",
  });
  return Contact;
};
module.exports = 
  Contact;