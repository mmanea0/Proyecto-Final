import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {Anime} from "../../interfaces/anime";
import {AnimeService} from "../../service/anime.service";
import { AsyncPipe } from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-favorito',
  standalone: true,
  imports: [
    AsyncPipe
],
  templateUrl: './favorito.component.html',
  styleUrl: './favorito.component.css'
})
export class FavoritoComponent implements OnInit {
  favoritos: any[] = [];
  isLoading = false;

  constructor(
    private animeService: AnimeService,
    private ruta: Router

) {
  }

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  cargarFavoritos(): void {
    this.isLoading = true; // Indicar que se están cargando los favoritos
    this.animeService.getFavoritosUsuario().subscribe(
      (response) => {
        // Extraer los IDs de los animes de la respuesta
        const idsAnime = response.map((favorito: any) => favorito.id_anime);
        // Llamar al servicio para obtener la información completa de cada anime
        idsAnime.forEach((id: number) => { // Declarar el tipo de id como number
          this.animeService.getAnimePorId(id).subscribe(
            (anime) => {
              this.favoritos.push(anime); // Agregar el anime a la lista de favoritos
              this.isLoading = false; // Indicar que se han cargado los favoritos
            },
            (error) => {
              console.error('Error al cargar favorito:', error);
              this.isLoading = false; // Indicar que ha ocurrido un error al cargar los favoritos
            }
          );
        });
      },
      (error) => {
        console.error('Error al cargar favoritos:', error);
        this.isLoading = false; // Indicar que ha ocurrido un error al cargar los favoritos
      }
    );
  }

  verAnime(anime: any): void {
    this.ruta.navigate(['/anime', anime.id]);
  }

}
