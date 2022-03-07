//import de express
const express = require('express');

const router = express.Router();

//import du controller de user
const userCtrl = require('../controllers/user');

//Valider le mot de passe
const password = require('../middleware/password-valid');

//routes user
router.post('/signup',password, userCtrl.signup);
router.post('/login', userCtrl.login);

//export du routeur
module.exports = router;