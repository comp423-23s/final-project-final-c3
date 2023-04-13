import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { Club, ClubsService } from './clubs.service';

export interface PotentialClub {
  id: number;
  name: String;
  description: String;
  founder_id: number;
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
  leadereRegistrationRequestForExistingClub(clubId: number, givenClubCode: String): Observable<String> {
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
  // leaderRegistrationRequestForNonExistingClub(potentialClub: PotentialClub): Observable<String> {
  //   return this.http.post<String>(`/api/admin/club/requests/potential/club/request`, potentialClub)
  // }
}
