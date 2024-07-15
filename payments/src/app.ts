import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser'; // basicamente: converte body da requisição em json
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@vmktickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, //desabilitando encriptação no cookie (pois pode causar conflitos dependendo da linguagem utilizada)
    secure: process.env.NODE_ENV !== 'test' /* sempre que forem rodados testes jest no terminal, essa variável de node environment será 
    igual a test (retornando false, possibilitando o envio de cookie mesmo em requisições http); por outro lado, se estivermos em outro 
    environment (development ou production), o secure retornará true  */

    /* secure: true // cookies serão compartilhados apenas p/ requests c/ conexão HTTPS --> por estarmos utilizando o Supertest e ele não
    fazer requisições https (e sim http), tivemos que mudar o valor do secure p/ o código de autenticação funcionar mesmo em ambiente
    de testes */
  })
)
app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };
