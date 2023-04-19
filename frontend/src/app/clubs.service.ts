import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable} from 'rxjs';
import { Profile } from './profile/profile.service';
import { Time } from '@angular/common';

export interface Club {
  id: number;
  club_code: String;
  name: String;                   
  description: String; 
  show_short_description: boolean;
  members: Profile[];            
  club_meeting_times: Time[];
  categories: String[];
}

export interface User_Club {
  club: Club,
  is_joined: boolean
}

/**
 * This class handles all student operations related to clubs including the ability 
 * to view all clubs, view joined clubs, join a club, and leave a joined club.
 */
@Injectable({
  providedIn: 'root'
})
export class ClubsService {

  constructor(private http: HttpClient) {
  }

  /**
   * Retrive all clubs in the system.
   * 
   * @returns Observale array of Club objects.
   */
  getAllClubs(): Observable<Club[]> {
    return this.http.get<Club[]>("/api/club/all");
  }


  /**
   * Retrieve clubs joined by a specific student.
   * @returns Observale array of Club objects
   */
  getJoinedClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(`/api/club/user`);
  }


  /**
   * Enable a student to join a club.
   * @param Club club object
   * @returns Club that was joined
   */ 
  joinClub(club: Club): Observable<String> {
    return this.http.get<String>(`api/club/add/${club.id}`)
  }


  /**
   * Enable a student to leave a club
   * @param Club club object
   * @returns Club that was left
   */
  leaveClub(club: Club): Observable<String> {
    return this.http.delete<String>(`api/club/remove/from/${club.id}`)
  }
}
