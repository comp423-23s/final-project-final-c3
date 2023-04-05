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

/**
 * This class handles all student operations related to events including the ability 
 * to view all events, view joined events, join an event, and leave an event.
 */
@Injectable({
  providedIn: 'root'
})

export class EventService {
  
  constructor(private http: HttpClient) {
  }
  
  /**
  * Retrive all events in the system.
  * 
  * @returns Observale array of Event objects.
  */
  getAllEvents(): Observable<Event[]> {
    let allEvents$ = this.http.get<Event[]>('/api/event/all')
    return allEvents$
  }

  /**
   * Retrieve events joined by a specific student.
   * @param pid 9-digit UNC PID
   * @returns Observale array of Event objects
   */
  getMyEvents(pid: number): Observable<Event[]> {
    let myEvents$ = this.http.get<Event[]>('/api/event/by_pid/' + pid)
    return myEvents$
  }

  // Call to backend to see if user is a registered attendee for an event
  isUserInEvent(event: Event): boolean {
    // TODO: Some HTTP method
    // For now, return true
    return true
  }

  /**
   * Enable a student to leave an event
   * @param Event event object
   * @param pid student PID
   * @returns void
   */
  // deleteMyEvent(event: Event, pid: number): {
  //   //need to pass in event object once route is fixed
  //   this.http.delete('/api/event/delete_from_event/' + pid)
  // }
}
