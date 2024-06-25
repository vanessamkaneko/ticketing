import { MongoMemoryServer } from 'mongodb-memory-server';
/* iniciará uma cópia do mongodb na memória, permitindo rodar vários testes ao mesmo tempo de diferentes projetos sem que eles tentem se
conectar a instância do mongo de uma só vez. Mongo memory também nos dá acesso direto à memória/mongodb*/
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

// função que irá rodar antes de todos os testes serem executados
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'sdffadsf';

  mongo = await MongoMemoryServer.create(); // criando mongo memory
  const mongoUri = mongo.getUri(); // tentando obter a uri do mongo memory p/ se conectar

  await mongoose.connect(mongoUri, {})
})

// irá rodar antes de cada teste
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections(); // nos dá todas as coleções que existem no database

  for (let collection of collections) { // irá fazer o loop em toda as coleções e deletar todos os dados de dentro deles (resetar todos os dados)
    await collection.deleteMany({})
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // Build a JWT payload { id, email }
  const payload = {
    id: 'jalksdjalkf',
    email: 'test@test.com'
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object { jwt: MY_JWT }
  const session = { jwt: token }

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
}

/* declare global {
  var signin: () => string[];
}
  
  return [`session=${base64}`];
*/