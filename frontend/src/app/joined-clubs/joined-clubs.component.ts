import { Component } from '@angular/core';
import { Observable, UnsubscriptionError } from 'rxjs';
import { Club, ClubsService } from '../clubs.service';

@Component({
  selector: 'app-joined-clubs',
  templateUrl: './joined-clubs.component.html',
  styleUrls: ['./joined-clubs.component.css']
})
export class JoinedClubsComponent {
  public clubs$: Observable<Club[]>
  // public clubs: Club[]

  constructor(private clubsService: ClubsService) {
    this.clubs$ = clubsService.getJoinedClubs(123456789)
    // const club1: Club = {name: "club1", short_description: "This is short description for club 1", 
    // full_description: "This is full description for club1", show_short_description: true, members: new Array()}
    // const club2: Club = {name: "club2", short_description: "This is short description for club 2", 
    // full_description: "This is full description for club2", show_short_description: true, members: new Array()}
    // this.clubs = [club1, club2]
  }

  alterText(club: Club) {
    club.show_short_description = !club.show_short_description
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
