import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

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
  getMyEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('/api/event/user_events')
  }

  addUserToEvent(event: Event): Observable<Event> {
    return this.http.get<Event>(`api/event/add_to_event/${event.id}`)
  }

  removeUserFromEvent(event: Event): Observable<Event> {
    return this.http.delete<Event>(`api/event/delete_from_event/${event.id}`)
  }

  // Call to backend to see if user is a registered attendee for an event
  isUserInEvent(event: Event): Observable<Boolean> {
    // TODO: Some HTTP method
    // For now, return true
    return this.http.get<Event>(`api/event/is_user_registered/${event.id}`)
      .pipe(
        map((response: Event) => {
          return response != null
        })
      );
  }

  isUserInEventResponse(event: Event): boolean {
    let truth = false
    this.isUserInEvent(event).subscribe((response: Boolean) => {
      if(response) {
        truth = true
      }
      else {
        truth = false
      }
    })
    return truth
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
