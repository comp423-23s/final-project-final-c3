import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { ClubsService } from './clubs.service';
import { Time } from '@angular/common';

export interface PotentialClub {
  id: number | undefined;
  name: String;
  description: String;
  founder_id: number | undefined;
  meeting_times: WeekDayTime[];
  categories: Category[];
}

export interface WeekDayTime {
  id: number | undefined;
  day: String;
  start_time: string;
  end_time: string;  
}

export interface Category {
  id: number | undefined;
  name: String;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterLeaderService {

  constructor(private http: HttpClient, private clubsService: ClubsService) { 
  }

  /**
   * Submit a leader registration request for an existing club
   * 
   * @param Club club
   * @param int givenClubCode
   * @returns String
   */
  leaderRegistrationRequestForExistingClub(clubId: number, givenClubCode: String): Observable<String> {
    console.log("frontend service called")
    return this.http.get<String>(`/api/club/add/leader/to/club/${clubId}/${givenClubCode}`)
    // return this.http.get<String>(`/api/club/add/leader/to/club/${clubId}/${givenClubCode}`)
  }

  /**
   * Submit a leader registration request for a non-existing club
   * 
   * @Param PotentialClub potentialClub
   * @returns String
   */
  leaderRegistrationRequestForNonExistingClub(potentialClub: PotentialClub): Observable<String> {
    return this.http.post<String>("/api/club/potential/club/request", potentialClub)
    // return this.http.get<String>(`/api/admin/club/requests/potential/club/request/${potentialClub.id}/${potentialClub.name}/${potentialClub.description}`)
  }

  /**
   * Returns all pending requests a student submitted
   * 
   * @returns PotentialClub[]
   */
  getMyPendingClubs(): Observable<PotentialClub[]> {
    return this.http.get<PotentialClub[]>("api/club/club/requests")
  }
}
