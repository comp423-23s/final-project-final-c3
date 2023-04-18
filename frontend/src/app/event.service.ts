import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from './profile/profile.service';

export interface Event {
  id: number | undefined,
  name: string,
  club_id: number,
  date: Date,
  location: string, 
  description: string,
  show_short_description: boolean,
  attendees: Profile[]
}

export interface User_Event {
  event: Event,
  is_joined: boolean
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
    return this.http.get<Event[]>('/api/event/all')
  }

  /**
   * Retrieve events joined by a specific student.
   * @param pid 9-digit UNC PID
   * @returns Observale array of Event objects
   */
  getMyEvents(): Observable<Event[]> {
    return this.http.get<Event[]>('/api/event/user_events')
  }

  addUserToEvent(event: Event): Observable<String> {
    return this.http.get<String>(`api/event/add_to_event/${event.id}`)
  }

  removeUserFromEvent(event: Event): Observable<String> {
    return this.http.delete<String>(`api/event/delete_from_event/${event.id}`)
  }

  deleteEvent(event: Event): Observable<String> {
    return this.http.delete<String>(`api/event/delete/${event.id}`)
  }

  getClubID(club_code: string): Observable<number> {
    return this.http.get<number>(`api/event/get_club_id/${club_code}`)
  }

  createNewEvent(event: Event): Observable<String> {
    return this.http.post<String>(`api/event/create_event/`, event)
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
