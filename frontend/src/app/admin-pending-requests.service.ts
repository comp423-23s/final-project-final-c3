import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { Club, ClubsService } from './clubs.service';
import { PotentialClub } from './register-leader.service';

@Injectable({
  providedIn: 'root'
})
export class AdminPendingRequestsService {

  constructor(private http: HttpClient) { }

  /**
   * Retrive all potential clubs.
   * 
   * @returns Observale array of Club objects.
   */
  getPotentialClubs(): Observable<PotentialClub[]> {
    return this.http.get<PotentialClub[]>("/api/club/all/potential/clubs");
  }

  approve(potentialClub: PotentialClub): Observable<String> {
    return this.http.post<String>("/api/club/create/club", potentialClub)
  }

  deny(potentialClub: PotentialClub): Observable<String> {
    return this.http.post<String>("/api/club/reject/club", potentialClub)
  }
}
