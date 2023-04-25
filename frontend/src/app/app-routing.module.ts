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
import { ChangeAdminComponent } from './change-admin/change-admin.component';
import { ManageEventsComponent } from './manage-events/manage-events.component';
import { AdminClubsComponent } from './admin-clubs/admin-clubs.component';
import { AdminClubMembersListComponent } from './admin-clubs/list/members/admin-club-members-list.component';
import { AdminClubLeadersListComponent } from './admin-clubs/list/leaders/admin-club-leaders-list.component';
import { AdminClubEventsListComponent } from './admin-clubs/list/events/admin-club-events-list.component';
import { LeaderClubMembersListComponent } from './leader-clubs/leader-club-members-list/leader-club-members-list.component';

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
  ChangeAdminComponent.Route,
  ManageEventsComponent.Route,
  AdminClubsComponent.Route,
  { path: 'admin_club_members_list/:club_id', title: 'Club Members', component: AdminClubMembersListComponent },
  { path: 'admin_club_leaders_list/:club_id', title: 'Club Leaders', component: AdminClubLeadersListComponent },
  { path: 'admin_club_events_list/:club_id', title: 'Club Events', component: AdminClubEventsListComponent },
  { path: 'leader_club_members_list/:club_id', title: 'Club Members', component: LeaderClubMembersListComponent },
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