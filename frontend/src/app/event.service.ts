import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Event {
  id: number,
  name: string,
  club_id: number,
  date: Date,
  location: string, 
  description: string,
  show_short_description: boolean,
  members: number[]
}

@Injectable({
  providedIn: 'root'
})

export class EventService {
  public fakeEvents: Event[] = []
  constructor(private http: HttpClient) {
    // Add fake events for Student Story view
    // const event1: Event = {id: 0, "name": 'Event 1', "location": 'SN14', 'short_description': 'An event hosted by club X...',"long_description": 'An event hosted by club X Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' , "date": new Date("2023-04-05"), "club_id": 4, "members": [], "show_short_description": true}
    // const event2: Event = {id: 1, "name": 'Event 2', "location": 'FB08', 'short_description': 'An event hosted by club Y...',"long_description": 'An event hosted by club Y Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' ,"date": new Date("2023-04-10"), "club_id": 5, "members": [], "show_short_description": true}
    // const event3: Event = {id: 2, "name": 'Event 3', "location": 'Davis Library', 'short_description': 'An event hosted by club Z...', "long_description": 'An event hosted by club Z Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', "date": new Date("2023-04-15"), "club_id": 2, "members": [], "show_short_description": true}
    // this.fakeEvents.push(event1)
    // this.fakeEvents.push(event2)
    // this.fakeEvents.push(event3)
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
