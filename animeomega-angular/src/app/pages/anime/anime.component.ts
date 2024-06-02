import {Component, OnInit} from '@angular/core';
import {AnimeService} from "../../service/anime.service";
import {ActivatedRoute, Router} from "@angular/router";
import {map, Observable, of} from "rxjs";
import { AsyncPipe } from "@angular/common";
import Swal from 'sweetalert2';
import {FormsModule} from "@angular/forms";
import {TruncatePipe} from "../../pipe/limte.pipe";

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    TruncatePipe
],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.css'
})
export class AnimeComponent implements OnInit {

  anime$: Observable<any> | undefined;
  isLoading = false;
  sesionIniciada: boolean = false;
  isFavorito: boolean = false;
  capitulosVistos: { [key: number]: boolean } = {};

  constructor(
    private animeService: AnimeService,
    private route: ActivatedRoute,
    private router: Router,
    private serviceAnime: AnimeService
  ) { }

  ngOnInit(): void {
    this.cargarAnime();
    this.sesionIniciada = this.serviceAnime.isSesionIniciada();

  }


  cargarAnime() {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.animeService.getAnimePorId(id).subscribe(
        (anime) => {
          this.anime$ = of(anime);
          this.verificarFavorito(id);
          anime.capitulos.forEach((capitulo: any) => {
            this.verificacionCapituloVisto(capitulo);
          });
          this.isLoading = false;
        },
        error => {
          console.error('Error al cargar el anime', error);
          this.isLoading = false;
        }
      );
    });
  }

  verCapitulo(animeId: number, capituloId: number): void {
    this.router.navigate(['/anime', animeId, 'capitulo', capituloId]);
  }

  verificarFavorito(animeId: number) {
    if (this.sesionIniciada) {
      this.animeService.getUnfavortio(animeId).subscribe(
        (response) => {
          this.isFavorito = response.favorito === 1;
        },
        error => {
          console.error('Error al verificar el estado de favorito', error);
        }
      );
    }
  }

  verificacionCapituloVisto(capitulo: any): void {
    if (this.sesionIniciada) {
      this.animeService.GetUnEpisodioVisto(capitulo.id).subscribe(
        (response) => {
          capitulo.visto = response.visto === 1 || response.visto === true;
        },
        error => {
          console.error('Error al verificar el estado de capitulo visto', error);
        }
      );
    }
  }



  toggleFavorito(animeId: number): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    if (this.isFavorito) {
      this.animeService.removeFavorito(animeId).subscribe(
        () => {
          Toast.fire({
            iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#ff2424" d="m2.808 1.393l18.385 18.385l-1.415 1.414l-3.746-3.747L12 21.485l-8.478-8.492a6 6 0 0 1 .033-8.023L1.394 2.808zm17.435 3.364a6 6 0 0 1 .236 8.236l-1.635 1.636L7.26 3.046a5.99 5.99 0 0 1 4.741 1.483a5.998 5.998 0 0 1 8.242.228"/></svg>',
            title: 'Anime quitado de favoritos',
            background: '#1a1e2b',
            color: '#fff',
            iconColor: 'transparent'
          });
          this.isFavorito = false;
        },
        error => {
          console.error('Error al quitar el anime de favoritos', error);
          Swal.fire('Error', 'Ocurrió un error al quitar el anime de favoritos', 'error');
        }
      );
    } else {
      this.animeService.addFavoritos(animeId).subscribe(
        () => {
          Toast.fire({
            iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#ff2424" fill-opacity="0" d="M12 20L20.5 11V7L17 5.5L12 7L7 5.5L3.5 7V11L12 20Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.75s" dur="0.75s" values="0;1"/></path><path fill="none" stroke="#ff2424" stroke-dasharray="30" stroke-dashoffset="30" stroke-linecap="round" stroke-width="2" d="M12 8C12 8 12 8 12.7578 7C13.6343 5.84335 14.9398 5 16.5 5C18.9853 5 21 7.01472 21 9.5C21 10.4251 20.7209 11.285 20.2422 12C19.435 13.206 12 21 12 21M12 8C12 8 12 8 11.2422 7C10.3657 5.84335 9.06021 5 7.5 5C5.01472 5 3 7.01472 3 9.5C3 10.4251 3.27914 11.285 3.75777 12C4.56504 13.206 12 21 12 21"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.75s" values="30;0"/></path></svg>',
            title: 'Anime agregado a favoritos',
            background: '#1a1e2b',
            color: '#fff',
            iconColor: 'transparent'
          });
          this.isFavorito = true;
        },
        error => {
          console.error('Error al agregar el anime a favoritos', error);
          Swal.fire('Error', 'Ocurrió un error al agregar el anime a favoritos', 'error');
        }
      );
    }
  }


  addAbandonados(animeId: number): void {
    this.animeService.addAbandonado(animeId).subscribe(
      () => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
        Toast.fire({
          iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path fill="#00bfd8" d="m15 14l-.74.123a.75.75 0 0 1 .74-.873zM4 14v.75a.75.75 0 0 1-.75-.75zm16.522-2.392l.735-.147zM6 3.25h11.36v1.5H6zm12.56 11.5H15v-1.5h3.56zm-2.82-.873l.806 4.835l-1.48.247l-.806-4.836zm-.92 6.873h-.214v-1.5h.213zm-3.335-1.67L8.97 15.307l1.248-.832l2.515 3.773zM7.93 14.75H4v-1.5h3.93zM3.25 14V6h1.5v8zm16.807-8.54l1.2 6l-1.47.295l-1.2-6zM8.97 15.308a1.25 1.25 0 0 0-1.04-.557v-1.5c.92 0 1.778.46 2.288 1.225zm7.576 3.405a1.75 1.75 0 0 1-1.726 2.038v-1.5a.25.25 0 0 0 .246-.291zm2.014-5.462a1.25 1.25 0 0 0 1.226-1.495l1.471-.294a2.75 2.75 0 0 1-2.697 3.289zm-1.2-10a2.75 2.75 0 0 1 2.697 2.21l-1.47.295A1.25 1.25 0 0 0 17.36 4.75zm-2.754 17.5a3.75 3.75 0 0 1-3.12-1.67l1.247-.832a2.25 2.25 0 0 0 1.873 1.002zM6 4.75c-.69 0-1.25.56-1.25 1.25h-1.5A2.75 2.75 0 0 1 6 3.25z"/><path stroke="#00bfd8" stroke-width="1.5" d="M8 14V4"/></g></svg>',
          title: 'Anime agregado a abandonados',
          background: '#1a1e2b',
          color: '#fff',
          iconColor: 'transparent'
        });
      },
      error => {
        console.error('Error al agregar el anime a abandonados', error);
      }
    );
  }

  addSiguendo(animeId: number): void {
    this.animeService.addSiguiendo(animeId).subscribe(
      () => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
        Toast.fire({
          iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#ffec00" fill-opacity="0" stroke="#ffec00" stroke-dasharray="36" stroke-dashoffset="36" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6L18 12L8 18z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="36;0"/><animate fill="freeze" attributeName="fill-opacity" begin="0.75s" dur="0.75s" values="0;1"/></path></svg>',
          title: 'Anime agregado a siguiendo',
          background: '#1a1e2b',
          color: '#fff',
          iconColor: 'transparent'
        });
      },
      error => {
        console.error('Error al agregar el anime a siguiendo', error);
      }
    );
  }

  addPendiente(animeId: number): void {
    this.animeService.addPendientes(animeId).subscribe(
      () => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
        Toast.fire({
          iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#ff63c1" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"/><rect width="2" height="7" x="11" y="6" fill="#ff63c1" rx="1"><animateTransform attributeName="transform" dur="13.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></rect><rect width="2" height="9" x="11" y="11" fill="#ff63c1" rx="1"><animateTransform attributeName="transform" dur="1.125s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></rect></svg>',
          title: 'Anime agregado a pendientes',
          background: '#1a1e2b',
          color: '#fff',
          iconColor: 'transparent'
        });
      },
      error => {
        console.error('Error al agregar el anime a pendientes', error);
      }
    );
  }

  addCompletado(animeId: number): void {
    this.animeService.addCompleado(animeId).subscribe(
      () => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
        Toast.fire({
          iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><defs><mask id="lineMdCheckAll0"><g fill="none" stroke="#fff" stroke-dasharray="22" stroke-dashoffset="22" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M2 13.5l4 4l10.75 -10.75"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="22;0"/></path><path stroke="#000" stroke-width="4" d="M7.5 13.5l4 4l10.75 -10.75" opacity="0"><set attributeName="opacity" begin="0.6s" to="1"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.6s" values="22;0"/></path><path d="M7.5 13.5l4 4l10.75 -10.75" opacity="0"><set attributeName="opacity" begin="0.6s" to="1"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.6s" values="22;0"/></path></g></mask></defs><rect width="24" height="24" fill="#00b341" mask="url(#lineMdCheckAll0)"/></svg>',
          title: 'Anime agregado a completado',
          background: '#1a1e2b',
          color: '#fff',
          iconColor: 'transparent',

        });
      },
      error => {
        console.error('Error al agregar el anime a completado', error);
      }
    );
  }

  marcarEpisodioComoVisto(idCapitulo: number, isChecked: boolean): void {
    if (this.anime$) {
      this.animeService.marcarComoVisto(idCapitulo).subscribe(
        () => {
          this.anime$ = this.anime$?.pipe(
            map(anime => {
              if (anime && anime.capitulos) {
                anime.capitulos.forEach((capitulo: any) => {
                  if (capitulo.id === idCapitulo) {
                    capitulo.visto = isChecked;
                  }
                });
              }
              return anime;
            })
          );
        },
        error => {
          console.error('Error al marcar episodio como visto', error);
          // En caso de error, revertir el estado del checkbox
          if (this.anime$) {
            this.anime$ = this.anime$.pipe(
              map(anime => {
                if (anime && anime.capitulos) {
                  anime.capitulos.forEach((capitulo: any) => {
                    if (capitulo.id === idCapitulo) {
                      capitulo.visto = !isChecked;
                    }
                  });
                }
                return anime;
              })
            );
          }
        }
      );
    } else {
      console.error('Error: anime$ es undefined');
    }
  }
}
