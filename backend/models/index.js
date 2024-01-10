'use strict'

// 1. require the model
const User = require('./user')
const Trip = require('./trip')
const Permission = require('./permission')

// 2. sync the model
async function init() {
    await User.sync();
    await Trip.sync();
    await Permission.sync();
};
init();

// 3. define relationships
Trip.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
User.hasMany(Trip, { foreignKey: 'ownerId', as: 'owner' }); 

Permission.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Permission, { foreignKey: 'userId'});

Permission.belongsTo(Trip, { foreignKey: 'tripId' });
Trip.hasMany(Permission, { foreignKey: 'tripId'});

// 4. export the model
module.exports = {
    User,
    Trip,
    Permission,
};