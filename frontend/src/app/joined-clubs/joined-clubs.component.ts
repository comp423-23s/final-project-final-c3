import { Component } from '@angular/core';
import { Observable, UnsubscriptionError } from 'rxjs';
import { Club, ClubsService } from '../clubs.service';

@Component({
  selector: 'app-joined-clubs',
  templateUrl: './joined-clubs.component.html',
  styleUrls: ['./joined-clubs.component.css']
})
export class JoinedClubsComponent {
  // public clubs$: Observable<Club[]>
  public clubs: Club[]

  constructor(private clubsService: ClubsService) {
    // this.clubs$ = clubsService.getJoinedClubs(123456789)
    this.clubs = clubsService.getJoinedClubs(123456789)
  }

  alterText(club: Club) {
    club.show_short_description = !club.show_short_description
    club.current_description = club.show_short_description ? club.short_description : club.full_description
  }

  leaveClub(pid: number, club: Club): void {
    this.clubsService.leaveClub(pid, club.name)
    // this.clubsService.leaveClub(pid, club.name).subscribe({
    //   next: () => this.onSuccess(),
    //   error: (err) => this.onError(err)
    // })
  }

  // onSuccess(): void {
  //   this.clubs$ = this.clubsService.getJoinedClubs(123456789)
  // }

  // onError(err: Error) : void{
  //   if (err.message) {
  //     console.log(err)
  //     window.alert(err.message);
  //   } else {
  //     window.alert("Unknown error: " + JSON.stringify(err));
  //   }
  // }
}
