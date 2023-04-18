import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppTitleStrategy } from './app-title.strategy';
import { EventsComponent } from './events/events.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { GateComponent } from './gate/gate.component';
import { HomeComponent } from './home/home.component';
import { ProfileEditorComponent } from './profile/profile-editor/profile-editor.component';
import { ClubsComponent } from './clubs/clubs.component';
import { JoinedClubsComponent } from './joined-clubs/joined-clubs.component';
import { RegisterLeaderComponent } from './register-leader/register-leader.component';
import { RegisterEventComponent } from './register-event/register-event.component';
import { RoleSelectionComponent } from './role-selection/role-selection.component';
import { LeaderClubsComponent } from './leader-clubs/leader-clubs.component';
import { AdminPendingRequestsComponent } from './admin-pending-requests/admin-pending-requests.component';
<<<<<<< HEAD
import { ChangeAdminComponent } from './change-admin/change-admin.component';
=======
import { ManageEventsComponent } from './manage-events/manage-events.component';
>>>>>>> stage

const routes: Routes = [
  HomeComponent.Route,
  ProfileEditorComponent.Route,
  GateComponent.Route,
  ClubsComponent.Route,
  JoinedClubsComponent.Route,
  EventsComponent.Route,
  MyEventsComponent.Route,
  RegisterLeaderComponent.Route,
  RegisterEventComponent.Route,
  RoleSelectionComponent.Route,
  LeaderClubsComponent.Route,
  AdminPendingRequestsComponent.Route,
<<<<<<< HEAD
  ChangeAdminComponent.Route,
=======
  ManageEventsComponent.Route,
>>>>>>> stage
  { path: 'admin', title: 'Admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule],
  providers: [AppTitleStrategy.Provider]
})
export class AppRoutingModule {}