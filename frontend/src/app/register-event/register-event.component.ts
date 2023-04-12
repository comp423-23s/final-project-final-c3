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
export class RegisterEventComponent implements OnInit{
  public static Route: Route = {
    path: 'registerevents',
    component: RegisterEventComponent, 
    title: 'Register Events', 
    canActivate: [isAuthenticated], 
    resolve: { profile: profileResolver }
  };

  public event: Event

  public eventForm = this.formBuilder.group({
    name: '',
    description: '',
    location: '',
    clud_id: 0,
  });

  constructor(route: ActivatedRoute, protected formBuilder: FormBuilder, protected snackBar: MatSnackBar, private eventService: EventService) {
    const form = this.eventForm
    form.get('name')?.addValidators(Validators.required);
    form.get('description')?.addValidators(Validators.required);
    form.get('location')?.addValidators(Validators.required);
    form.get('club_id')?.addValidators(Validators.required);

    const data = route.snapshot.data as { event: Event };
    console.log(route.snapshot)
    this.event = data.event;
  }

  ngOnInit(): void {
    let event = this.event;

    this.eventForm.setValue({
      name: event.name,
      description: event.description,
      location: event.location,
      clud_id: event.club_id,
    });
  }

  onSubmit(): void {
    // TODO: add put method to event service
    if (this.eventForm.valid) {
      // Object.assign(this.event, this.eventForm.value)
      // this.eventService.put(this.event).subscribe(
      //   {
      //     next: (user) => this.onSuccess(user),
      //     error: (err) => this.onError(err)
      //   } 
      // );
    }
  }

  private onSuccess(event: Event) {
    this.snackBar.open("Event Created", "", { duration: 2000 })
  }

  private onError(err: any) {
    console.error("How to handle this?");
  }
}
