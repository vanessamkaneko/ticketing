import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  //readonly: prevents a property of a class from being changed
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    msg.ack(); /* aqui, uma vez que o evento foi recebido, o processo termina (s/ ele, o evento ficaria sendo reenviado a cada 30s (default)
    do .setManualAckMode p/ os membros do queue group) */
  }
}