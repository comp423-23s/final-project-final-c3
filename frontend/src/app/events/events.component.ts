import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EventObject, EventService } from '../event.service'
import { Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';

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
  
  //public events$ = Observable<Event[]>
  public events: EventObject[]

  // TODO: create and import eventService
  constructor(eventService: EventService, private http: HttpClient) {
    // TODO: create HTTP getEvents() method
    this.events = eventService.getAllEvents()
  }

  // This delete method will be callable by Club Leaders 
  // TODO: implement authentication
  onDelete(event: Event) {
    // TODO: implement HTTP method to delete Events
    // TODO: change 'routename' to correct path
    // this.http.delete<Event>('/api/routename/' + Event).subscribe({
    //   next: (x) => this.reload(),
    //   error: (err) => this.onError(err)
    // })
    
  }

}