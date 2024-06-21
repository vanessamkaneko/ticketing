import buildClient from "../api/build-client";
import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>;
  // se currentUser estiver definido: you are... | senão: you are NOT...
};


/* p/ termos a informação se o usuário está logado ou não já na landing page! essa informação inicial só é possível obter 
pela getInitialProps. Dentro de um Page Component, o context do getInitialProps é igual a { req, res } (retorna */
LandingPage.getInitialProps = async context => {
  console.log('LANDING PAGE!')
  console.log(context)
  const client = buildClient(context)
  // recebe a URL pronta (http://ingress-nginx....) c/ os headers p/ se fazer a requisição c/ o método que precisar (no caso será get)

  const { data } = await client.get('/api/users/currentuser');
  // pega os dados dessa rota (no caso, o id, email, headers (que tem os cookies...) do usuário logado) 

  return data;
  // dados irão como parâmetro diretamente p/ a função da LandingPage
}

export default LandingPage;









/* 

// componente
const LandingPage = ({ color }) => {
  console.log('I am in the component!', color);
  return <h1>Landing page</h1>
}

-> essa função é executada durante o processo de SSR, qualquer dado retornado (normalmente na forma de objeto) será fornecido ao componente
 como sendo uma propriedade 
LandingPage.getInitialProps = () => {
  console.log('I am on the server!');

  return { color: 'red' }

  LandingPage.getInitialProps = async () => {
  const response = await axios.get('/api/users/currentuser'); // executada no server
  
  return response.data;
}
} */