import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AnimeService} from "../../service/anime.service";


@Component({
  selector: 'app-resultado-busqueda',
  standalone: true,
  imports: [],
  templateUrl: './resultado-busqueda.component.html',
  styleUrl: './resultado-busqueda.component.css'
})
export class ResultadoBusquedaComponent implements OnInit{

  terminoBusqueda: string = '';
  resultados: any[] = []; // Array para almacenar los resultados de la búsqueda

  constructor(
    private route: ActivatedRoute,
    private animeService: AnimeService
  ) { }

  ngOnInit(): void {
    // Obtener el término de búsqueda de los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.terminoBusqueda = params['termino'];
      // Realizar la búsqueda de anime utilizando el término de búsqueda
      this.buscarAnime();
    });
  }

  buscarAnime() {
    // Llamar al servicio de anime para realizar la búsqueda
    this.animeService.getAnimeNombre(this.terminoBusqueda).subscribe(
      (resultados: any[]) => {
        this.resultados = resultados; // Asignar los resultados de la búsqueda al array de resultados
      },
      error => {
        console.error('Error al realizar la búsqueda:', error);
      }
    );
  }
}
