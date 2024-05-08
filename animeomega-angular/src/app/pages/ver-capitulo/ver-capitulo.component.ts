import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
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

  enlaces$: Observable<any> | undefined;
    constructor(
      private animeService: AnimeService,
      private route: ActivatedRoute,
      private router: Router,
      private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
      this.cargarEnlacesCapitulo();
    }

  cargarEnlacesCapitulo() {
    this.route.params.subscribe(params => {
      const animeId = params['animeId'];
      const capituloId = params['capituloId'];
      this.enlaces$ = this.animeService.getEnlacesCapitulo(animeId, capituloId);
    });
  }
  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
