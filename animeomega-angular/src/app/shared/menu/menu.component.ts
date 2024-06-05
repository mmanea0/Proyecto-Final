import {Component, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router, RouterLink} from "@angular/router";
import {AnimeService} from "../../service/anime.service";
import {FormsModule} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Anime} from "../../interfaces/anime";
import {delay, Observable} from "rxjs";
import {AutenticacionService} from "../../auth/services/autenticacion.service";
import {NotificacionesService} from "../../service/notificaciones.service";
import {TruncatePipe} from "../../pipe/limte.pipe";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    AsyncPipe,
    NgForOf,
    NgIf,
    TruncatePipe
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit, OnDestroy{
  ICONO_LUPA: SafeHtml;
  ICONO_CERRAR: SafeHtml;
  ICONO_CAMPANA: SafeHtml;
  ICONO_NOTIFICACIONES: SafeHtml;
  terminoBusqueda: string = '';
  resultadosBusqueda: Anime[] = [];
  listadodeanimes: Anime[] = [];
  ICONO_DISCORD: SafeHtml;
  montarinfouser = false;
  isAdmin = false;

  userRoles$: Observable<string[]> | undefined;

  datosUsuario$: Observable<any> | undefined;
  notificaciones: any[] = [];

  noHayNotificacionesMostrado = false;


  ngOnInit(): void {
    this.mostrarinfmoracion();
    this.datosUsuario$ = this.autenticacionService.getDatosUsuario();
    this.verificarAutenticacion();
    this.checkAdminRole();
    this.cargarNotificaciones();
    this.ajaxnotificaciones()
    this.cargaranime();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  constructor(
    private sanitizer: DomSanitizer,
    private animeService: AnimeService,
    private router: Router,
    private autenticacionService: AutenticacionService,
    private notificacioneservice: NotificacionesService,

  ) {
    this.ICONO_LUPA = this.sanitizer.bypassSecurityTrustHtml(`
     <svg class="w-5 h-5 text-white" aria-labelledby="search" role="img" xmlns="http://www.w3.org/2000/svg" fill="none" height="18" width="19">
          <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.333" stroke="currentColor" d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"></path>
        </svg>
    `);

    this.ICONO_CERRAR = this.sanitizer.bypassSecurityTrustHtml(`
      <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 18L18 6M6 6l12 12" stroke-linejoin="round" stroke-linecap="round"></path>
        </svg>`);

    this.ICONO_CAMPANA = this.sanitizer.bypassSecurityTrustHtml(`
     <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_78_2)">
      <path d="M18.334 9.16667C18.334 8.19421 18.7203 7.26158 19.4079 6.57394C20.0956 5.88631 21.0282 5.5 22.0007 5.5C22.9731 5.5 23.9057 5.88631 24.5934 6.57394C25.281 7.26158 25.6673 8.19421 25.6673 9.16667C27.7727 10.1622 29.5676 11.7119 30.8594 13.6497C32.1513 15.5875 32.8915 17.8403 33.0007 20.1667V25.6667C33.1386 26.8065 33.5423 27.8979 34.1791 28.8532C34.816 29.8085 35.6683 30.6009 36.6673 31.1667H7.33398C8.33304 30.6009 9.1853 29.8085 9.82216 28.8532C10.459 27.8979 10.8627 26.8065 11.0007 25.6667V20.1667C11.1098 17.8403 11.85 15.5875 13.1419 13.6497C14.4337 11.7119 16.2286 10.1622 18.334 9.16667Z" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16.5 31.166V32.9993C16.5 34.458 17.0795 35.857 18.1109 36.8884C19.1424 37.9199 20.5413 38.4993 22 38.4993C23.4587 38.4993 24.8576 37.9199 25.8891 36.8884C26.9205 35.857 27.5 34.458 27.5 32.9993V31.166" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_78_2">
        <rect width="44" height="44" fill="white"/>
      </clipPath>
    </defs>
  </svg>
    `);

    this.ICONO_NOTIFICACIONES = this.sanitizer.bypassSecurityTrustHtml(`
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_79_6)">
      <path d="M5.5 36.6669L7.88333 29.5169C5.82348 26.4704 5.07832 22.8627 5.7864 19.3644C6.49448 15.8662 8.60761 12.7156 11.7329 10.4984C14.8582 8.28117 18.783 7.14821 22.7775 7.31017C26.772 7.47213 30.5645 8.91799 33.4497 11.3789C36.3349 13.8399 38.1166 17.1484 38.4635 20.6894C38.8103 24.2303 37.6987 27.7628 35.3354 30.63C32.9721 33.4971 29.5179 35.5038 25.615 36.277C21.712 37.0502 17.626 36.5373 14.1167 34.8336L5.5 36.6669Z" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 22V22.0183" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14.666 22V22.0183" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M29.334 22V22.0183" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_79_6">
        <rect width="44" height="44" fill="white"/>
      </clipPath>
    </defs>
  </svg>`);

    this.ICONO_DISCORD = this.sanitizer.bypassSecurityTrustHtml(
      '  <svg data-v-9d2fac81="" data-v-0fc51e59="" xmlns="http://www.w3.org/2000/svg"\n' +
      '       xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="icon" width="24px" height="24px"\n' +
      '       viewBox="0 0 24 24">\n' +
      '    <path fill="currentColor"\n' +
      '          d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"></path>\n' +
      '  </svg>')
  }

  buscarAnime(): void {
    const termino = this.terminoBusqueda.toLowerCase();
    this.resultadosBusqueda = this.listadodeanimes.filter(anime =>
      anime.nombre_original_sin_kanji.toLowerCase().includes(termino)
    );
  }

  cargaranime() {
    this.animeService.getAnime().subscribe({
      next: (animes) => {
        this.listadodeanimes = animes;
      },
      error: (error) => {
        console.error('Error al obtener animes:', error);
      }
    });
  }

  seleccionarAnime(event: Event, anime: any): void {
    event.preventDefault();
    console.log('Anime seleccionado:', anime);
    this.router.navigate(['/anime', anime.id]);
  }


  mostrarinfmoracion() {
    this.autenticacionService.getDatosUsuario().subscribe(usuario => {
      this.autenticacionService.isSesionIniciada();
    });
  }

  verificarAutenticacion() {
    this.montarinfouser = this.autenticacionService.isSesionIniciada(); // Verificar si la sesión está iniciada
  }

  logout() {
    this.autenticacionService.logout();
    this.router.navigateByUrl('').then(() => {
      window.location.reload();
    });

  }
  checkAdminRole() {
    this.autenticacionService.getRoles().subscribe(roles => {
      this.isAdmin = roles.includes('Administrador');
    });
  }

  cargarNotificaciones(): void {
    this.notificacioneservice.getNotificaciones().subscribe(
      (data: any[]) => {
        this.notificaciones = data;
        if (this.notificaciones.length === 0 && !this.noHayNotificacionesMostrado) {
          this.noHayNotificacionesMostrado = true;
          console.log('No tienes notificaciones');
          clearInterval(this.intervalId);
        }else if (this.notificaciones.length > 0 && this.noHayNotificacionesMostrado) {
          this.noHayNotificacionesMostrado = false;
          this.ajaxnotificaciones();
        }
      },
      (error) => {
        console.error('Error al cargar las notificaciones', error);
      }
    );
  }


  isLoading = false;

  verAnime(anime: any, idNotificacion: number): void {
    this.isLoading = true;
    this.notificacioneservice.marcarLeida(idNotificacion).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/anime', anime.id]);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al marcar la notificación como leída', err);
        this.router.navigate(['/anime', anime.id]);
      }
    });
  }

  private intervalId: any;

  ajaxnotificaciones(): void {
    if (this.notificaciones.length === 0) {
      this.intervalId = setInterval(() => {
        this.cargarNotificaciones();
      }, 300); // 300 milisegundos
    }
  }

  marcarTodasComoLeidas(): void {
    this.notificacioneservice.marcarTodasComoLeidas().subscribe({
      next: () => {
        this.cargarNotificaciones();
      },
      error: (err) => {
        console.error('Error al marcar todas las notificaciones como leídas', err);
      }
    });
  }

}
