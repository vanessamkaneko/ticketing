import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

/* p/ termos a informação se o usuário está logado ou não já na landing page! essa informação inicial só é possível obter 
pela getInitialProps. Dentro de um Page Component, o context do getInitialProps é a requisição, na qual tem o req dentro  */
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

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