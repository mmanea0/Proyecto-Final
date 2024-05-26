import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiAnimeService {

  private base: string = `${environment.urlapi}`;

  constructor(
    private httpClient: HttpClient,

  ) { }


  searchAnime(query: string): Observable<any> {
    return this.httpClient.get<any>(`${this.base}/api-search?query=${query}`);
  }
}
