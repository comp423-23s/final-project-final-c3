import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { Profile } from './profile/profile.service';

export interface Club {
  id: number;
  name: string;                    // club name
  description: string; 
  show_short_description: boolean;
  members: number[];               // array of club members
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
  joinClub(club: Club): Observable<Club> {
    return this.http.get<Club>(`api/club/add/${club.id}`)
  }


  /**
   * Enable a student to leave a club
   * @param Club club object
   * @returns Club that was left
   */
  leaveClub(club: Club): Observable<Club> {
    return this.http.delete<Club>(`api/club/remove/${club.id}`)
  }

  /**
   * Determines whether a user is in a club
   * @param Club club object
   * @returns boolean
   */
  isUserInClub(club: Club): Observable<Boolean> {
    return this.http.get<Boolean>(`api/club/check_membership/${club.id}`)
  }
}
