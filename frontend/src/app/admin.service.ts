import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from './profile/profile.service';

export interface User {
  id: number,
  pid: number,
  onyen: string,
  name: string,
  email: string,
  pronouns: string
}


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {  }

  // getAllAdmin(): Observable<Profile[]> {
  //   // TODO: call a HTTP method to get all administrators
  // }

  // addAdmin(pid: number): Observable<Profile[]> {
  //   // TODO: call a HTTP method to add an admin
  // }

  // removeAdmin(pid: number): Observable<Profile[]> {
  //   // TODO: call a HTTP method to remove an admin
  // }
}
