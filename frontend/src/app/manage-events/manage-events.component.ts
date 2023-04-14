import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css']
})
export class ManageEventsComponent {
  public static Route: Route = {
    path: 'manageevents',
    component: ManageEventsComponent, 
    title: 'Manage Events', 
    canActivate: [isAuthenticated], 
    resolve: { profile: profileResolver }
  };
}
