import { Component } from '@angular/core';
import { Event, EventService } from '../event.service';
import { ActivatedRoute, Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { Profile } from '../profile/profile.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private eventService: EventService, route: ActivatedRoute, private http: HttpClient) {
    this.eventService = eventService
    const data = route.snapshot.data as { profile: Profile }
    console.log(route.snapshot)
    this.profile = data.profile
    this.my_events$ = eventService.getMyEvents(this.profile.pid)
  }

  onDelete(event1: Event) {
    let event = event1;
    // how to pass in event1
    this.http.delete<Event>('/api/event/delete').subscribe( {
      next: (x) => this.reload(),
      error: (err) => this.onError(err)
    })
  }

  reload(): void {
    this.my_events$ = this.eventService.getMyEvents(this.profile.pid)
  }

  private onError(err: HttpErrorResponse) {
    if (err.error.detail) {
      window.alert(err.error.detail);
    } else {
      window.alert("Unknown error: " + JSON.stringify(err));
    }
  }
}
