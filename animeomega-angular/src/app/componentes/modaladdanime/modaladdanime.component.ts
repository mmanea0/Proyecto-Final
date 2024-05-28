import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Subject} from "rxjs";
import {ApiAnimeService} from "../../service/api-anime.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-modaladdanime',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './modaladdanime.component.html',
  styleUrl: './modaladdanime.component.css'
})
export class ModaladdanimeComponent {
  query: string = '';
  prevQuery: string = '';
  results: any[] = [];
  loading: boolean = false;
  ICONO_FLECHA : SafeHtml;

  private searchSubject = new Subject<string>();


  constructor(
    private apiAnimeService: ApiAnimeService,
    private santizer: DomSanitizer,

  ) {
    this.ICONO_FLECHA = this.santizer.bypassSecurityTrustHtml(`
       <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        class="w-5 h-5 text-green-400"
      >
        <path
          d="M14 5l7 7m0 0l-7 7m7-7H3"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
        ></path>
      </svg>
    `);
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

    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });


    this.apiAnimeService.saveAnime(animeData).subscribe(
      response => {
        Toast.fire({
          iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="#00b341" stroke-linecap="round" stroke-linejoin="round"><g stroke-dasharray="10" stroke-dashoffset="10" stroke-width="2"><path d="M3 5L5 7L9 3"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path><path d="M3 12L5 14L9 10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.75s" dur="0.3s" values="10;0"/></path><path d="M3 19L5 21L9 17"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.5s" dur="0.3s" values="10;0"/></path></g><g stroke-dasharray="22" stroke-dashoffset="22"><rect width="9" height="3" x="11.5" y="3.5" rx="1.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.75s" values="22;0"/></rect><rect width="9" height="3" x="11.5" y="10.5" rx="1.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.05s" dur="0.75s" values="22;0"/></rect><rect width="9" height="3" x="11.5" y="17.5" rx="1.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.8s" dur="0.75s" values="22;0"/></rect></g></g></svg>',
          title: 'Anime Añadido Correctamente',
          background: '#1a1e2b',
          color: '#fff',
          iconColor: 'transparent'
        });
        console.log('Anime guardado en el backend:', response);
      },
      error => {
        Toast.fire({
          iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="#ff0d1f" fill-rule="evenodd" d="M8 14.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m1-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25-6.25a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0z" clip-rule="evenodd"/></svg>',
          title: 'Anime Añadido Correctamente',
          background: '#1a1e2b',
          color: '#fff',
          iconColor: 'transparent'
        });

        console.error('Error al guardar el anime en el backend:', error);
      }
    );
  }
}
