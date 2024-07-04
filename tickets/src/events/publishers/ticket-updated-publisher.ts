import { Publisher, Subjects, TicketUpdatedEvent } from '@vmktickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}