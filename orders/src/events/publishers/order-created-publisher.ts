import { Publisher, OrderCreatedEvent, Subjects } from "@vmktickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

