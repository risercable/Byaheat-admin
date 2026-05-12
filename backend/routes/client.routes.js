const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller")

router.post('/book', clientController.registerBooking);
router.get('/all', clientController.getAllClients);

module.exports = router;