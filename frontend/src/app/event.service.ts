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

  constructor(private http: HttpClient) {
    // Add fake events for Student Story view
    // const event1: Event = {id: 0, "name": 'Event 1', "location": 'SN14', 'description': 'An event hosted by club X', "date": new Date("2023-04-05"), "club_id": 4}
    // const event2: Event = {id: 1, "name": 'Event 2', "location": 'FB08', 'description': 'An event hosted by club Y', "date": new Date("2023-04-10"), "club_id": 5}
    // const event3: Event = {id: 2, "name": 'Event 3', "location": 'Davis Library', 'description': 'An event hosted by club Z', "date": new Date("2023-04-15"), "club_id": 2}
    // this.events.push(event1)
    // this.events.push(event2)
    // this.events.push(event3)
    // this.myEvents.push(event1)
    // this.myEvents.push(event3)
  }

  getAllEvents(): Observable<Event[]> {
    //we need to be using the same event type object, there are two created right now
    let allEvents$ = this.http.get<Event[]>('/api/event/all')
    return allEvents$
  }

  getMyEvents(): Observable<Event[]> {
    // need this HTTP request to be by PID
    let myEvents$ = this.http.get<Event[]>('/api/event/ ***')
    return myEvents$
  }
}
