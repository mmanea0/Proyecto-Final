import {Component, OnInit} from '@angular/core';
import {combineLatest, map, Observable, of, switchMap} from "rxjs";
import {AnimeService} from "../../service/anime.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-ver-capitulo',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './ver-capitulo.component.html',
  styleUrl: './ver-capitulo.component.css'
})
export class VerCapituloComponent implements OnInit{

  isLoading = false;

  animeAndEnlaces$: Observable<{ anime: any, enlaces: any }> | undefined;
    constructor(
      private animeService: AnimeService,
      private route: ActivatedRoute,
      private router: Router,
      private sanitizer: DomSanitizer
    ) { }

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

}


