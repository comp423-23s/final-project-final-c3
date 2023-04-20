import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  getAllAdmin(): Observable<User[]> {
    // TODO: call a HTTP method to get all administrators
    console.log("We got to frontend service method")
    return this.http.get<User[]>('/api/admin/actions/get/all/admin')
  }

  addAdmin(pid: number): Observable<String> {
    // TODO: call a HTTP method to add an admin
    return this.http.get<String>(`api/user/${pid}`)
  }

  removeAdmin(pid: number): Observable<String> {
    // TODO: call a HTTP method to remove an admin
    return this.http.delete<String>(`api/user/${pid}`)
  }
}
