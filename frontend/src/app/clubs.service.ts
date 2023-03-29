import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { Profile } from './profile/profile.service';

export interface Club {
  name: string;             // club name
  short_description: string
  full_description: string;    
  members: Profile[]        // array of club members
}

export interface JoinClubRequest {
  pid: number
  club_name: string
}

/**
 * This class handles all student operations related to clubs including the ability 
 * to view all clubs, view joined clubs, join a club, and leave a joined club.
 */
@Injectable({
  providedIn: 'root'
})
export class ClubsService {

  constructor(private http: HttpClient) {}

  /**
   * Retrive all clubs in the system.
   * 
   * @returns Observale array of Club objects.
   */
  getAllClubs(): Observable<Club[]> {
    return this.http.get<Club[]>("/api/all_clubs");
  }

  /**
   * Retrieve clubs joined by a specific student.
   * @param pid 9-digit UNC PID
   * @returns Observale array of Club objects
   */
  getJoinedClubs(pid: number): Observable<Club[]> {
    return this.http.get<Club[]>(`/api/joined_clubs/${pid}`);
  }

  /**
   * Enable a student to join a club.
   * @param pid 9-digit UNC PID
   * @param string club name
   * @returns Club that was joined
   */
  joinClub(pid: number, club_name: string): Observable<Club> {
    let joinClubRequest: JoinClubRequest = {pid, club_name}
    return this.http.post<Club>("api/join_club", joinClubRequest);
  }

  /**
   * Enable a student to leave a club
   * @param pid 9-digit UNC PID
   * @param pid club name
   * @returns Clubd that was left
   */
  leaveClub(pid: number, club_name: string): Observable<Club> {
    return this.http.delete<Club>(`api/leave_club/${pid}/${club_name}`)
  }
}
