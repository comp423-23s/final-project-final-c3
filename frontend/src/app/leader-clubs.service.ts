import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError, map } from 'rxjs';
import { Profile } from './profile/profile.service';
import { Club } from './clubs.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderClubsService {

  constructor(private http: HttpClient) { }

  /**
   * Retrieve clubs leading by a leader.
   * @returns Observale array of Club objects
   */
    getLeadingClubs(): Observable<Club[]> {
      return this.http.get<Club[]>(`/api/club/leaders/clubs`);
    }
}
