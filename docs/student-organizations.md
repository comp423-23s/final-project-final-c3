# Overview

Our website builds off the [Computer Science Experience Lab website](https://csxl.unc.edu/), with added functionality to view affiliated student clubs and the events they host. This application serves students at the University of North Carolina at Chapel Hill who are interested in becoming involved in Computer Science related organizations. Using this application, students have quick and easy access to enriching events and inclusive organizations. 

As a student, one may:
* View a comprehensive list of all computer science affiliated clubs
* View a comprehensive list of all events hosted by these clubs
* Join or Leave a club
* Register or Cancel Registration for an event
* View the clubs of which they are currently members 
* View the events for which they are currently registered
* Become a leader of a club

As a leader of a club (e.g. President), one may:
* Request to add a club to the website
* Add an upcoming event to be hosted
* Delete an upcoming event
* View a list of the clubs they lead

As an administrator, one may:
* Approve or deny a leader’s request to add a club


# Implementation Notes

In order to implement our application, we choose to have the following base entities:

<table>
  <tr>
   <td>
Name
   </td>
   <td>Description
   </td>
   <td>Attributes
   </td>
  </tr>
  <tr>
   <td>Club Entity
   </td>
   <td>There are many organizations that might be a part of the UNC XL. Each one needs to have the following information: an id (int), a club_code (int) used by leaders of the club, a name(str), a description (str) for users, a list of members (List[UserEntity]), and a list of leaders (List[UserEntity])
   </td>
   <td>id, club_code, name, description, members, leaders
   </td>
  </tr>
  <tr>
   <td>Event Entity
   </td>
   <td>Each event hosted by a club has its own entity. It has an id (int), a name (str), a description of the event (str), a location for the event (str), the date that it occurs (datetime), a club_id to match the event to the corresponding club (int), and a list of attendees (List[UserEntity])
   </td>
   <td>id, name, location, description, date, club_id, attendees
   </td>
  </tr>
  <tr>
   <td>Permission Entity
   </td>
   <td>Not all users for the application can access the same actions. Thus, this table relates users to their corresponding allowed actions. Each permission has an id (int), an action (str), a resource (str), a role_id in case a user has multiple roles (int), and a user_id (int) to map the right permission to the right user. 
   </td>
   <td>id, action, resource, role_id, user_id
   </td>
  </tr>
  <tr>
   <td>Potential Club Entity
   </td>
   <td>Before a club can be declared an official club entity, it must be approved by an administrator. Thus, it remains as a ‘potential club entity’ until it is approved. These entities are composed of an id (int), a name (str), a description (str), and a founder_id (UserEntity) to represent who started the club. 
   </td>
   <td>id, name, description, founder_id
   </td>
  </tr>
  <tr>
   <td>Role Entity
   </td>
   <td>Each user of this application has a role. They may be a student, a leader (of a club), or an administrator. The attributes are: id (int), name (str), users (List[UserEntity]), permissions (List[PermissionEntity]0
   </td>
   <td>id, name, users, permissions
   </td>
  </tr>
  <tr>
   <td>User Entity
   </td>
   <td>Each user of this application has information that needs to be stored so that they can access different parts of the site. When signing in, one needs to fill out a ‘Profile’ form with the following information: First Name (str), Last Name (str), UNC email (str), and Pronouns (str). Then, each user has specific roles (List[RoleEntity]), permissions they are allowed (List[PermissionEntity]), clubs they are a part of (List[ClubEntity]), and clubs they are a leader of (List[ClubEntity]).
   </td>
   <td>id, pid, onyen, email, first_name, last_name, pronouns, roles, permissions, clubs, leading_clubs
   </td>
  </tr>
</table>

We chose to add a “Change Role” button on the side navigation bar instead of allowing users to have only 1 role, because many students may want to be both a member of one club, and a leader of another. Thus they would have both the roles “Student” and “Leader”. Additionally, if a student were to be given the role of an administrator, they should be allowed to switch between their other roles too. If I am a student only, I cannot change my role. But if I am a student and a leader, I can choose to switch between my roles and experience the application in different ways. 


# Development Concerns


For beginners to Angular applications, it is best to start by following an official [Angular Tutorial](https://angular.io/tutorial). This will walk one through the setup process, how to generate new components and services, how to use routing to navigate the application, and how to set up the frontend HTML to put everything together smoothly. 

For beginners to databases, it is equally beneficial to follow an online tutorial such as the [SQLAlchemy Unified Tutorial](https://docs.sqlalchemy.org/en/20/tutorial/index.html). While it is fairly long, it is worth the time to fully understand how the backend pieces are functioning.

In order to expand upon this feature, it is vital to understand how both the frontend and the backend work, as well as how they are connected. To do so, it is helpful to look at some of the following files:
* The /backend/entities folder contains all of the entities that are used in our application (see above for a detailed description of each). Each entity is connected to a model in /backend/models. 
* The /backend/services folder contains all of the services needed for our FastAPI routes, which are declared in /backend/api. 
* In /frontend/src/app, it is important to make sure that when a component is added, the proper routing is also added, as this is not automatic. Look in /frontend/src/app/app-routing.module.ts to see examples of how this is done.

**In order to get started, it is important to read through /docs/getting-started.md to get a full understanding of how to reset the database, start the development container, and authorize users.**


# Future Work

In the future, we would love to see this application fully developed with abilities for the user to have a more personalized experience. Some examples might include:
* On the page where all events are listed, the events could be filtered so that the first ones that show up are the ones hosted by a student’s clubs.  They likely have more interest in attending these events. 
* On the page where all clubs are listed, it would be beneficial to add a search bar so that a user can easily find a club if they have one in mind already. 
* If a student wishes to become a leader of a club, there could be functionality to send a request to a club leader or to administration so that they can be added to the list of leaders. 
