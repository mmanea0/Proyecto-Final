import {Component, OnInit} from '@angular/core';
import {ApiAnimeService} from "../../../service/api-anime.service";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {EstadisticasComponent} from "../estadisticas/estadisticas.component";
import {GestionAnimesComponent} from "../gestion-animes/gestion-animes.component";
import {GestionUsuariosComponent} from "../gestion-usuarios/gestion-usuarios.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    RouterLink,
    RouterOutlet,
    EstadisticasComponent,
    GestionAnimesComponent,
    GestionUsuariosComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeAdminComponent implements OnInit{


  constructor(
    private router: Router
  ) {

  }

  ngOnInit() {
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
      const tabInput = document.getElementById(activeTab) as HTMLInputElement;
      if (tabInput) {
        tabInput.checked = true;
      }
    }
  }

  saveActiveTab(tabId: string): void {
    localStorage.setItem('activeTab', tabId);
  }
}
