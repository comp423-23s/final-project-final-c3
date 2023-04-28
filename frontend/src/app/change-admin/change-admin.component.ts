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

  constructor(private adminService: AdminService, protected snackBar: MatSnackBar) {
    this.admins$ = adminService.getAllAdmin();
  }

  addNewAdmin(pid: string) {
    this.adminService.testAddAdmin(parseInt(pid)).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.addError(err)
    })
  }

  removeAdmin(pid: string) {
    // TODO: delegate to srevice to take admin role away from user
    this.adminService.removeAdmin(parseInt(pid)).subscribe({
      next: () => this.onSuccessRemove(),
      error: (err) => this.removeError(err)
    })
  }

  onSuccess(): void {
    this.admins$ = this.adminService.getAllAdmin()
    this.snackBar.open("Successfully Added Administrator!"," ", { duration: 4000 })
  }

  onSuccessRemove(): void {
    this.admins$ = this.adminService.getAllAdmin()
    this.snackBar.open("Successfully Removed Administrator! "," ", { duration: 4000 })
  }

  addError(err: Error) : void{
    if (err.message) {
      console.log(err)
      this.snackBar.open("⚠️ Could not add administrator! Make sure you have entered the correct PID. "," ", { duration: 4000 })
    }
    else {
      this.snackBar.open("⚠️ Could not add administrator! Make sure you have entered the correct PID. "," ", { duration: 4000 })
    }
  }

  removeError(err: Error) : void{
    if (err.message) {
      console.log(err)
      this.snackBar.open("⚠️ Could not delete administrator! Make sure administrator already exists. "," ", { duration: 4000 })
    } else {
      this.snackBar.open("⚠️ Could not delete administrator! Make sure administrator already exists. "," ", { duration: 4000 })
    }
  }
}
