const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");
const { verifyToken } = require("../middleware/auth");

// uses authentication middleware function to verify the user and 
// set user id in request token before controller functions runs

router.get('/:tripId/permission', verifyToken, (req, res) => {
    Controllers.prmissionController.getPermissions(req, res);
})

router.post('/:tripId/permission', verifyToken, (req, res) => {
    Controllers.prmissionController.createOrUpdatePermissions(req, res)
})

router.post('/:tripId/permission/:userId', verifyToken, (req, res) => {
    Controllers.prmissionController.createOrUpdatePermissions(req, res, req.params.userId)
})

router.delete('/:tripId/permission/:userId', verifyToken, (req, res) => {
    Controllers.prmissionController.deletePermissions(req, res)
})

module.exports = router;