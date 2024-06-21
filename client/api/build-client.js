import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // Estamos no SERVER
    /* (objeto window só existe no browser, não existe no node.js) 
     requests devem ser feitas para http://ingress-nginx-controller.ingress-nginx.svc.cluster.local... */
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  } else {
    // Estamos no BROWSER
    //requests podem ser feitas com um url base '' (ex: /api/users/currentuser') 
    return axios.create({
      baseUrl: '/'
    })
  }
}