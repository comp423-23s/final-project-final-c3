import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { FormBuilder, Validators } from '@angular/forms';
import { Event, EventService, PotentialEvent } from '../event.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-event',
  templateUrl: './register-event.component.html',
  styleUrls: ['./register-event.component.css']
})
export class RegisterEventComponent {
  public static Route: Route = {
    path: 'registerevents',
    component: RegisterEventComponent, 
    title: 'Register Events', 
    canActivate: [isAuthenticated], 
    resolve: { profile: profileResolver }
  };

  constructor(protected snackBar: MatSnackBar, private eventService: EventService) {
  
  }

  onSubmitEvent(club_code: string, name: string, description: string, location: string, start: string, end: string): void {
    // TODO: change parameters to right types
    let club_id = this.getClubID(club_code)
    let start_time: Date = new Date(start)
    let end_time: Date = new Date(end)
    console.log(start_time)
    var potentialEvent: PotentialEvent = {
      id: null,
      club_id: club_id,
      name: name,
      description: description,
      location: location,
      start_date: start_time,
      end_date: end_time
    }    

    this.eventService.createNewEvent(potentialEvent).subscribe(
      {
        next: (data) => {this.onSuccess(data)},
        error: (err) => {this.onError(err)}
      }
    )
  
  }

  getClubID(club_code: string): number {
    this.eventService.getClubID(club_code).subscribe(
      {
        next: (data) => {return this.onSuccessGetClubID(data)},
        error: (err) => console.log(err)
      }
    )
    return 0
  }

  onSuccessGetClubID(club_id: number): number {
    return club_id
  }

  private onSuccess(string: string) {
    this.snackBar.open("Event Created", "", { duration: 2000 })
  }

  private onError(err: any) {
    console.error("How to handle this?");
  }
}