import { Component } from '@angular/core';
import {ApiAnimeService} from "../../../service/api-anime.service";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeAdminComponent {
  query: string = '';
  results: any[]|null = null;

  constructor(private apiAnimeService: ApiAnimeService) {

  }

  search() {
    this.apiAnimeService.searchAnime(this.query).subscribe(data => {
      this.results = data.data.map((item: any) => item.node); // Asegúrate de acceder a la propiedad correcta
    });
  }
}
