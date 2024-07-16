import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>;
  // se currentUser estiver definido: you are... | senão: you are NOT...
};


/* p/ termos a informação se o usuário está logado ou não já na landing page! essa informação inicial só é possível obter 
pela getInitialProps. Dentro de um Page Component, o context do getInitialProps é a requisiçaõ, na qual tem o req dentro  */
LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {}
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