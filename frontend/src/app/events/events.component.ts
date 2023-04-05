import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Event, EventService } from '../event.service'
import { ActivatedRoute, Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(eventService: EventService, private http: HttpClient, protected snackBar: MatSnackBar) {
    this.events$ = eventService.getAllEvents()
  }

  // Function to add a student to an event's attendance
  onRegister(event: Event) {
    // TODO: implement
    this.onSuccess(event)
  }

  private onSuccess(event: Event) {
    this.snackBar.open("Successfully registered for " + event.name, "", { duration: 2000 })
  }
}