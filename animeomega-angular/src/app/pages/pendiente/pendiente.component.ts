import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {AnimeService} from "../../service/anime.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pendiente',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './pendiente.component.html',
  styleUrl: './pendiente.component.css'
})
export class PendienteComponent implements OnInit{
  isLoading = false;
  animes: any[] = [];
  constructor(
    private animeService: AnimeService,
    private ruta: Router

  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.cargarPendiente();
  }

  cargarPendiente() {
    this.animeService.bibliotecaUsuario(2).subscribe(
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
