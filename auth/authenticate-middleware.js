const jwt = require('jsonwebtoken')

/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

module.exports = async (req, res, next) => {
  try {
    const { token } = req.cookies

    if (!token){
      res.status(401).json({ message: "Invalid credentials."})
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err){
        return res.status(401).json({ message: "Invalid credentials."})
      }
  
      req.token = decoded
      console.log(decoded)
  
      next()
    })
  } catch(err){
    next(err)
  }

};
