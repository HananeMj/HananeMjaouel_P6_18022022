const bcrypt = require('bcrypt');//package qui permet de crypter les mots de passe
const User = require('../models/User');
const jwt = require('jsonwebtoken');
//importation de crypto-js pour crypter l'email
const cryptoJs = require('crypto-js');

 //créer un nouvel utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)//hacher le mot de passe et salé 10 fois(combien de fois sera exécuter le hashage)
      .then(hash => {
        const user = new User({
           //crypter l'email avant de l'envoyer dans la base de données
          email: cryptoJs.HmacSHA256(req.body.email, process.env.SECRET_KEY).toString(),
          password: hash
        });
        user.save()//enregistrer l'utilisateur dans la base de données
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ message: error.message }));
      })
      .catch(error => res.status(500).json({ message: error.message }));
  };
//connexion utilisateur
  exports.login = (req, res, next) => {
    //retrouver l'email crypté
    const emailCryptedResearch = cryptoJs.HmacSHA256(req.body.email, process.env.SECRET_KEY).toString();
    User.findOne({ email: emailCryptedResearch })
      .then(user => {
        if (!user) {
          return res.status(400).json({ message: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ message: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.TOKEN_SECRET,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ message: error.message }));
      })
      .catch(error => res.status(500).json({ message: error.message }));
  };