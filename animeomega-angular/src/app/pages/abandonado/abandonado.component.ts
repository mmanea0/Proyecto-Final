import {Component, OnInit} from '@angular/core';

import {AnimeService} from "../../service/anime.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-abandonado',
  standalone: true,
  imports: [],
  templateUrl: './abandonado.component.html',
  styleUrl: './abandonado.component.css'
})
export class AbandonadoComponent implements OnInit{
  isLoading = false;
  animes: any[] = [];

  constructor(
    private animeService: AnimeService,
    private ruta: Router


  ) { }

  ngOnInit(): void {
   this.isLoading = true;
    this.cargarAbandonado();
  }
  cargarAbandonado() {
    this.animeService.bibliotecaUsuario(4).subscribe(
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
