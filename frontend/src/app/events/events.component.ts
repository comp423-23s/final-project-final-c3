import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  // Use an observable class so that the event data can be synchronous with the database
  // TODO: create and import an Events class
  public events$ = Observable<Event[]>

  // TODO: create and import eventService
  constructor(eventService: EventService, private http: HttpClient) {
    // TODO: create HTTP getEvents() method
    this.events$ = eventService.getEvents()
  }

  // This delete method will be callable by Club Leaders 
  // TODO: implement authentication
  onDelete(event: Event) {
    // TODO: implement HTTP method to delete Events
    // TODO: change 'routename' to correct path
    this.http.delete<Event>('/api/routename' + Event).subscribe({
      next: (x) => this.reload(),
      error: (err) => this.onError(err)
      
    })
  }

}
