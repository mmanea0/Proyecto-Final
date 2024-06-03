import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../../shared/menu/menu.component";
import {BarraLateralComponent} from "../../shared/barra-lateral/barra-lateral.component";
import {AnimeService} from "../../service/anime.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {map, Observable, of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {UltimosagregadosComponent} from "../../componentes/ultimosagregados/ultimosagregados.component";
import {TruncatePipe} from "../../pipe/limte.pipe";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MenuComponent,
    BarraLateralComponent,
    AsyncPipe,
    NgIf,
    NgForOf,
    UltimosagregadosComponent,
    TruncatePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  animes$: Observable<any> | undefined;
  isLoading = false;

  currentIndex = 0;

  constructor(
    private AnimeService: AnimeService,
    private router: ActivatedRoute,
    private ruta: Router
  ) {

  }

  ngOnInit(): void {
    this.cargarAnime();
  }


  anteriorImagen(): void {
    if (this.animes$) {
      this.animes$.subscribe(animes => {
        const lastIndex = 4;
        this.currentIndex = this.currentIndex === 0 ? lastIndex : this.currentIndex - 1;
      });
    }
  }

  siguienteImagen(): void {
    if (this.animes$) {
      this.animes$.subscribe(animes => {
        const lastIndex = 4; // Índice de la última imagen en la vista
        this.currentIndex = this.currentIndex === lastIndex ? 0 : this.currentIndex + 1;
      });
    }
  }



  cargarAnime() {
    this.isLoading = true;
    this.router.params.subscribe((params) => {
      const id = params['id'];
      this.AnimeService.getAnime().pipe(
        map(anime => anime.slice(0, 16)) // Obtener solo los primeros 15 animes
      ).subscribe(
        (anime) => {
          this.animes$ = of(anime);
          this.isLoading = false;
        },
        error => {
          console.error('Error al cargar el anime', error);
          this.isLoading = false;
        }
      );
    });
  }


  tooltipText: string | null = null; // Inicializamos el texto del tooltip como nulo

  // Función para mostrar el tooltip
  mostrarTooltip(sipnosis: string): void {
    this.tooltipText = sipnosis; // Establecemos el texto del tooltip
  }

  // Función para ocultar el tooltip
  ocultarTooltip(): void {
    this.tooltipText = null; // Restablecemos el texto del tooltip a nulo
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
