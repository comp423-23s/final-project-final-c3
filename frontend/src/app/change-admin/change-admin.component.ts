import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';

@Component({
  selector: 'app-change-admin',
  templateUrl: './change-admin.component.html',
  styleUrls: ['./change-admin.component.css']
})
export class ChangeAdminComponent {
  public static Route: Route = {
    path: 'changeadmins',
    component: ChangeAdminComponent, 
    title: 'Add or Remove Administrators', 
    canActivate: [isAuthenticated], 
    resolve: { profile: profileResolver }
  };
}
