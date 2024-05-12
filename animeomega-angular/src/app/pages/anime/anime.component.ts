import {Component, OnInit} from '@angular/core';
import {AnimeService} from "../../service/anime.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.css'
})
export class AnimeComponent implements OnInit {

  anime$: Observable<any> | undefined;
  isLoading = false;


  constructor(
    private animeService: AnimeService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.cargarAnime();
  }


  cargarAnime() {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.animeService.getAnimePorId(id).subscribe(
        (anime) => {
          this.anime$ = of(anime);
          this.isLoading = false;

        },
        error => {
          console.error('Error al cargar el anime', error);
          this.isLoading = false;

        }
      );
    });
  }

  verCapitulo(animeId: number, capituloId: number): void {
    this.router.navigate(['/anime', animeId, 'capitulo', capituloId]);
  }


  cargarUltimosAnimes() {
    this.isLoading = true;
    this.animeService.getultimos().subscribe(
      (anime) => {
        this.anime$ = of(anime);
        this.isLoading = false;
      },
      error => {
        console.error('Error al cargar el anime', error);
        this.isLoading = false;

      }
    );
  }
}
