const db = require('../database/dbConfig')


module.exports = {
  addUser,
  filterBy,
  getByID
}


function getByID(id){
  return (
    db('users')
      .where({ id })
      .first()
  )
}

function addUser(user){
  return (
    db('users')
      .insert(user)
      .then(([id]) => {
        return getByID(id)
      })
  )
}

function filterBy(filter, value){
  return (
    db('users')
      .where({[filter]: value})
  )
}
