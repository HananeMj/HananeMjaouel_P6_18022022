const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');//limte la demande de l'utilisateur

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');//donne accès au chemin du systeme de fichiers
const cors = require('cors');//

//connexion à la base de données MongoDb
mongoose.connect('process.env.MONGODB_PASSWORD',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//création de l'app express
const app = express();


//donne accès au corps de la requête
app.use(express.json());
app.use(limiter);
//middleware permettant de limiter les demandes d'un même utilisateur
const limiter = rateLimit({
  max: 100, 
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP"
});

//Middleware permettant l'accès à l'api et l'envoi de requêtes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(bodyParser.json());
  app.use(cors());
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/api/sauces', saucesRoutes);
  app.use('/api/auth', userRoutes);
 
  

  module.exports = app;