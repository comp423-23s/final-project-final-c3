import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ClubsService } from 'src/app/clubs.service';
import { Event, EventService } from 'src/app/event.service';

@Component({
  selector: 'app-admin-club-events-list',
  templateUrl: './admin-club-events-list.component.html',
  styleUrls: []
})
export class AdminClubEventsListComponent {
  public club_id: number = 0
  public clubEvents: Event[] = []

  public displayedColumns: string[] = ['name', 'date', 'location', 'description']

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
    this.clubsService.getClubEvents(this.club_id).subscribe(events => {
      this.clubEvents = events
    })
  }
}
