import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  // executada no browser
  axios.get('/api/users/currentuser').catch((err) => {
    console.log(err.message);
  });
 
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
   console.log(req.headers)
  if (typeof window === 'undefined') {
    // estamos no SERVER! (objeto window só existe no browser, não existe no node.js) -> console.log aparece no terminal...
    // requests devem ser feitas para http://ingress-nginx-controller.ingress-nginx.svc.cluster.local...
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', 
      {
        headers: req.headers
      }
    )
    return data;
  } else {
    // estamos no BROWSER! console.log aparece no inspecionar...
    // requests podem ser feitas com um url base '' (ex: /api/users/currentuser')
    const { data } = await axios.get('/api/users/currentuser');
    return data;
    /* espera-se que a response receba um obj. com a propriedade currentUser: se logado, terá um obj. com as credenciais; 
    não logado, recebe null*/

  }

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