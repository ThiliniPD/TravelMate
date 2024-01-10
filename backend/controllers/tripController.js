"use strict";
const { Model } = require("sequelize");
const Models = require("../models");
const Permission = require("./prmissionController");

const createTrip = (req, res) => {
    req.body.ownerId = req.user.user_id;  // make sure creation user is the owner
    Models.Trip.create(req.body).then(function (data) {
        res.status(200).json(data)
    }).catch(err => {
        res.status(500).json({ result: err.message })
    })
}

const getTrip = (req, res) => {
    Permission.checkPermission(req.user.user_id, req.params.id, Permission.Type.read).then(function (data) {
        res.status(200).json(data)
    }).catch(err => {
        res.status(500).json({ result: err.message })
    })
}

const getAllTrips = (req, res) => {
    const queries = [
        Models.Trip.findAll({   // find all trips owned by me
            raw: true,
            nest: true,
            attributes: ['id', 'name', 'description', 'photo'],
            include: {
                model: Models.User,
                as: 'owner',
                attributes: ['id', 'firstName', 'lastName', 'email']
            },
            where: {
                ownerId: req.user.user_id
            }
        }),
        Models.Permission.findAll({ // find all trips shared with me
            raw: true,
            nest: true,
            where: {
                userId: req.user.user_id
            },
            include: {
                model: Models.Trip,
                attributes: ['id', 'name', 'description', 'photo'],
                include: {
                    model: Models.User,
                    as: 'owner',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            }
        })
    ]

    Promise.all(queries).then(function (data) {
        let trips = data[0].concat(data[1].map((value) => {
            return value.trip
        }))

        res.status(200).json(trips)
    }).catch(err => {
        res.status(500).json({ result: err.message })
    })
}

const updateTrip = (req, res) => {
    delete req.body.ownerId; // make sure owner is not updated while editing a map

    Permission.checkPermission(req.user.user_id, req.params.id, Permission.Type.write).then(() =>{
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
    Permission.checkPermission(req.user.user_id, req.params.id, Permission.Type.own).then(() => {
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
    createTrip, getTrip, updateTrip, deleteTrip, getAllTrips
}
