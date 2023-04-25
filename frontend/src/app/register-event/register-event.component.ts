import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { FormBuilder, Validators } from '@angular/forms';
import { Event, EventService } from '../event.service'
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

  form = this.formBuilder.group({
    code: '',
    name: '',
    description: '',
    location: '',
    start: '',
    end: ''
  });

  constructor(protected snackBar: MatSnackBar, private eventService: EventService, private formBuilder: FormBuilder,) {

  }

  // This function is called once we have the form data
  // It calls another function 
  onSubmitEvent(club_code: string, name: string, description: string, location: string, start: string, end: string): void {    
    this.getClubID(club_code, name, description, location, start, end)
  }

  getClubID(club_code: string, name: string, description: string, location: string, start: string, end: string): void {
    this.eventService.getClubID(club_code).subscribe(
      {
        next: (data) => {this.onSuccessGetClubID(data, name, description, location, start, end )},
        error: (err) => {this.onError(err)}
      }
    )
    
  }

  onSuccessGetClubID(club_id: number, name: string, description: string, location: string, start: string, end: string): void {
    let start_time: Date = new Date(start)
    let end_time: Date = new Date(end)
    var event: Event = {
      id: null,
      club_id: club_id,
      name: name,
      description: description,
      location: location,
      start_time: start_time,
      end_time: end_time,
      show_short_description: false,
      attendees: []
    } 
    this.eventService.createNewEvent(event).subscribe(
      {
        next: (data) => {this.onSuccess(data)},
        error: (err) => {this.onError(err)}
      }
    )
  
  }

  private onSuccess(string: string) {
    this.snackBar.open("Event Created", "", { duration: 2000 })
    this.form.reset()
  }

  private onError(err: any) {
    console.error("How to handle this?");
  }

  onSubmit(): void {
    let form = this.form.value;
    let code = form.code
    let name = form.name 
    let description = form.description
    let location = form.location
    let start = form.start
    let end = form.end
    this.onSubmitEvent(code, name, description, location, start, end)
    this.form.reset()
  }
}