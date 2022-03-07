const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//indique dans quel dossier multer enregistrera les images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    //génère le nom du fichier et élimination des espaces
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];//génère l'extension du fichier
    callback(null, name + Date.now() + '.' + extension);
  }//ajoute un timestamp au fichier d'origine
});

module.exports = multer({storage: storage}).single('image');