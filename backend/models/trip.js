const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../dbConnect");
const sequelizeInstance = dbConnect.Sequelize;

class Trip extends Model { }

// Sequelize will create this table if it doesn't exist on startup
Trip.init({
        id: {
            type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true
        },
        name: {
            type: DataTypes.STRING, allowNull: false, required: true
        },
        description: {
            type: DataTypes.STRING, allowNull: true, required: false
        },
        photo: {
            type: DataTypes.STRING
        },
        itinerary: {
            type: DataTypes.JSON, allowNull: false, require: true
        },
        startDate: {
            type: DataTypes.DATE, allowNull: true, required: false
        }
    },
    {
        sequelize: sequelizeInstance, modelName: 'trips', // use lowercase plural format
        timestamps: true, freezeTableName: true
    }
)

module.exports = Trip;