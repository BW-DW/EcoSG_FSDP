'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const db = {};
require('dotenv').config();

// Create sequelize instance using config 
let sequelize = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD,
  {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      logging: false,
      timezone: '+08:00'
  }
);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
      const model = require(path.join(__dirname, file));
      if (typeof model === 'function') {
        const modelinstance = model(sequelize, Sequelize.DataTypes);
        db[modelinstance.name] = modelinstance;
      }
      
  });
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Set up associations manually for the new EventParticipant model
const User = db.User;
const Event = db.Event;
const EventParticipant = db.EventParticipant;

User.belongsToMany(Event, { through: EventParticipant, foreignKey: 'userId' });
Event.belongsToMany(User, { through: EventParticipant, foreignKey: 'eventId' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
