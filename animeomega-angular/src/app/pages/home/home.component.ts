import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../../shared/menu/menu.component";
import {BarraLateralComponent} from "../../shared/barra-lateral/barra-lateral.component";
import {AnimeService} from "../../service/anime.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable, of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MenuComponent,
    BarraLateralComponent,
    AsyncPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  animes$: Observable<any> | undefined;
  ICONO_OJO: SafeHtml;


  constructor(
    private AnimeService: AnimeService,
    private router: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {
    this.ICONO_OJO = this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
  <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
</svg>`);
  }

  ngOnInit(): void {
    this.cargarAnime();
  }

  cargarAnime() {
   this.router.params.subscribe((params) => {
     const id = params['id'];
     this.AnimeService.getAnime().subscribe(
       (anime) => {
         this.animes$ = of(anime);
       },
       error => {
         console.error('Error al cargar el anime',error);
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
}
