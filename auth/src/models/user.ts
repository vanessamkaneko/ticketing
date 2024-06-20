import mongoose from 'mongoose';
import { Password } from '../services/password';

// 1. Interface que descreve as propriedades que são requeridas para criar um novo User
interface UserAttrs {
  email: string;
  password: string;
}

// 2. Interface que descreve as propriedades que um User Model possui (no caso, descrevendo o método build associado ao User Model)
/* Para que o TS faça parte da criação do User e aponte erros caso houver, implementaremos o uso da função build, utilizando-se das
interfaces que criamos (pois se um user fosse criado apenas pelo new User, caso uma propriedade fosse escrita errada ou mesmo se outra prop. 
fosse adicionada na hora da criação, o TS não acusa como erro, pois não sabe com que tipo de dados está lidando...) */
// --> assim sendo, este é um pequeno truque p/ conseguir trabalhar com o mongoose junto com o TS
// User Model -> se refere à uma COLEÇÃO de dados
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// 3. Interface que descreve as propriedades que um User Document possui (User Document -> refere-se as props. de UM user)
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) { // doc = User document | ret = retorno recebido pelo usuário
      ret.id = ret._id;
      delete ret._id;
      delete ret.password; // password não aparecerá no retorno 
      delete ret.__v;
    }
  }
});
/* toJSON: o retorno ao se criar um User será em JSON e customizado pelo transform: escolhemos as propriedades que queremos que
sejam retornadas ao usuário... */


/*Mongoose não se dá muito bem com a sintaxe async/await, assim p/ lidar com código assíncrono dessa callback function, utilizamos o done
argument p/ dizer que todo o trabalho já foi realizado aqui... */
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) { // o this se refere ao doc que está sendo salvo, no caso o User Document (na criação de um User já cai aqui...)
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
// <UserDoc, UserModel> podemos pensar neles como argumentos da função que customizam os types
//<firstArg, secArg>: firstArg se refere mongoose.Document e secArg se refere ao mongoose.Model
// secArg se refere ao tipo de valor que a função model retornará (no caso, irá retornar algo do tipo UserModel... ) 

export { User };


/* As props. que passamos p/ o User constructor não necessariamente serão as únicas disponíveis no User:
EX: const user = new User({email: 'teste@teste.com, password: 'jk3jfk'}) -> no caso agora fazemos isso com o User.build({})
console.log(user); -> { email: '...', password: '...', createdAt: '...', 'updatedAt: '...'}
--- > Implementando a interface 3, garantimos que somente o email e password serão retornados, restringindo acesso às props.
não especificadas. Caso queira dar acesso a outras props., adicioná-la na interface UserDoc

const user = User.build({
  email: 'teste@test.com',
  password: 'klsfflg'
}) ---> aqui é possível acessar user.email e user.password, mas um user.createdAt não, por ex.

*/

