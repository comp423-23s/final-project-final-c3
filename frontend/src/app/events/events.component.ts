import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Event, EventService } from '../event.service'
import { ActivatedRoute, Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { Profile } from '../profile/profile.service';

// TODO: import correct event type

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  // Use an observable class so that the event data can be synchronous with the database
  
  public static Route: Route = {
    path: 'events',
    component: EventsComponent, 
    title: 'All Events', 
    canActivate: [isAuthenticated], 
    resolve: { profile: profileResolver }
  };

  public events$: Observable<Event[]>

  constructor(eventService: EventService, private http: HttpClient) {
    this.events$ = eventService.getAllEvents()
  }

}