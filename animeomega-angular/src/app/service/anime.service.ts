import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Anime} from "../interfaces/anime";

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  private animeUrl : string = `${environment.urlapi}/anime`;
  constructor(
    private httpClient: HttpClient,
  ) { }

  getAnime(): Observable<any> {
    const $anime = this.httpClient.get<Anime[]>(`${this.animeUrl}`);
    return $anime;
  }

  getAnimeNombre(anime: string): Observable<any>{
    const $anime = this.httpClient.get<Anime>(`${this.animeUrl}/${anime}`);
    return $anime;
  }
}
