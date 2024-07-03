import { Publisher, Subjects, TicketCreatedEvent } from '@vmktickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}