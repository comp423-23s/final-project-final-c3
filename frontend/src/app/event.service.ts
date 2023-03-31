import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EventObject {
  id: number,
  name: string,
  location: string, 
  description: string,
  date: Date,
  club_id: number
}

@Injectable({
  providedIn: 'root'
})

export class EventService {
  events: EventObject[] = []
  myEvents: EventObject[] = []

  constructor(private http: HttpClient) {
    // Add fake events for Student Story view
    const event1: EventObject = {id: 0, "name": 'Event 1', "location": 'SN14', 'description': 'An event hosted by club X', "date": new Date("2023-04-05"), "club_id": 4}
    const event2: EventObject = {id: 1, "name": 'Event 2', "location": 'FB08', 'description': 'An event hosted by club Y', "date": new Date("2023-04-10"), "club_id": 5}
    const event3: EventObject = {id: 2, "name": 'Event 3', "location": 'Davis Library', 'description': 'An event hosted by club Z', "date": new Date("2023-04-15"), "club_id": 2}
    this.events.push(event1)
    this.events.push(event2)
    this.events.push(event3)
    this.myEvents.push(event1)
    this.myEvents.push(event3)
  }

  getAllEvents(): Observable<EventObject[]> {
    //we need to be using the same event type object, there are two created right now
    let allEvents$ = this.http.get<EventObject[]>('/api/event')
  }

  getMyEvents(): EventObject[] {
    return this.myEvents;
  }
}
