import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) { // aqui estamos dizendo que o errors é do tipo ValidationError (que é do próprio express) e que tem valor do tipo array (vazio, no caso)
    super('Invalid request parameter');

    // Apenas porque estamos extendendo uma classe da própria linguagem
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path };
      }
      return { message: err.msg };
    });
  }

}
