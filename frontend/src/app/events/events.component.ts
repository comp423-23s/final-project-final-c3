import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Event, User_Event, EventService } from '../event.service'
import { ActivatedRoute, ChildActivationStart, Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile, ProfileService } from '../profile/profile.service';
import * as moment from 'moment' ;

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

  public profile: Profile
  public events$: Observable<Event[]>
  public user_events$: Observable<User_Event[]>
  public searchText = ''
  public currentDate = new Date()

  constructor(route: ActivatedRoute, private eventService: EventService, private profileService: ProfileService, private http: HttpClient, protected snackBar: MatSnackBar) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.events$ = eventService.getAllEvents()
    this.events$ = this.events$.pipe(map((events: Event[]) => {return events.map(event => {return {...event, show_short_description: true}})}))
    this.user_events$ = this.events$.pipe(map((events: Event[]) => {
      return events.map(a_event => {
        const user_event: User_Event = {
          event: a_event, 
          is_joined: a_event.attendees.map(attendee => attendee.id).includes(this.profile.id)
        }
        return user_event
      })
    }))
    this.events$ = this.events$.pipe(map((events: Event[]) => {return events.map(event => {return {...event, show_short_description: true}})}))
    this.user_events$ = this.events$.pipe(map((events: Event[]) => {
      return events.map(a_event => {
        const user_event: User_Event = {
          event: a_event, 
          is_joined: a_event.attendees.map(attendee => attendee.id).includes(this.profile.id)
        }
        return user_event
      })
    }))
  }

  // Function to either add or remove a member from an event's attendance
  changeStatus(user_event: User_Event): void {
    if (user_event.is_joined) {
      this.onCancel(user_event.event)
    } else {
      this.onRegister(user_event.event)
    }
  }

  onRegister(event: Event): void {
    this.profileService.http.get<Profile>('/api/profile').subscribe(
      {
        next: (data) => {this.onSuccessUpdateProfile(data)},
        error: (err) => console.log(err)
      }
    )
    this.eventService.addUserToEvent(event).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
    this.snackBar.open("Successfully registered for " + event.name, "", { duration: 2000 })
  }

  private onSuccessUpdateProfile(profile: Profile): void {
    this.profile = profile
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
          is_joined: a_event.attendees?.map(attendee => attendee.id).includes(this.profile.id)
        }
        return user_event
      })
    }))
    this.events$ = this.events$.pipe(map((events: Event[]) => {return events.map(event => {return {...event, show_short_description: true}})}))
    this.user_events$ = this.events$.pipe(map((events: Event[]) => {
      return events.map(a_event => {
        const user_event : User_Event = {
          event: a_event, 
          is_joined: a_event.attendees?.map(attendee => attendee.id).includes(this.profile.id)
        }
        return user_event
      })
    }))
  }

  onError(err: Error) : void{
    if (err.message) {
      console.log(err)
      this.snackBar.open("⚠️ This isn't your fault, but something went wrong. Please try again later." , "", { duration: 4000 })
    } else {
      this.snackBar.open("⚠️ This isn't your fault, but something went wrong. Please try again later." , "", { duration: 4000 })
    }
  }

  alterText(event: Event) {
    event.show_short_description = !event.show_short_description
  }

  // A function to get a shortened version of an event's description
  getShortDescription(event: Event): String {
    if (event.description.length <= 67) {
      return event.description
    }
    return event.description.substring(0, 67) + "..."
  }

  textChanged() {
    this.user_events$ = this.user_events$.pipe(map((user_events: User_Event[]) => {
      return user_events.filter(a_user_event => a_user_event.event.name.toLowerCase().includes(this.searchText.toLowerCase()))
    }))
  }

  searchClose() {
    this.searchText = ''
    this.user_events$ = this.events$.pipe(map((events: Event[]) => {
      return events.map(a_event => {
        const user_event: User_Event = {
          event: a_event, 
          is_joined: a_event.attendees.map(attendee => attendee.id).includes(this.profile.id)
        }
        return user_event
      })
    }))
  }

  compareDateGreaterThanNow(date: Date): boolean {
    if (moment(date).isAfter(this.currentDate)) {
      return true
    }
    else return false
  }

  compareDateLessThanNow(date: Date): boolean {
    console.log("This is the moment of event date" + moment(date))
    console.log("This is true/false of current date grateer than event date:" + moment(date).isAfter(this.currentDate))
    if (moment(date).isAfter(this.currentDate)) {
      return false
    }
    else return true
  }
}
