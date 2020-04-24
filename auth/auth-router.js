const router = require('express').Router();
const Users = require('../users/users-model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
  const creds = req.body

  try {
    const user = await Users.filterBy('username', creds.username).first()
  
    if (user){
      return res.status(409).json({ message: "Username not available."})
    }
  
    const hash = bcrypt.hashSync(creds.password)
    creds.password = hash

    const addedUser = await Users.addUser(creds)
    res.status(201).json(addedUser)

  } catch (error){
    res.status(500).json({ error: error.message })
  }
  
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await Users.filterBy('username', username).first()
  
    if (user && bcrypt.compareSync(password, user.password)){

      const payload = {
        userId: user.id,
        role: "normal"
      }

      const jwtSecret = process.env.JWT_SECRET || 'testing'

      const token = jwt.sign(payload, jwtSecret)

      return res.status(200).cookie('token', token).json({ message: `Welcome ${username}`})

      // return res.status(200).json({
      //   token: token,
      //   message: `Welcome ${username}`
      // })
    }

    res.status(409).json({ message: "Invalid credentials."})

  } catch(err){
    res.status(500).json({ error: err.message})
  }

});

module.exports = router