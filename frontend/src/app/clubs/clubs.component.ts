import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Club, ClubsService } from '../clubs.service';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html'
})
export class ClubsComponent {

  public clubs$: Observable<Club[]>

  constructor(private clubsService: ClubsService) {
    this.clubs$ = clubsService.getAllClubs()
  }

  alterText(club: Club) {
    club.show_short_description = !club.show_short_description
  }

  isUserInClub(pid: number, club: Club): boolean {
    var joinedClubsArray: Club[] = new Array()
    const subscription = this.clubsService.getJoinedClubs(pid).subscribe((joinedClubs) => {
      joinedClubsArray = joinedClubs
    })
    for (var joinedClub of joinedClubsArray) {
      if (joinedClub == club) {
        return true
      }
    }
    return false
  }

  changeStatus(pid: number, club: Club): void {
    if (this.isUserInClub(pid, club)) {
      this.leaveClub(pid, club)
    }
    this.joinClub(pid, club)
  }

  joinClub(pid: number, club: Club): void {
    this.clubsService.joinClub(pid, club.name).subscribe({
      next: () => this.onSuccess(),
    })
  }

  leaveClub(pid: number, club: Club): void {
    this.clubsService.leaveClub(pid, club.name).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
  }

  onSuccess(): void {
    this.clubs$ = this.clubsService.getJoinedClubs(123456789)
  }

  onError(err: Error) : void{
    if (err.message) {
      console.log(err)
      window.alert(err.message);
    } else {
      window.alert("Unknown error: " + JSON.stringify(err));
    }
  }
}
