// Criando uma conexão nats FAKE a fim de se fazer testes s/ ter que se conectar ao real

export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(
      (subject: string, data: string, callback: () => void) => {
        callback()
      })
  },
};