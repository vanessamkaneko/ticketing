import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  })

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    /* setManualAckMode(true) é p/ garantir o processamento completo do evento recebido, caso não ocorra, terá algum erro e o NATS tentará
    reenviar o evento p/ reprocessamento a fim dele não se perder no caminho*/
    .setDeliverAllAvailable()
    .setDurableName('accounting-service');

  const subscription = stan.subscribe('ticket:created', 'queue-group-name', options);
  // 1º nome do channel que quer "escutar" | nome do queue group

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`RECEIVED message (event) #${msg.getSequence()}, with data: ${data}!`)
    }

    msg.ack(); /* aqui, uma vez que o evento foi recebido, o processo termina (s/ ele, o evento ficaria sendo reenviado a cada 30s (default)
    do .setManualAckMode p/ os membros do queue group) */
  })
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())

abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;


  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message received: ${this.subject} / ${this.queueGroupName}`
      );

      const parsedData = this.parseMessage(msg)
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8')) //parse a Buffer e get a JSON from it
  }
}