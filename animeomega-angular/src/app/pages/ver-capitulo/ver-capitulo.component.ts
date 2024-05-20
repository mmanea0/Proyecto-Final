import {Component, OnInit} from '@angular/core';
import {combineLatest, map, Observable, of, switchMap} from "rxjs";
import {AnimeService} from "../../service/anime.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-ver-capitulo',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './ver-capitulo.component.html',
  styleUrl: './ver-capitulo.component.css'
})
export class VerCapituloComponent implements OnInit{

  isLoading = false;
  ICONO_ANIME: SafeResourceUrl='';

  animeAndEnlaces$: Observable<{ anime: any, enlaces: any }> | undefined;
    constructor(
      private animeService: AnimeService,
      private route: ActivatedRoute,
      private router: Router,
      private sanitizer: DomSanitizer,
    ) {

      this.ICONO_ANIME = this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-menu-2" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M4 6l16 0" />
  <path d="M4 12l16 0" />
  <path d="M4 18l16 0" />
</svg>`)

    }

  ngOnInit(): void {
    this.carcarCapitulo();

  }


  carcarCapitulo(): void {
    this.animeAndEnlaces$ = this.route.params.pipe(
      switchMap(params => {
        const animeId = params['animeId'];
        const capituloId = params['capituloId'];
        return combineLatest([
          this.animeService.getAnimePorId(animeId),
          this.animeService.getEnlacesCapitulo(animeId, capituloId)
        ]);
      }),
      map(([anime, enlaces]) => ({ anime, enlaces }))
    );


  }
  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  verAnime(animeId: number): void {
    this.router.navigate(['/anime', animeId]);
  }
}


