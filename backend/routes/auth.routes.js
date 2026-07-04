const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authController = require("../controllers/driver.controller");
const lookingForController = require("../controllers/lookingfor.controller");

router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
router.post('/lookingfor', lookingForController.create);
router.get('/lookingfor/:uid', lookingForController.get);
router.delete('/lookingfor/:uid', lookingForController.cancel);
router.post('/driver/register', authController.registerDriver);
router.post('/user/getRole', authController.getRole);
router.post('/driver/login', authController.login);
router.get('/driver/all', async (req, res) => {
  try {
    const driversData = await authController.getDrivers();
    res.json(driversData);
  } catch (error) {
    res.status(500).send('Error fetching drivers');
  }
});

module.exports = router;
