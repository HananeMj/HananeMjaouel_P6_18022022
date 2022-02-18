const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require(' ../middleware/multer-config');


router.post('/', auth, saucesCtrl.createSauce);//créer une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce);//modifier une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);//supprimer une sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);//récupérer une sauce
router.get('/', auth, multer, saucesCtrl.getAllSauces);//récupérer toutes les sauces 
router.post('/:id/like' , auth, multer,  saucesCtrl.likeDislike);//liker la sauce

module.exports = router;