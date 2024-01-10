"use strict";
const { Model } = require("sequelize");
const Models = require("../models");

const Permission = {
    read: 0,
    write: 1,
    own: 2,
}

const checkPermission = async (userId, tripId, permission) => {
    console.log("check trip", userId, tripId, permission);
    //attributes: ['id', 'firstName', 'lastName', 'email'],
    const queries = [Models.Trip.findOne({
            raw: true,
            nest: true,
            attributes: ['id', 'name', 'description', 'photo', 'itinerary', 'startDate'],
            where: { id: tripId },
            include: {
                model: Models.User,
                as: 'owner',
                attributes: ['id', 'firstName', 'lastName', 'email'],
            }
        }),
        Models.Permission.findAll({
            raw: true,
            nest: true,
            attributes: ['type'],
            where: { tripId: tripId },
            include: {
                model: Models.User,
                attributes: ['id', 'firstName', 'lastName', 'email'],
            }
        })
    ];
    
    return Promise.all(queries).then(function (data) {
        let trip = data[0];
        trip.permission = data[1] == null ? [] : data[1];

        if (!trip.owner || trip.owner.id != userId) {
            const permission = trip.permission.find((permission) => permission.user.id == userId);

            // users with Permission.read has only read permission.
            // users with Permission.write has read and write permission.
            // users with Permission.own has read write and delete permission.
            // check if user has permission less thsn the requested and throw
            if (!permission || (permission.type < permission)) {
                // no permission for this map for the user
                throw { message: 'Permission denied' };
            }
        }

        return trip;
    }).catch((e) => {
        console.log("db error: ", e);
        throw e;
    });
}

const createTrip = (req, res) => {
    req.body.ownerId = req.user.user_id;  // make sure creation user is the owner
    console.log("trip request: ", req.body);
    Models.Trip.create(req.body).then(function (data) {
        res.status(200).json(data)
    }).catch(err => {
        res.status(500).json({ result: err.message })
    })
}

const getTrip = (req, res) => {
    checkPermission(req.user.user_id, req.params.id, Permission.read).then(function (data) {
        res.status(200).json(data)
    }).catch(err => {
        res.status(500).json({ result: err.message, arr: err.arr })
    })
}

const updateTrip = (req, res) => {
    delete req.body.ownerId; // make sure owner is not updated while editing a map

    checkPermission(req.user.user_id, req.params.id, Permission.write).then(() =>{
        return Models.Trip.update(req.body, {
            where: {
                id: req.params.id
            }
        });
    }).then(function (data) {
        res.status(200).json(data)
    }).catch(err => {
        res.status(500).json({ result: err.message })
    });
}

const deleteTrip = (req, res) => {
    checkPermission(req.user.user_id, req.params.id, Permission.own).then(() => {
        return Models.Trip.destroy({
            where: { id: req.params.id }
        });
    }).then(function (data) {
        res.status(200).json(data)
    }).catch(err => {
        res.status(500).json({ result: err.message })
    })
}

module.exports = {
    createTrip, getTrip, updateTrip, deleteTrip
}
