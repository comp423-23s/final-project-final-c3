import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ClubsService } from 'src/app/clubs.service';
import { Profile } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-admin-club-leaders-list',
  templateUrl: './admin-club-leaders-list.component.html',
  styleUrls: []
})
export class AdminClubLeadersListComponent {
  public club_id: number = 0
  public clubLeaders: Profile[] = []
  
  public displayedColumns: string[] = ['first_name', 'last_name', 'pronouns', 'email']

  constructor(
    private route: ActivatedRoute,
    protected snackBar: MatSnackBar,
    private clubsService: ClubsService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.club_id = parseInt(params.get('club_id') ?? "0")
    })
    this.clubsService.getClubLeaders(this.club_id).subscribe(leaders => {
      this.clubLeaders = leaders
    })
  }
}
