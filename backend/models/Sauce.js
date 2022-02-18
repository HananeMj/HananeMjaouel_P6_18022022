const mongoose = require('mongoose');

//schéma de données 
const sauceSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  manufacturer: {type: String, required: true},
  price: { type: Number, required: true },
  mainPepper:{type: String, required: true },
  heat: {type: Number, required: true},
  likes: {type: Number, required: false},
  dislikes:{type: Number, required: false},
  usersLiked: {type: Array, required: false},
  usersDisliked: {type: Array, required: false},

});
//export du model correspondant
module.exports = mongoose.model('Sauce', sauceSchema);