import { MongoMemoryServer } from 'mongodb-memory-server';
/* iniciará uma cópia do mongodb na memória, permitindo rodar vários testes ao mesmo tempo de diferentes projetos sem que eles tentem se
conectar a instância do mongo de uma só vez. Mongo memory também nos dá acesso direto à memória/mongodb*/
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper') /*dizendo ao jest o caminho do arquivo original que queremos fazer um fake (o fake precisa ter o mesmo nome do original pois é c/ base nele
que o doc será executado na pasta __mocks__) -> fazendo conexão fake c/ o nats p/ realizar testes */

process.env.STRIPE_KEY = 'sk_test_51PcdlPRx3ZYGNmJBqxGqxTx5HWuzFpo99hRSBAwjyuCpgBabfaKipk1S8xiokJYStC9uyI4XBirtE9YvOkssvqXk00GY62a61L'

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
  jest.clearAllMocks();
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

global.signin = (id?: string) => {
  // Build a JWT payload { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
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

