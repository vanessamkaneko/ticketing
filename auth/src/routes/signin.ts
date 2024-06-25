import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@vmktickets/common';

import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid!'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password!')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if(!existingUser) {
      throw new BadRequestError('Invalid credentials!');
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);

    if(!passwordsMatch) {
      throw new BadRequestError ('Invalid credentials!');
    }

    // Gerar JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email
      },
      process.env.JWT_KEY! // o ! é p/ dizer ao TS que essa variável foi definida (sem ele, o TS dava erro pois dizia que poderia retornar undefined, mesmo tendo a checagem definida no index)
    );

    // Armazená-lo no objeto da sessão
    req.session = {
      jwt: userJwt
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };