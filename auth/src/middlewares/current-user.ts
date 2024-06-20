import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string; 
}

/* estamos dizendo ao TS para encontrar dentro do projeto Express a interface da Request e adicionar a propriedade currentUser com o
valor do userPayload --> o ? significa que a propriedade pode ou não ser definida (pois o user pode não estar logado, não precisando
dessa propriedade), mas se tiver logado, vamos precisar que essa prop. esteja na req*/
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  // o user está logado?
  if(!req.session?.jwt) {  // se não tivermos a sessão OU se o jwt não está definido... | essa linha é exatamente igual a (!req.session || !req.session.jwt) 
    return next();
  } 

  try {
    /* decodificando/extraindo infos do JWT | 1º arg: token gerado, 2º arg: jwt key definida como uma variável de ambiente
    (criada no kubernetes e definida no auth-depl) -> é a signing key; necessária p/ validar o token */
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
}