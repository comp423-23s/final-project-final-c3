import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { Profile } from './profile/profile.service';

export interface Club {
  id: number;
  name: string;                    // club name
  short_description: string;
  full_description: string;   
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
   * @param pid 9-digit UNC PID
   * @returns Observale array of Club objects
   */
  getJoinedClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(`/api/club/user`);
  }


  /**
   * Enable a student to join a club.
   * @param pid 9-digit UNC PID
   * @param string club name
   * @returns Club that was joined
   */ 
  joinClub(club: Club): Observable<Club> {
    return this.http.get<Club>(`api/club/add/${club.id}`)
  }


  /**
   * Enable a student to leave a club
   * @param pid 9-digit UNC PID
   * @param pid club name
   * @returns Clubd that was left
   */
  leaveClub(club: Club): Observable<Club> {
    return this.http.delete<Club>(`api/club/remove/${club.id}`)
  }
}
