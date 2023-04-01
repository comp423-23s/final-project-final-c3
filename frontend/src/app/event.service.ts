import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Event {
  id: number,
  name: string,
  club_id: number,
  date: Date,
  location: string, 
  description: string
  // do we need attendees here?
}

@Injectable({
  providedIn: 'root'
})

export class EventService {
  public fakeEvents: Event[] = []
  constructor(private http: HttpClient) {
    // Add fake events for Student Story view
    const event1: Event = {id: 0, "name": 'Event 1', "location": 'SN14', 'description': 'An event hosted by club X', "date": new Date("2023-04-05"), "club_id": 4}
    const event2: Event = {id: 1, "name": 'Event 2', "location": 'FB08', 'description': 'An event hosted by club Y', "date": new Date("2023-04-10"), "club_id": 5}
    const event3: Event = {id: 2, "name": 'Event 3', "location": 'Davis Library', 'description': 'An event hosted by club Z', "date": new Date("2023-04-15"), "club_id": 2}
    this.fakeEvents.push(event1)
    this.fakeEvents.push(event2)
    this.fakeEvents.push(event3)
  }

  getFakeEvents(): Event[] {
    return this.fakeEvents
  }
  
  getAllEvents(): Observable<Event[]> {
    let allEvents$ = this.http.get<Event[]>('/api/event/all')
    return allEvents$
  }

  getMyEvents(pid: number): Observable<Event[]> {
    let myEvents$ = this.http.get<Event[]>('/api/event/by_pid/' + pid)
    return myEvents$
  }

  // deleteMyEvent(event: Event, pid: number): {
  //   //need to pass in event object once route is fixed
  //   this.http.delete('/api/event/delete_from_event/' + pid)
  // }
}
