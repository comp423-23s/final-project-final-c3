import { Component } from '@angular/core';
import { Event, EventService } from '../event.service';
import { ActivatedRoute, Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { Profile } from '../profile/profile.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
  public my_events_shown$: Observable<Event[]>
  public searchText = ''

  constructor(private eventService: EventService, route: ActivatedRoute, private http: HttpClient, protected snackBar: MatSnackBar) {
    this.my_events$ = eventService.getMyEvents()
    this.my_events_shown$ = this.my_events$.pipe(map((events: Event[]) => {return events.map(event => {return {...event, show_short_description: true}})}))
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
      this.snackBar.open("⚠️ Couldn't remove you from the event! This isn't your fault, but something went wrong. Please try again later." , "", { duration: 4000 })
    } else {
      this.snackBar.open("⚠️ Couldn't remove you from the event! This isn't your fault, but something went wrong. Please try again later." , "", { duration: 4000 })
    }
  }

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

  textChanged() {
    this.my_events_shown$ = this.my_events$.pipe(map((events: Event[]) => {
      return events.filter(a_event => a_event.name.toLowerCase().includes(this.searchText.toLowerCase()))
    }))
  }

  searchClose() {
    this.searchText = ''
    this.my_events_shown$ = this.my_events$.pipe(map((events: Event[]) => {return events.map(event => {return {...event, show_short_description: true}})}))
  }
}
