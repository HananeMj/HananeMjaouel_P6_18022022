const Sauce = require('../models/Sauce');
const fs = require('fs');//donne accès aaux systeme de fichiers
const dotenv = require('dotenv').config();

//créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersliked: [],
    usersDisliked: []
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce enregistrée !'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
//récupère une sauce 
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
//modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { 
      userId: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      heat: req.body.heat,
      likes: req.body.likes,
      dislike: req.body.dislike
};
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
    .catch(error => res.status(400).json({ error }));
};
//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  //recherche l'objet dans la base de données
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //on extrait le nom du fichier à supprimer
      const filename = sauce.imageUrl.split('/images/')[1];
      //on supprime le fichier de la base de données
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//récupère toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
//like ou dislike 
exports.likeDislike = (req, res, next) => {
  //si l'utilisateur like la sauce
  if (req.body.like === 1) {
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id },
      {
        $inc: { likes: req.body.like++ },
        $push: { usersliked: req.body.userId }
      })

      .then(() => res.status(200).json({ message: 'Like ajouté !' }))
      .catch(error => res.status(400).json({ error }));
  }
  //Si l'utilisateur supprime son like
  if (req.body.like === 0) {
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id },
      {
        $inc: { likes: req.body.like - 1 },
        $pull: { usersliked: req.body.userId }
      })

      .then(() => res.status(200).json({ message: 'like supprimé !' }))
      .catch(error => res.status(400).json({ error }))
  }
  //si l'utilisateur dislike la sauce
  if (req.body.dislike === -1) {
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id },
      {
        $inc: { likes: req.body.dislike++ - 1 },
        $push: { usersliked: req.body.userId }
      })

      .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
      .catch(error => res.status(400).json({ error }))
  }
  //si l'utilisateur supprime son dislike
  if (req.body.like === 0) {
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id },
      {
        $inc: { likes: req.body.dislike++ - 1 },
        $pull: { usersliked: req.body.userId }
      })

      .then(() => res.status(200).json({ message: 'Dislike supprimé !' }))
      .catch(error => res.status(400).json({ error }))
  }
}
