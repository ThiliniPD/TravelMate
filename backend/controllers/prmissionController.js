"use strict";
const { Model } = require("sequelize");
const Models = require("../models");

const Type = {
    read: 0,
    write: 1,
    own: 2,
}

const checkPermission = async (userId, tripId, permission) => {
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

        // add the owner to permisssion list
        trip.permission.push({ type: Type.own, user : trip.owner });

        return trip;
    }).catch((e) => {
        console.log("prmission check exception: ", e);
        throw e;
    });
}

const getPermissions = (req, res) => {
    // anyone with read access can get permissions for a trip
    checkPermission(req.user.user_id, req.params.tripId, Type.read).then((data) => {
        res.status(200).json(data.permission)
    }).catch(err => {
        res.status(500).json({ result: err.message })
    })
}

const createOrUpdatePermissions = (req, res, userId) => {
    const { type, email } = req.body;
    if ((type != Type.own && type != Type.write && type != Type.read) || email == "") {
        res.status(400).json({ result: 'Invalid request data' });
        return;
    }

    // only the owner can create/update permission for a trip
    checkPermission(req.user.user_id, req.params.tripId, Type.owner).then((data) => {
        let permissions = data.permission;
        if (data.owner.email == email) {
            // this is the owner. nothing to create. he already has access
            return permissions;
        }

        let permission = permissions.find((value) => {
            return (value.user.email == email)
        })

        if (permission) {
            // permission record already available in table
            return Models.Permission.update({
                type: type,
                where: {
                    tripId: req.params.tripId, 
                    userId: update.user.id,
                }
            }).then(() => {
                // update the permission object and return the permissions array
                permission.type = type;
                return permissions;
            })
        }
        else {
            // find user ID from email and add permission record to database
            return Models.User.findOne({
                raw: true,
                nest: true,
                attributes: ['id', 'firstName', 'lastName', 'email'],
                where: {
                    email: email
                }
            }).then((user) => {
                return Models.Permission.create({
                    type: type,
                    tripId: req.params.tripId,
                    userId: user.id,
                })
            }).then(() => {
                permissions.push({ type: type, user: user});
                return permissions;
            })
        }
    }).then((permissions) => {
        res.status(200).json(permissions)
    }).catch(err => {
        res.status(500).json({ result: err.message })
    })
}

const deletePermissions = (req, res) => {
    const { email } = req.body;

    // The owner can delete permission for a trip
    // The user can delete his own permission for a trip
    checkPermission(req.user.user_id, req.params.tripId, Type.read).then((data) => {
        // find the permission record to delete
        let permission = data.permission.find((value) => {
            return value.email == email;
        });

        let canDelete = false;
        if (permission.user.id == data.owner.id) {
            // can't remove owner permission
            canDelete = false;
        }
        else if (data.owner.id == req.user.user_id) {
            // owner can delete any permissions
            canDelete = true;
        }
        if (permission.user.id == req.user.user_id) {
            // can delete his own permission
            canDelete = true;
        }

        if (!canDelete) {
            throw { message: 'Not allowed' }
        }
        else {
            Models.Permission.destroy({
                where: {
                    tripId: req.params.tripId, 
                    userId: permission.user.id,
                }
            }).then(() => {
                return data.permission.filter((value) => {
                    return value.user.email == email;
                })
            })
        }
    }).then((data) => {
        res.status(200).json(data.permission)
    }).catch(err => {
        res.status(500).json({ result: err.message })
    })
}

module.exports = {
    createOrUpdatePermissions, getPermissions, 
    deletePermissions, checkPermission, Type
}
