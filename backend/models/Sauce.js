const mongoose = require('mongoose');

//schéma de données 
const sauceSchema = mongoose.Schema({
  //différents champs dont sauce aura besoin
  userId: { type: String, required: true },
  name: {type: String, required: true},
  manufacturer: {type: String, required: true},
  description: {type: String, required: true},
  mainPepper:{type: String, required: true },
  imageUrl: { type: String, required: true }, 
  heat: {type: Number, required: true},
  likes: {type: Number, required: false},
  dislikes:{type: Number, required: false},
  usersLiked: {type: [String], required: false},
  usersDisliked: {type: [String], required: false},

});
//export du model correspondant
module.exports = mongoose.model('Sauce', sauceSchema);