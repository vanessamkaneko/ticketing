import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt) // mudando p/ implementação a base de callbacks (scrypt) p/ um a base de promises

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex'); // gerando string aleatória
    const buf = (await scryptAsync(password, salt, 64)) as Buffer; // efetivamente realizando o processo de hashing

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}