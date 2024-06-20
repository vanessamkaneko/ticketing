import request from 'supertest'; // permite fazer requisições fake p/ a aplicação express diretamente aqui no VSCode
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)
})

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test',
      password: 'password'
    })
    .expect(400)
})

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'p'
    })
    .expect(400)
})

it('returns a 400 with missing email and/or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'aaa@test.com'
    })
    .expect(400)

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'blablabla'
    })
    .expect(400)
})

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400)
})

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined(); // verificando no header se o Set-Cookie foi enviado na resposta
})