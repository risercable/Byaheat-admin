const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver.controller");

router.get('/getAll', driverController.getDrivers);
router.get('/:id', driverController.getById);

module.exports = router;
