const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver.controller");

router.get('/getAll', driverController.getDrivers);
router.get('/getUndispatched', driverController.getUndispatchedDrivers);
router.post('/register', driverController.registerDriver);
router.post('/login', driverController.login);
router.get('/:id', driverController.getById);

module.exports = router;
