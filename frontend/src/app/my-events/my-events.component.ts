import { Component } from '@angular/core';
import { Event, EventService } from '../event.service';
import { ActivatedRoute, Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { Profile } from '../profile/profile.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent {

  public static Route: Route = {
    path: 'my-events',
    component: MyEventsComponent, 
    title: 'My Events', 
    canActivate: [isAuthenticated], 
    resolve: { profile: profileResolver }
  };
  
  public my_events$: Observable<Event[]>

  constructor(private eventService: EventService, route: ActivatedRoute, private http: HttpClient, protected snackBar: MatSnackBar) {
    this.my_events$ = eventService.getMyEvents()
  }

  // A function to cancel a user's attendance from an event, delegates to service
  onCancel(event: Event) {
    this.eventService.removeUserFromEvent(event).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
    this.snackBar.open("Successfully cancelled registration for " + event.name, "", { duration: 2000 })
  }

  onSuccess(): void {
    this.my_events$ = this.eventService.getMyEvents()
  }

  onError(err: Error) : void{
    if (err.message) {
      console.log(err)
      window.alert("The error is: " + err.message);
    } else {
      window.alert("Unknown error: " + JSON.stringify(err));
    }
  }

  // Function to determine whether or not a student is part of an event
  isUserInEvent(event: Event) {
    // Delegate to the service. 
    return this.eventService.isUserInEvent(event)
  }

  // Function to determine whether use sees short or long description for event
  alterText(event: Event) {
    event.show_short_description = !event.show_short_description
  }

  // Function that returns the shortened version of an event's description
  getShortDescription(event: Event): String {
    if (event.description.length <= 67) {
      return event.description
    }
    return event.description.substring(0, 67) + "..."
  }
}
