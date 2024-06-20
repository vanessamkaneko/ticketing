import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req); // verifica se há erros no request...
   //console.log(errors)

  if(!errors.isEmpty()) { // se há um erro/se o errors object não está vazio...
    throw new RequestValidationError(errors.array()); // essa classe só receberá parâmetros do tipo array (definido na declaração da classe)
  }

  next();
}