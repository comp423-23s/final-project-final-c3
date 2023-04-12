import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError, map } from 'rxjs';
import { Profile } from './profile/profile.service';

export interface Club {
  id: number;
  name: string;                    // club name
  description: string; 
  show_short_description: boolean;
  members: number[];               // array of club members
  is_user_in_club: Observable<boolean>;
}

/**
 * This class handles all student operations related to clubs including the ability 
 * to view all clubs, view joined clubs, join a club, and leave a joined club.
 */
@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  // public clubs$: Observable<Club[]>

  constructor(private http: HttpClient) {
    // var rawClubs: Observable<Club[]> = this.getAllClubs()
    // this.clubs$ = rawClubs.pipe(map((rawClubs: Club[]) => {return rawClubs.map(club => {return {...club, is_user_in_club: this.isUserInClub(club)}})}))
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
    return this.http.delete<String>(`api/club/remove/${club.id}`)
  }


  /**
   * Determines whether a user is in a club
   * @param Club club object
   * @returns boolean
   */
  isUserInClub(club: Club): Observable<boolean> {
    console.log("service isUserInClub called")
    return this.http.get<boolean>(`api/club/check/membership/${club.id}`)
  }
}
