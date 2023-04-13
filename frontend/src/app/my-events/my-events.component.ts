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

  // onDelete(event1: Event) {
  //   let event = event1;
  //   // how to pass in event1
  //   this.http.delete<Event>('/api/event/delete').subscribe( {
  //     next: (x) => this.reload(),
  //     error: (err) => this.onError(err)
  //   })
  // }

  // reload(): void {
  //   this.my_events$ = this.eventService.getMyEvents(this.profile.pid)
  // }

  // private onError(err: HttpErrorResponse) {
  //   if (err.error.detail) {
  //     window.alert(err.error.detail);
  //   } else {
  //     window.alert("Unknown error: " + JSON.stringify(err));
  //   }
  // }

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
