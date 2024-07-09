import { Publisher, OrderCancelledEvent, Subjects } from "@vmktickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

