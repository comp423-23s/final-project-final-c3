import { Injectable } from '@angular/core';

export interface EventObject {
  id: number,
  name: string,
  location: string, 
  description: string,
  date: string,
  club_id: number
}

@Injectable({
  providedIn: 'root'
})

export class EventService {
  events: EventObject[] = []

  constructor() {
    // Add fake events for Student Story view
    const event1: EventObject = {id: 0, "name": 'Event 1', "location": 'SN14', 'description': 'An event hosted by club X', "date": '04/05/23', "club_id": 4}
    const event2: EventObject = {id: 1, "name": 'Event 2', "location": 'FB08', 'description': 'An event hosted by club Y', "date": '04/10/23', "club_id": 5}
    this.events.push(event1)
    this.events.push(event2)
  }

  getAllEvents(): EventObject[] {
    return this.events;
  }
}
