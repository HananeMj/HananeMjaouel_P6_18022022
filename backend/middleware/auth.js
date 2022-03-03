const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Id utilisateur non valide !';
    } else {
      next();
    }
  } catch {
    res.status(403).json({
      message: 'Action non autorisée !!'
    });
  }
};