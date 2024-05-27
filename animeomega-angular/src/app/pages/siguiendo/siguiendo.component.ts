import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../../shared/menu/menu.component";
import {BarraLateralComponent} from "../../shared/barra-lateral/barra-lateral.component";

import {AnimeService} from "../../service/anime.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-siguiendo',
  standalone: true,
  imports: [
    MenuComponent,
    BarraLateralComponent
],
  templateUrl: './siguiendo.component.html',
  styleUrl: './siguiendo.component.css'
})
export class SiguiendoComponent implements OnInit{
  animes: any[] = [];
  isLoading = false;

  constructor(
    private animeService: AnimeService,
    private ruta: Router

) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.cargarSiguiendo();
  }

  cargarSiguiendo() {
    this.animeService.bibliotecaUsuario(1).subscribe(
      (response: any) => {
        // Asigna la respuesta (lista de animes) a la variable animes
        this.animes = response;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error al obtener los animes:', error);
        this.isLoading = false;
      }
    );
  }

  verAnime(anime: any): void {
    this.ruta.navigate(['/anime', anime.id]);
  }
}
