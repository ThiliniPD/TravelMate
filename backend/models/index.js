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
Trip.belongsTo(User, { foreignKey: 'owner' });
User.hasMany(Trip, { foreignKey: 'owner' }); 

User.belongsToMany(Trip, { through: Permission });
Trip.belongsToMany(User, { through: Permission });

// 4. export the model
module.exports = {
    User,
    Trip,
    Permission,
};