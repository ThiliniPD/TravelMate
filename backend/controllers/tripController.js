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
    createTrip, getTrip, updateTrip, deleteTrip
}
