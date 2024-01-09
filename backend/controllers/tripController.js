"use strict";
const Models = require("../models");

const checkPermission = (userId, tripId, checkWrite) => {
    return Models.Trip.findOne({
        where: { id: tripId }, 
        include: {
            model: Models.User,
            attributes: ['id'],
            through: {
                attributes: ['type']
            }
        }
    }).then(function (data) {
        if (data.owner != userId) {
            const user = data.users.find((user) => user.id == userId);
            if (!user || (checkWrite && user.permissions.type != 1)) {
                // no permission for this map for the user
                throw { message: 'Permission denied' };
            }
        }

        return data;
    });
}

const createTrip = (req, res) => {
    req.body.owner = req.user;  // make sure creation user is the owner
    Models.Trip.create(req.body).then(function (data) {
        res.status(200).json(data)
    }).catch(err => {
        res.status(500).json({ result: err.message })
    })
}

const getTrip = (req, res) => {
    checkPermission(req.user, req.params.id, false).then(function (data) {
        res.status(200).json({ result: 'User data fetched successfully', data: data })
    }).catch(err => {
        res.status(500).json({ result: err.message })
    })
}

const updateTrip = (req, res) => {
    delete req.body.owner; // make sure owner is not updated while editing a map

    checkPermission(req.user, req.params.id, true).then(() =>{
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
    checkPermission(req.user, req.params.id, true).then(() => {
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
