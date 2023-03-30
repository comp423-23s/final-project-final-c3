import { Injectable } from '@angular/core';

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

  constructor() {
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

  getAllEvents(): EventObject[] {
    return this.events;
  }

  getMyEvents(): EventObject[] {
    return this.myEvents;
  }
}
