import { Subjects, Publisher, ExpirationCompleteEvent } from '@vmktickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}