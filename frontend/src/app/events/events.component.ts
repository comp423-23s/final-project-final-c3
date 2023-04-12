import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Event, EventService, User_Event } from '../event.service'
import { ActivatedRoute, Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from '../profile/profile.service';

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
  public user_events$: Observable<User_Event[]>
  public profile: Profile

  constructor(private eventService: EventService, private http: HttpClient, protected snackBar: MatSnackBar, route: ActivatedRoute) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.events$ = eventService.getAllEvents()
    this.events$ = this.events$.pipe(map((events: Event[]) => {return events.map(event => {return {...event, show_short_description: true}})}))
    this.user_events$ = this.events$.pipe(map((events: Event[]) => {
      return events.map(a_event => {
        const user_event : User_Event = {
          event: a_event, 
          is_joined: a_event.members.map(member => member.id).includes(this.profile.id)
        }
        return user_event
      })
    }))
  }

  // Function to either add or remove a member from an event's attendance
  changeStatus(user_event: User_Event) {
    // TODO: implement
    if (user_event.is_joined) {
      this.onCancel(user_event.event)
    }
    else {
      this.onRegister(user_event.event)
    }
  }

  onRegister(event: Event) {
    this.eventService.addUserToEvent(event).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
    this.snackBar.open("Successfully registered for " + event.name, "", { duration: 2000 })
  }

  onCancel(event: Event) {
    this.eventService.removeUserFromEvent(event).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
    this.snackBar.open("Successfully cancelled registration for " + event.name, "", { duration: 2000 })
  }

  onSuccess(): void {
    this.events$ = this.eventService.getAllEvents()
    this.events$ = this.events$.pipe(map((events: Event[]) => {return events.map(event => {return {...event, show_short_description: true}})}))
    this.user_events$ = this.events$.pipe(map((events: Event[]) => {
      return events.map(a_event => {
        const user_event : User_Event = {
          event: a_event, 
          is_joined: a_event.members.map(member => member.id).includes(this.profile.id)
        }
        return user_event
      })
    }))
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