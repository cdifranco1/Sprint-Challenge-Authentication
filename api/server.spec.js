const request = require('supertest')
const db = require('../database/dbConfig')
const server = require('./server')
const cookieParser = require('cookie-parser')


describe("server", () => {
  describe("index route", () => {
    it("should return a status 200 OK", async () => {
      const response = await request(server).get('/')

      expect(response.status).toEqual(200)
    })
  })
  
  describe("POST /register", () => {
    beforeEach(async () => {
      await db("users").truncate()
    })

    it("should return a 201 on success", async () => {
      const user = {
        username: 'charlie',
        password: 'pass123'
      }

      const response = await request(server).post('/api/auth/register').send(user)

      expect(response.status).toEqual(201)
    })

    it("should add the user to the database", async () => {
      const user = {
        username: 'charlie',
        password: 'pass123'
      }

      const currentUsers = await db('users')
      expect(currentUsers).toHaveLength(0)

      const response = await request(server).post('/api/auth/register').send(user)
      expect(response.body).toHaveProperty('id')
      
      const added = await db('users') 
      expect(added).toHaveLength(1)
    })
  })
  
  describe("POST /login", () => {
    const user = {
      username: 'charlie',
      password: 'pass123'
    }
    
    beforeEach(async () => {
      await db('users').truncate()
      await request(server).post('/api/auth/register').send(user)
    })

    it("should return a 200 on success", async () => {
      const response = await request(server).post('/api/auth/login').send(user)

      expect(response.status).toEqual(200)
    })

    it("should return a 'Welcome User' message", async () => {
      
      const response = await request(server).post('/api/auth/login').send(user)

      expect(response.body.message).toBe('Welcome charlie')
    })

    it("should return a 409 on denied access", async () => {
      const invalid = {
        username: 'joe',
        password: 'hello'
      }

      const response = await request(server).post('/api/auth/login').send(invalid)

      expect(response.status).toEqual(409)
    })
  })

  describe("GET /jokes", () => {
    beforeEach(async () => {
      await db("users").truncate()
    })

    it("should return a message with 'Invalid Credentials' when no token", async () => {

      const response = await request(server).post('/api/jokes')
      
      expect(response.body.message).toEqual("Invalid credentials.")
    })
      
    it("expect status 401 when no token", async () => {
     
      const response = await request(server).post('/api/jokes')
      
      expect(response.status).toEqual(401)
      
    })
  })
})


