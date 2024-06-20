import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: 'Something went wrong'}]
  })
}

/*//console.log(err) -> /errors é uma propriedade disponível p/ erros (sendo um array de objetos c/ vários props.)
    const formattedErrors = err.errors.map((error) => { 
      if (error.type === 'field') {
        return { message: error.msg, field: error.path };
      }
    }); */