require('dotenv').config();//import de dotenv

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//import des routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');//donne accès au chemin du systeme de fichiers

//connexion à la base de données MongoDb
mongoose.connect(process.env.MONGODB_PASSWORD,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//création de l'app express
const app = express();


//Middleware permettant l'accès à l'api et l'envoi de requêtes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(bodyParser.json());
  
  //app.use permet d'attribuer un middleware à une route spécifique de l'application.
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/api/sauces', saucesRoutes);
  app.use('/api/auth', userRoutes);
 
  

  module.exports = app;