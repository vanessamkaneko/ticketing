import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser}/>
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
}

AppComponent.getInitialProps = async appContext => {
  // console.log(appContext) -> retorna várias props. e objs, sendo o Component a prop. de um obj., e o getInitialProps uma prop. do obj. Component
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  // se o appContext.(...) existir, o pageProps receberá tal valor...
  if(appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser); /* aqui é invocada o getInitialProps da Landing Page -> 
    s/ essa etapa, apenas o getInitialProps do App Component era executado, o da Landing Page não. Portanto, assim é que executamos o
    getInitialProps e recebemos as infos de páginas individuais 
    
    -> pageProps retorna o currentUser c/ id, email e iat
    */
  }

  return {
    pageProps,
    ...data //currentUser: data.currentUser
  }
}

export default AppComponent;

/* ao definir o getInitialProps para um Custom App Component, ao invés do argumento context ser um obj. com as props. req e res
 ({ req, res }) que nem ocorre no contexto de uma página (como no da Landing Page), no contexto do App Component, essas props. estão dentro 
  de uma outra prop. chamada ctx (então context === {Component, ctx: { req, res }})
  
 -> prop. ctx: vai p/ páginas individuais
 */