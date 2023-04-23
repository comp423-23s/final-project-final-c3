import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from 'src/app/profile/profile.service';
import { Paginated, PaginationParams } from 'src/app/pagination';
import { Club } from './clubs.service';

@Injectable({
  providedIn: 'root'
})
export class AdminClubsService {

  constructor(protected http: HttpClient) { }

  list(params: PaginationParams, club_id: string) {
    let paramStrings = {
      club_id: club_id,
      page: params.page.toString(),
      page_size: params.page_size.toString(),
      order_by: params.order_by,
      filter: params.filter
    }
    let query = new URLSearchParams(paramStrings);
    return this.http.get<Paginated<Profile>>(`api/club/get/members/paginated/${club_id}/${params.page.toString()}/${params.page_size.toString()}/${params.order_by}`)
  }
}
