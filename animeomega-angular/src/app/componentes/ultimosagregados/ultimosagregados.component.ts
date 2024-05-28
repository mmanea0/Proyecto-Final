import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AnimeService} from "../../service/anime.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {TruncatePipe} from "../../pipe/limte.pipe";

@Component({
  selector: 'app-ultimosagregados',
  standalone: true,
    imports: [
        NgForOf,
        AsyncPipe,
        NgIf,
        TruncatePipe
    ],
  templateUrl: './ultimosagregados.component.html',
  styleUrl: './ultimosagregados.component.css'
})
export class UltimosagregadosComponent implements OnInit {

  animes$: Observable<any> | undefined;
  isLoading = false;
  selectedAnime: any;

  constructor(
    private AnimeService: AnimeService,
    private router: ActivatedRoute,
    private ruta: Router
  ) { }

  ngOnInit(): void {
    this.cargarAnime();
  }


  cargarAnime() {
    this.router.params.subscribe((params) => {
      const id = params['id'];
      this.AnimeService.getultimos().subscribe(
        (anime) => {
          this.animes$ = of(anime);
        },
        error => {
          console.error('Error al cargar el anime',error);
        }
      );
    });
  }

  verCapituloAnime(anime: any, idcapitulo: number): void {
    this.ruta.navigate(['/anime', anime.id, 'capitulo', idcapitulo]);
  }

  openEditModal(anime: any): void {
    this.selectedAnime = anime; // Almacena los datos del anime seleccionado
  }
}


