const Sauce = require("../models/Sauce"); //import du modèle de sauce
const fs = require("fs"); //donne accès aux systeme de fichiers
const dotenv = require("dotenv").config();//permet de créer des variables d'environnement
const jwt = require("jsonwebtoken");//création de Tokens

//créer une sauce
exports.createSauce = (req, res, next) => {
  //récupérer les champs du corps de la requête
  const sauceObject = JSON.parse(req.body.sauce);
  console.log(JSON.stringify(sauceObject));
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  //enregistrer la sauce dans la BDD
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Sauce enregistrée !",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: error.message,
      });
    });
};
//récupère une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error,
      });
    });
};
//modifier une sauce
exports.modifySauce = (req, res, next) => {
  //Recuprer le userId du token pour n'autoriser
  //que l'utilisateur qui a creer la sauce de la supprimer
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const userId = decodedToken.userId;
  //recherche l'objet dans la base de données
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce && sauce.userId == userId) {
        const sauceObject = req.file
          ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            }
          : { ...req.body };
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifié !" }))
          .catch((error) => res.status(400).json({ message: error.message }));
      } else {
        res.status(403).json({ message: "Action non autorisé!!" });
      }
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  //Récupérer le userId du token pour n'autoriser
  //que l'utilisateur qui a créer la sauce de la supprimer
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const userId = decodedToken.userId;
  //recherche l'objet dans la base de données
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce && sauce.userId == userId) {
        const filename = sauce.imageUrl.split("/images/")[1];
        //on supprime le fichier de la base de données
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
            .catch((error) => res.status(400).json({ message: error.message }));
        });
      } else {
        res.status(403).json({ message: "Action non autorisé!!" });
      }
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

//récupère toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

//liker ou disliker la sauce
exports.likeDislike = (req, res, next) => {
  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: req.body.like++ },
        $push: { usersLiked: req.body.userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Like supprimé !" });
            })
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Dislike supprimé !" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
