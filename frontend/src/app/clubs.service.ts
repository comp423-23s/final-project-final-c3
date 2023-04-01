import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { Profile } from './profile/profile.service';

export interface Club {
  cid: number;
  name: string;                    // club name
  short_description: string;
  full_description: string;   
  show_short_description: boolean;
  members: number[];               // array of club members
}

export interface JoinClubRequest {
  pid: number
  club: Club
}

/**
 * This class handles all student operations related to clubs including the ability 
 * to view all clubs, view joined clubs, join a club, and leave a joined club.
 */
@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  // clubs: Club[] = []

  constructor(private http: HttpClient) {
    // const club1: Club = {name: "club1", short_description: "This is short description for club 1", 
    // full_description: "This is loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo description for club1", show_short_description: true, members: new Array()}
    // const club2: Club = {name: "club2", short_description: "This is short description for club 2", 
    // full_description: "This is loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo description for club2", show_short_description: true, members: new Array()}
    // const club3: Club = {name: "club3", short_description: "This is short description for club 3", 
    // full_description: "This is loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo description for club3", show_short_description: true, members: new Array()}
    // this.clubs = [club1, club2, club3]
    // const member1 = 730434672
    // club1.members.push(member1)
    // club2.members.push(member1)
  }

  /**
   * Retrive all clubs in the system.
   * 
   * @returns Observale array of Club objects.
   */
  getAllClubs(): Observable<Club[]> {
    return this.http.get<Club[]>("/api/all_clubs");
  }
  // getAllClubs(): Club[] {
  //   return this.clubs
  // }

  /**
   * Retrieve clubs joined by a specific student.
   * @param pid 9-digit UNC PID
   * @returns Observale array of Club objects
   */
  getJoinedClubs(pid: number): Observable<Club[]> {
    return this.http.get<Club[]>(`/api/joined_clubs/${pid}`);
  }
  // getJoinedClubs(pid: number): Club[] {
  //   console.log("get joined clubs called")
  //   var joined_clubs = new Array()
  //   for (var club of this.clubs) {
  //     for (var member_pid of club.members) {
  //       if (member_pid == pid) {
  //         joined_clubs.push(club)
  //       }
  //     }
  //   }
  //   return joined_clubs
  // }

  /**
   * Enable a student to join a club.
   * @param pid 9-digit UNC PID
   * @param string club name
   * @returns Club that was joined
   */
  joinClub(pid: number, club: Club): Observable<Club> {
    let joinClubRequest: JoinClubRequest = {pid, club}
    return this.http.post<Club>("api/join_club", joinClubRequest);
  }
  // joinClub(pid: number, club_name: string): Club | undefined {
  //   for (var club of this.clubs) {
  //     if (club.name == club_name) {
  //       club.members.push(pid)
  //       return club
  //     }
  //   }
  //   return undefined
  // }
  

  /**
   * Enable a student to leave a club
   * @param pid 9-digit UNC PID
   * @param pid club name
   * @returns Clubd that was left
   */
  leaveClub(pid: number, club: Club): Observable<Club> {
    return this.http.delete<Club>(`api/leave_club/${pid}/${club.cid}`)
  }
//   leaveClub(pid: number, club_name: string): void {
//     for (var club of this.clubs) {
//       if (club.name == club_name) {
//         var new_members = new Array()
//         for (var member_pid of club.members) {
//           if (member_pid != pid) {
//             new_members.push(member_pid)
//           }
//         }
//         club.members = new_members
//         return club
//       }
//     }
//     return undefined
//   }
}
