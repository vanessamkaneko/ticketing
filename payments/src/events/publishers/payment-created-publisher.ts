import { Subjects, Publisher, PaymentCreatedEvent } from "@vmktickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
