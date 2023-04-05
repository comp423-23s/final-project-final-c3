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
  public profile: Profile

  constructor(private eventService: EventService, route: ActivatedRoute, private http: HttpClient, protected snackBar: MatSnackBar) {
    this.eventService = eventService
    const data = route.snapshot.data as { profile: Profile }
    console.log(route.snapshot)
    this.profile = data.profile
    this.my_events$ = eventService.getMyEvents(this.profile.pid)
  }

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
}
