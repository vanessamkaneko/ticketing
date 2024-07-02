import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';

export class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'payments-service';

  onMessage(data: any, msg: Message) {
    console.log('Event data!', data);

    msg.ack(); /* aqui, uma vez que o evento foi recebido, o processo termina (s/ ele, o evento ficaria sendo reenviado a cada 30s (default)
    do .setManualAckMode p/ os membros do queue group) */
  }
}