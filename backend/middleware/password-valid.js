const passwordValidator = require('password-validator');

//créer un schéma de validation
const passwordSchema = new passwordValidator();

//ajouter des propriétés
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(50)                                   // Maximum length 50
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters                                 // Maximum length 100
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces


module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        res.status(400).json({error : "Le mot passe n'est pas assez fort !" + passwordSchema.validate('req.body.password', { list: true })})
        
    }
}



