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

  constructor(private eventService: EventService, private http: HttpClient, protected snackBar: MatSnackBar) {
    this.events$ = eventService.getAllEvents()
  }

  // Function to either add or remove a member from an event's attendance
  changeStatus(event: Event) {
    // TODO: implement
    if (this.isUserInEvent(event)) {
      this.onCancel(event)
    }
    else {
      this.onRegister(event)
    }
  }

  private onRegister(event: Event) {
    this.snackBar.open("Successfully registered for " + event.name, "", { duration: 2000 })
  }

  private onCancel(event: Event) {
    this.snackBar.open("Successfully cancelled registration for " + event.name, "", { duration: 2000 })
  }

  // Function to determine whether or not a student is part of an event
  isUserInEvent(event: Event) {
    // Delegate to the service. 
    return this.eventService.isUserInEvent(event)
  }

  alterText(event: Event) {
    event.show_short_description = !event.show_short_description
  }

  getShortDescription(event: Event): String {
    if (event.description.length <= 25) {
      return event.description
    }
    return event.description.substring(0, 25) + "..."
  }
}