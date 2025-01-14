import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number,
  pid: number,
  onyen: string,
  first_name: string,
  last_name: string,
  email: string,
  pronouns: string,
  permission: []
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
    return this.http.post<String>('/api/admin/actions/add/admin', pid)
  }

  testAddAdmin(pid: number): Observable<String> {
    return this.http.post<String>(`/api/admin/actions/add/admin/${pid}`, pid)
  }

  removeAdmin(pid: number): Observable<String> {
    // TODO: call a HTTP method to remove an admin
    return this.http.delete<String>(`api/admin/actions/delete/admin/${pid}`)
  }
}
