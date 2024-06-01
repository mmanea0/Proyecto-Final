import {Component, OnInit} from '@angular/core';
import { AsyncPipe } from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AnimeService} from "../../service/anime.service";
import {Observable, of} from "rxjs";
import {TruncatePipe} from "../../pipe/limte.pipe";

@Component({
  selector: 'app-explorar',
  standalone: true,
    imports: [
        AsyncPipe,
        TruncatePipe
    ],
  templateUrl: './explorar.component.html',
  styleUrl: './explorar.component.css'
})
export class ExplorarComponent implements OnInit{

  animes$: Observable<any> | undefined;

  constructor(
    private AnimeService: AnimeService,
    private router: ActivatedRoute,
    private ruta: Router
  ) {
  }

  ngOnInit(): void {
    this.cargarAnime();

  }


  cargarAnime() {

    this.router.params.subscribe((params) => {
      const id = params['id'];
      this.AnimeService.getAnime().subscribe(
        (anime) => {
          this.animes$ = of(anime);


        },
        error => {
          console.error('Error al cargar el anime',error);

        }
      );
    });
  }

  verAnime(anime: any): void {
    this.ruta.navigate(['/anime', anime.id]);
  }

  getShortSynopsis(synopsis: string): string {
    if (synopsis.length > 120) {
      return synopsis.substring(0, 120) + '...';
    }
    return synopsis;
  }

}
