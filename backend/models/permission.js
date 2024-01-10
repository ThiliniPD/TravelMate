const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../dbConnect");
const sequelizeInstance = dbConnect.Sequelize;

class Permission extends Model { }

// Sequelize will create this table if it doesn't exist on startup
Permission.init({
        type: {
            type: DataTypes.INTEGER, allowNull: false, primaryKey: false
        },
    },
    {
        sequelize: sequelizeInstance, modelName: 'permissions', // use lowercase plural format
        timestamps: true, freezeTableName: true
    }
)

module.exports = Permission;