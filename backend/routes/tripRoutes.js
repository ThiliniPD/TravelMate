const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");
const { verifyToken } = require("../middleware/auth");

// uses authentication middleware function to verify the user and 
// set user id in request token before controller functions runs

router.get('/:id', verifyToken, (req, res) => {
    Controllers.tripController.getTrip(req, res);
})

router.get('/', verifyToken, (req, res) => {
    Controllers.tripController.getAllTrips(req, res);
})

router.post('/', verifyToken, (req, res) => {
    Controllers.tripController.createTrip(req, res)
})

router.put('/:id', verifyToken, (req, res) => {
    Controllers.tripController.updateTrip(req, res)
})

router.delete('/:id', verifyToken, (req, res) => {
    Controllers.tripController.deleteTrip(req, res)
})

module.exports = router;