import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  public admins$: Observable<User[]>

  constructor(private adminService: AdminService) {
    this.admins$ = adminService.getAllAdmin();
  }

  addNewAdmin(pid: string) {
    this.adminService.removeAdmin(parseInt(pid))
  }

  removeAdmin(pid: string) {
    // TODO: delegate to srevice to take admin role away from user
    this.adminService.addAdmin(parseInt(pid))
  }

}
