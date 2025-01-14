import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable} from 'rxjs';
import { Profile } from './profile/profile.service';
import { Category, WeekDayTime } from './register-leader.service';
import { Event } from './event.service';


export interface Club {
  id: number;
  club_code: String;
  name: String;                   
  description: String; 
  show_short_description: boolean;
  members: Profile[];            
  meeting_times: WeekDayTime[];
  categories: Category[];
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
   * Retreived filtered clubs in the system.
   * 
   * @returns Observale array of Club objects.
   */
  filterClubs(availabilities: [String, String][], categories: String[]): Observable<Club[]> {
    var body = [availabilities, categories]
    return this.http.post<Club[]>("/api/club/filter", body);
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


  /**
   * Get all members of a club
   * @Param number club_id
   * @return list of Profile
   */
  getClubMembers(club_id: number): Observable<Profile[]> {
    return this.http.get<Profile[]>(`api/club/get/members/${club_id}`)
  }


  /**
   * Get all leaders of a club
   * @Param number club_id
   * @return list of Profile
   */
  getClubLeaders(club_id: number): Observable<Profile[]> {
    return this.http.get<Profile[]>(`api/club/get/leaders/${club_id}`)
  }


  /**
   * Get all events of a club
   * @Param number club_id
   * @return list of Event
   */
  getClubEvents(club_id: number): Observable<Event[]> {
    return this.http.get<Event[]>(`api/event/by/club/${club_id}`)
  }
}
