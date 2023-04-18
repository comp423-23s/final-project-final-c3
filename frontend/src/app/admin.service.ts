import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from './profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {  }

  getAllAdmin(): Observable<Profile[]> {
    // TODO: call a HTTP method to get all administrators
  }

}
