const express = require("express");
const router = express.Router();
const carController = require("../controllers/car.controller");

router.post('/create', carController.saveCar);
router.get('/all', carController.getAll);

module.exports = router;