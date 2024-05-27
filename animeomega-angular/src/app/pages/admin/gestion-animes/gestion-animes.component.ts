import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import { KeyValuePipe } from "@angular/common";
import {ApiAnimeService} from "../../../service/api-anime.service";
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";

@Component({
  selector: 'app-gestion-animes',
  standalone: true,
  imports: [
    FormsModule,
    KeyValuePipe
],
  templateUrl: './gestion-animes.component.html',
  styleUrl: './gestion-animes.component.css'
})
export class GestionAnimesComponent {
  query: string = '';
  prevQuery: string = '';
  results: any[] = [];
  loading: boolean = false;
  private searchSubject = new Subject<string>();

  constructor(
    private apiAnimeService: ApiAnimeService
  ) {
  }


  search() {
    if (this.query.length >= 3) {
      this.loading = true;
      this.apiAnimeService.searchAnime(this.query).subscribe(
        data => {
          this.loading = false;
          this.results = data;
          this.prevQuery = this.query;
        },
        error => {
          this.loading = false;
          console.error('Error searching for anime:', error);
        }
      );
    } else {
      this.results = [];
    }
  }

  selectAnime(anime: any) {
    const animeData = {
      id: anime.id,
      title: anime.title,
      description: anime.description,
      startDate: anime.startDate,
      endDate: anime.endDate,
      season: anime.season,
      seasonYear: anime.seasonYear,
      status: anime.status,
      episodes: anime.episodes,
      duration: anime.duration,
      format: anime.format,
      genres: anime.genres,
      averageScore: anime.averageScore,
      meanScore: anime.meanScore,
      siteUrl: anime.siteUrl,
      coverImage: anime.coverImage,
      bannerImage: anime.bannerImage,
      studios: anime.studios
    };

    this.apiAnimeService.saveAnime(animeData).subscribe(
      response => {
        console.log('Anime guardado en el backend:', response);
      },
      error => {
        console.error('Error al guardar el anime en el backend:', error);
      }
    );
  }
}
