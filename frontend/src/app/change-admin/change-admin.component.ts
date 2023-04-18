import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { Observable } from 'rxjs';
import { Profile } from '../profile/profile.service';
import { AdminService, User } from '../admin.service';

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

  public admins$ = Observable<User[]>

  constructor(adminService: AdminService) {
    //this.admins$ = adminService.getAllAdmin();
  }

  addNewAdmin(pid: String) {
    // TODO: delegate to service to give user admin role
  }

  removeAdmin(pid: String) {
    // TODO: delegate to srevice to take admin role away from user
  }

}
