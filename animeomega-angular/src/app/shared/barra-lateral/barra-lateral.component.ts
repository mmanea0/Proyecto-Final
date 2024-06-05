import {Component,OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import { NgClass } from "@angular/common";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MenuComponent} from "../menu/menu.component";
import {LoginComponent} from "../login/login.component";
import {AnimeService} from "../../service/anime.service";

@Component({
  selector: 'app-barra-lateral',
  standalone: true,
  imports: [
    RouterLink,
    MenuComponent,
    RouterOutlet,
    NgClass,
    LoginComponent
],
  templateUrl: './barra-lateral.component.html',
  styleUrl: './barra-lateral.component.css'
})
export class BarraLateralComponent implements OnInit{
  ICONO_EXPLORAR: SafeHtml;
  ICONO_LISTA: SafeHtml;
  ICONO_FLECHA_CERRADA: SafeHtml;
  ICONO_FLECHA_ABIERTA: SafeHtml;
  ICONO_SIGUIENDO: SafeHtml;
  ICONO_PENDIENTE: SafeHtml;
  ICONO_FAVORITO: SafeHtml;
  ICONO_COMPLETADO: SafeHtml;
  ICONO_ABANDONADO: SafeHtml;
  ICONO_ESTRENO: SafeHtml;
  ICONO_AJUSTES: SafeHtml;
  ICONO_CERRAR_SESION: SafeHtml;

  mostrarLista = true;

  seleccionado: { [key: string]: boolean } = {
    explorar: false,
    siguiendo: false,
    pendiente: false,
    favorito: false,
    completado: false,
    abandonado: false,
    estrenos: false,
  };
  sesionIniciada: boolean = false;
  ngOnInit() {
    const seleccionadoStr = localStorage.getItem('seleccionado');
    if (seleccionadoStr) {
      this.seleccionado = JSON.parse(seleccionadoStr);
    }
    this.limpiarSeleccion();
    this.sesionIniciada = this.serviceAnime.isSesionIniciada();
  }

  constructor(

    private santizer: DomSanitizer,
  private serviceAnime: AnimeService
  ) {
    this.ICONO_EXPLORAR = this.santizer.bypassSecurityTrustHtml(`
 <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_60_15)">
          <path d="M15 29.6667L18.6667 18.6667L29.6667 15L26 26L15 29.6667Z" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22 38.5C31.1127 38.5 38.5 31.1127 38.5 22C38.5 12.8873 31.1127 5.5 22 5.5C12.8873 5.5 5.5 12.8873 5.5 22C5.5 31.1127 12.8873 38.5 22 38.5Z" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0_60_15">
            <rect width="44" height="44" fill="white"/>
          </clipPath>
        </defs>
      </svg>`);

    this.ICONO_LISTA = this.santizer.bypassSecurityTrustHtml(`
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_60_20)">
          <path d="M27.4993 34.8327C31.5494 34.8327 34.8327 31.5494 34.8327 27.4993C34.8327 23.4493 31.5494 20.166 27.4993 20.166C23.4493 20.166 20.166 23.4493 20.166 27.4993C20.166 31.5494 23.4493 34.8327 27.4993 34.8327Z" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M33.916 33.916L38.4993 38.4993" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7.33398 11H36.6673" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7.33398 22H14.6673" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7.33398 33H14.6673" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0_60_20">
            <rect width="44" height="44" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    `);

    this.ICONO_FLECHA_ABIERTA = this.santizer.bypassSecurityTrustHtml(`
  <svg width="26" height="14" viewBox="0 0 26 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 1.5L13 12.5L2 1.5" stroke="white"  stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

    this.ICONO_FLECHA_CERRADA = this.santizer.bypassSecurityTrustHtml(`
     <svg width="26" height="14" viewBox="0 0 26 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.99805 12.5L12.998 1.5L23.998 12.5" stroke="white"  stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `);

    this.ICONO_SIGUIENDO = this.santizer.bypassSecurityTrustHtml(`
    <svg width="24" height="24" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 2.27734V20.1415L16.625 11.2094L2 2.27734Z" stroke="#FFEC00"  stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `);

    this.ICONO_PENDIENTE = this.santizer.bypassSecurityTrustHtml(`
    <svg width="24" height="24" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_60_34)">
<path d="M13.5 23.625C19.0919 23.625 23.625 19.0919 23.625 13.5C23.625 7.90812 19.0919 3.375 13.5 3.375C7.90812 3.375 3.375 7.90812 3.375 13.5C3.375 19.0919 7.90812 23.625 13.5 23.625Z" stroke="#FF63C1" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.5 7.875V13.5L16.875 16.875" stroke="#FF63C1"  stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_60_34">
<rect width="27" height="27" fill="white"/>
</clipPath>
</defs>
</svg>`);

    this.ICONO_FAVORITO = this.santizer.bypassSecurityTrustHtml(`
    <svg width="24" height="24" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.5771 11.0835L12.1396 19.3769L3.70212 11.0835C3.14559 10.546 2.70722 9.89999 2.41461 9.18612C2.12201 8.47225 1.9815 7.70598 2.00195 6.93556C2.0224 6.16515 2.20335 5.40728 2.53342 4.70969C2.86349 4.01209 3.33552 3.38988 3.91979 2.88223C4.50406 2.37458 5.18791 1.99249 5.92828 1.76002C6.66865 1.52756 7.4495 1.44975 8.22166 1.5315C8.99382 1.61324 9.74056 1.85278 10.4149 2.23502C11.0892 2.61725 11.6764 3.13391 12.1396 3.75246C12.6048 3.1384 13.1928 2.62626 13.8666 2.24808C14.5404 1.8699 15.2857 1.63382 16.0557 1.55463C16.8257 1.47543 17.6038 1.55483 18.3415 1.78784C19.0791 2.02085 19.7604 2.40246 20.3426 2.90878C20.9248 3.41511 21.3955 4.03526 21.7251 4.73041C22.0547 5.42555 22.2362 6.18075 22.2582 6.94871C22.2802 7.71668 22.1423 8.48088 21.853 9.19351C21.5638 9.90613 21.1294 10.5518 20.5771 11.0902" stroke="#FF2825" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `);

    this.ICONO_COMPLETADO = this.santizer.bypassSecurityTrustHtml(`
    <svg width="23" height="24" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 8.72709L8.625 14.3097L19.875 3.14453" stroke="#00B341"  stroke-width="4.58333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `);


    this.ICONO_ABANDONADO = this.santizer.bypassSecurityTrustHtml(`
    <svg width="24" height="24" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.5 11.8977V2.96564C6.5 2.66952 6.38147 2.38553 6.17049 2.17615C5.95952 1.96676 5.67337 1.84913 5.375 1.84913H3.125C2.82663 1.84913 2.54048 1.96676 2.3295 2.17615C2.11853 2.38553 2 2.66952 2 2.96564V10.7812C2 11.0773 2.11853 11.3613 2.3295 11.5707C2.54048 11.7801 2.82663 11.8977 3.125 11.8977H6.5ZM6.5 11.8977C7.69347 11.8977 8.83807 12.3683 9.68198 13.2058C10.5259 14.0434 11 15.1793 11 16.3638V17.4803C11 18.0725 11.2371 18.6405 11.659 19.0593C12.081 19.4781 12.6533 19.7133 13.25 19.7133C13.8467 19.7133 14.419 19.4781 14.841 19.0593C15.2629 18.6405 15.5 18.0725 15.5 17.4803V11.8977H18.875C19.4717 11.8977 20.044 11.6625 20.466 11.2437C20.8879 10.8249 21.125 10.2569 21.125 9.66471L20 4.08215C19.8382 3.3972 19.5313 2.80906 19.1255 2.40631C18.7197 2.00356 18.2369 1.80801 17.75 1.84913H9.875C8.97989 1.84913 8.12145 2.20202 7.48851 2.83018C6.85558 3.45834 6.5 4.31031 6.5 5.19866" stroke="#00BFD8" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `);


    this.ICONO_ESTRENO = this.santizer.bypassSecurityTrustHtml(`
<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_622_2)">
<path d="M9.16667 22H5.5L22 5.5L38.5 22H34.8333" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.16602 22V34.8333C9.16602 35.8058 9.55232 36.7384 10.24 37.4261C10.9276 38.1137 11.8602 38.5 12.8327 38.5H31.166C32.1385 38.5 33.0711 38.1137 33.7587 37.4261C34.4464 36.7384 34.8327 35.8058 34.8327 34.8333V22" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_622_2">
<rect width="44" height="44" fill="white"/>
</clipPath>
</defs>
</svg>
  `);

    this.ICONO_AJUSTES = this.santizer.bypassSecurityTrustHtml(`
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_61_69)">
<path d="M18.9292 7.9145C19.7102 4.69517 24.2898 4.69517 25.0708 7.9145C25.188 8.39813 25.4177 8.84726 25.7413 9.22533C26.0649 9.6034 26.4731 9.89973 26.9329 10.0902C27.3926 10.2807 27.8908 10.3599 28.3869 10.3214C28.8831 10.283 29.3631 10.1279 29.788 9.86883C32.6168 8.1455 35.8563 11.3832 34.133 14.2138C33.8743 14.6385 33.7195 15.1183 33.6811 15.6141C33.6427 16.1099 33.7219 16.6077 33.9121 17.0672C34.1024 17.5266 34.3984 17.9347 34.776 18.2583C35.1536 18.5818 35.6023 18.8117 36.0855 18.9292C39.3048 19.7102 39.3048 24.2898 36.0855 25.0708C35.6019 25.188 35.1527 25.4177 34.7747 25.7413C34.3966 26.0649 34.1003 26.4731 33.9098 26.9329C33.7193 27.3926 33.6401 27.8908 33.6786 28.3869C33.717 28.8831 33.8721 29.3631 34.1312 29.788C35.8545 32.6168 32.6168 35.8563 29.7862 34.133C29.3615 33.8743 28.8817 33.7195 28.3859 33.6811C27.8901 33.6427 27.3923 33.7219 26.9328 33.9121C26.4734 34.1024 26.0653 34.3984 25.7417 34.776C25.4182 35.1536 25.1883 35.6023 25.0708 36.0855C24.2898 39.3048 19.7102 39.3048 18.9292 36.0855C18.812 35.6019 18.5823 35.1527 18.2587 34.7747C17.9351 34.3966 17.5269 34.1003 17.0671 33.9098C16.6074 33.7193 16.1092 33.6401 15.6131 33.6786C15.1169 33.717 14.6369 33.8721 14.212 34.1312C11.3832 35.8545 8.14367 32.6168 9.867 29.7862C10.1257 29.3615 10.2805 28.8817 10.3189 28.3859C10.3573 27.8901 10.2781 27.3923 10.0879 26.9328C9.89762 26.4734 9.60164 26.0653 9.224 25.7417C8.84636 25.4182 8.3977 25.1883 7.9145 25.0708C4.69517 24.2898 4.69517 19.7102 7.9145 18.9292C8.39813 18.812 8.84726 18.5823 9.22533 18.2587C9.6034 17.9351 9.89973 17.5269 10.0902 17.0671C10.2807 16.6074 10.3599 16.1092 10.3214 15.6131C10.283 15.1169 10.1279 14.6369 9.86883 14.212C8.1455 11.3832 11.3832 8.14367 14.2138 9.867C16.0472 10.9817 18.4232 9.99533 18.9292 7.9145Z" stroke="white" stroke-opacity="0.7" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22 27.5C25.0376 27.5 27.5 25.0376 27.5 22C27.5 18.9624 25.0376 16.5 22 16.5C18.9624 16.5 16.5 18.9624 16.5 22C16.5 25.0376 18.9624 27.5 22 27.5Z" stroke="white" stroke-opacity="0.7" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_61_69">
<rect width="44" height="44" fill="white"/>
</clipPath>
</defs>
</svg>`);

    this.ICONO_CERRAR_SESION = this.santizer.bypassSecurityTrustHtml(`
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_61_74)">
<path d="M25.6667 14.6673V11.0007C25.6667 10.0282 25.2804 9.09556 24.5927 8.40793C23.9051 7.72029 22.9725 7.33398 22 7.33398H9.16667C8.19421 7.33398 7.26158 7.72029 6.57394 8.40793C5.88631 9.09556 5.5 10.0282 5.5 11.0007V33.0007C5.5 33.9731 5.88631 34.9057 6.57394 35.5934C7.26158 36.281 8.19421 36.6673 9.16667 36.6673H22C22.9725 36.6673 23.9051 36.281 24.5927 35.5934C25.2804 34.9057 25.6667 33.9731 25.6667 33.0007V29.334" stroke="white" stroke-opacity="0.7" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.834 22H38.5007M38.5007 22L33.0007 16.5M38.5007 22L33.0007 27.5" stroke="white"  stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_61_74">
<rect width="44" height="44" fill="white"/>
</clipPath>
</defs>
</svg>
`);
  }
//funciones
  toggleLista() {
    this.mostrarLista = !this.mostrarLista;
  }


  toggleSeleccion(elemento: string) {
    // Verifica si estás en una página específica
    const enPaginaEspecifica = this.enPaginaEspecifica();

    // Si no estás en una página específica, limpia la selección y retorna
    if (!enPaginaEspecifica) {
      this.limpiarSeleccion();
      return;
    }
    if (!this.seleccionado) {
      this.seleccionado = {};
    }
    const elementoSeleccionado = this.seleccionado[elemento];
    this.seleccionado[elemento] = !elementoSeleccionado;
    if (this.seleccionado[elemento]) {
      for (const key in this.seleccionado) {
        if (key !== elemento) {
          this.seleccionado[key] = false;
        }
      }
    }

    // Guardar el estado de selección en el almacenamiento local
    localStorage.setItem('seleccionado', JSON.stringify(this.seleccionado));
  }


  limpiarSeleccion() {
    // Limpiar la selección
    console.log('Limpiando la selección...');
    this.seleccionado = {};
    // Establecer todos los selectores como false
    for (const key in this.seleccionado) {
      this.seleccionado[key] = false;
    }
    // Guardar el estado de selección vacío en el almacenamiento local
    localStorage.removeItem('seleccionado');
  }



  enPaginaEspecifica() {
    // Obtiene la URL actual
    const currentUrl = window.location.pathname;

    // Verifica si la URL actual corresponde a alguna de las páginas específicas
    // Puedes personalizar esto según las rutas de tus páginas
    return (
      currentUrl.startsWith('/siguiendo') ||
      currentUrl.startsWith('/pendiente') ||
      currentUrl.startsWith('/favorito') ||
      currentUrl.startsWith('/completado') ||
      currentUrl.startsWith('/abandonado')
    );
  }

}
