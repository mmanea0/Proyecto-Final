import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ApiAnimeService} from "../../../service/api-anime.service";

@Component({
  selector: 'app-gestion-animes',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './gestion-animes.component.html',
  styleUrl: './gestion-animes.component.css'
})
export class GestionAnimesComponent {
  query: string = '';
  results: any[]|null = null;

  constructor(
    private apiAnimeService: ApiAnimeService
  ) {
  }

  search() {
    this.apiAnimeService.searchAnime(this.query).subscribe(data => {
      this.results = data.data.map((item: any) => item.node); // Asegúrate de acceder a la propiedad correcta
    });
  }
}
