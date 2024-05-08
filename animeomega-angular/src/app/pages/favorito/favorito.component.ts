import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {Anime} from "../../interfaces/anime";
import {AnimeService} from "../../service/anime.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-favorito',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './favorito.component.html',
  styleUrl: './favorito.component.css'
})
export class FavoritoComponent implements OnInit {
  favoritos: any[] = [];
  cargandoFavoritos: boolean = false;

  constructor(
    private animeService: AnimeService,
    private ruta: Router

) {
  }

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  cargarFavoritos(): void {
    this.cargandoFavoritos = true; // Indicar que se están cargando los favoritos
    this.animeService.getFavoritosUsuario().subscribe(
      (response) => {
        // Extraer los IDs de los animes de la respuesta
        const idsAnime = response.map((favorito: any) => favorito.id_anime);
        // Llamar al servicio para obtener la información completa de cada anime
        idsAnime.forEach((id: number) => { // Declarar el tipo de id como number
          this.animeService.getAnimePorId(id).subscribe(
            (anime) => {
              this.favoritos.push(anime); // Agregar el anime a la lista de favoritos
              this.cargandoFavoritos = false; // Indicar que se han cargado los favoritos
            },
            (error) => {
              console.error('Error al cargar favorito:', error);
              this.cargandoFavoritos = false; // Indicar que ha ocurrido un error al cargar los favoritos
            }
          );
        });
      },
      (error) => {
        console.error('Error al cargar favoritos:', error);
        this.cargandoFavoritos = false; // Indicar que ha ocurrido un error al cargar los favoritos
      }
    );
  }

  verAnime(anime: any): void {
    this.ruta.navigate(['/anime', anime.id]);
  }

}
