import { Component } from '@angular/core';
import { EventObject, EventService } from '../event.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent {
  public my_events: EventObject[]

  constructor(eventService: EventService) {
    this.my_events = eventService.getMyEvents()
  }

}
