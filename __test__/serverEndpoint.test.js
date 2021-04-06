const app = require('../src/server/server')
const supertest = require('supertest')
const request = supertest(app)
 
it('Testing / endpoint', async done => {
  const response = await request.get('/')
  
  expect(response.status).toBe(200) 
  expect(response.body).toBeDefined();

  done()
})