import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {map, Observable, of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AnimeService} from "../../service/anime.service";
import {AsyncPipe} from "@angular/common";
import {TruncatePipe} from "../../pipe/limte.pipe";
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-tablaanime',
  standalone: true,
  imports: [
    AsyncPipe,
    TruncatePipe,
    FormsModule
  ],
  templateUrl: './tablaanime.component.html',
  styleUrl: './tablaanime.component.css'
})
export class TablaanimeComponent implements OnInit,OnChanges{

  animes$: Observable<any> | undefined;
  @Input() filtro: string | undefined;
  @Input() datos: any[] | undefined;
  datosFiltrados: any[] | undefined;
  capituloData: any = {
    numero_capitulo: '',
    sipnosis: '',
    duracion: '',
    enlaces: [{ url: '' }]
  };
  idAnime: any;
  nombreAnime: string | undefined;
  constructor(
    private AnimeService: AnimeService,
    private router: ActivatedRoute,
    private ruta: Router
  ) {
  }

  ngOnInit(): void {
    this.cargarAnime();

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtro'] || changes['datos']) {
      this.filtrarDatos();
    }
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


  actualizarTabla(): void {
    this.cargarAnime();
  }

  filtrarDatos(): void {
    if (!this.filtro || !this.datos) {
      this.datosFiltrados = this.datos;
      return;
    }

    const filtroMinusculas = this.filtro.toLowerCase().trim();
    this.datosFiltrados = this.datos.filter((dato: any) => {
      return Object.keys(dato).some((key: string) => {
        const valor = dato[key];
        if (typeof valor === 'string') {
          return valor.toLowerCase().includes(filtroMinusculas);
        }
        return false;
      });
    });
  }

  buscar(): void {
    if (!this.filtro || this.filtro.trim() === '') {
      // Si el filtro está vacío, cargar todos los animes nuevamente
      this.cargarAnime();
      return;
    }

    if (!this.animes$) {
      // Si no hay animes cargados, no realizar la búsqueda
      return;
    }

    this.animes$ = this.AnimeService.getAnime().pipe(
      map(animes => {
        if (!animes) {
          return [];
        }

        return animes.filter((anime: any) =>
          anime.nombre_original_sin_kanji.toLowerCase().includes(this.filtro!.toLowerCase())
        );
      })
    );
  }


  openEditModal(animeId: any, nombreAnime: string): void {
    if (typeof animeId !== 'number') {
      console.error('El ID del anime no es un número:', animeId);
      return;
    }
    console.log('Función openEditModal llamada con ID:', animeId);
    this.idAnime = animeId;
    this.nombreAnime = nombreAnime;
    this.capituloData = {
      numero_capitulo: '',
      sipnosis: '',
      duracion: '',
      enlaces: [{ url: '' }]
    };

    // Obtener el último capítulo del anime
    this.AnimeService.getUltimoCapituloDelAnime(animeId).subscribe(
      (response) => {
        if (response && response.ultimo_capitulo !== undefined) {
          // Asignar el número del último capítulo + 1 al campo número_capitulo
          this.capituloData.numero_capitulo = response.ultimo_capitulo + 1;
        } else {
          this.capituloData.numero_capitulo = 1; // Si no hay capítulos, comenzar con 1
        }
      },
      (error) => {
        console.error('Error al obtener el último capítulo del anime', error);
      }
    );
  }

  onSubmit(): void {

    if (!this.idAnime) {
      console.error('ID del anime no definido');
      return;
    }


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
    this.AnimeService.addCapituloAnime(this.idAnime, this.capituloData).subscribe(
      (response) => {
        Toast.fire({
          iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="#4ade80" stroke-linecap="round" stroke-linejoin="round"><g stroke-dasharray="10" stroke-dashoffset="10" stroke-width="2"><path d="M3 5L5 7L9 3"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path><path d="M3 12L5 14L9 10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.75s" dur="0.3s" values="10;0"/></path><path d="M3 19L5 21L9 17"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.5s" dur="0.3s" values="10;0"/></path></g><g stroke-dasharray="22" stroke-dashoffset="22"><rect width="9" height="3" x="11.5" y="3.5" rx="1.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.75s" values="22;0"/></rect><rect width="9" height="3" x="11.5" y="10.5" rx="1.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.05s" dur="0.75s" values="22;0"/></rect><rect width="9" height="3" x="11.5" y="17.5" rx="1.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.8s" dur="0.75s" values="22;0"/></rect></g></g></svg>',
          title: 'Capitulo Añadido Correctamente',
          background: '#1a1e2b',
          color: '#fff',
          iconColor: 'transparent'
        });
        console.log('Capítulo añadido correctamente', response);
      },
      (error) => {
        Toast.fire({
          iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#ff2825" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v2m-4 12h2a2 2 0 0 0 2-2v-2M9 10h.01M15 10h.01M9.5 15.05a3.5 3.5 0 0 1 5 0"/></svg>',
          title: 'Capitulo Error Correctamente',
          background: '#1a1e2b',
          color: '#fff',
          iconColor: 'transparent'
        });
        console.error('Error añadiendo capítulo', error);
      }
    );
  }

  openDeleteModal(animeId: any): void {
    if (typeof animeId !== 'number') {
      console.error('El ID del anime no es un número:', animeId);
      return;
    }
    console.log('Función openDeleteModal llamada con ID:', animeId);
    this.idAnime = animeId;


  }

  deleteAnime(animeId:any): void {
    if (!animeId) {
      console.error('ID del anime no definido');
      return;
    }

    this.AnimeService.deleteAnime(animeId).subscribe(
      (response) => {
        console.log('Anime eliminado correctamente', response);
        this.ruta.navigate(['/admin/gestionAnime']);
      },
      (error) => {
        console.error('Error eliminando anime', error);
      }
    );
  }

  getultimocap(animeid: number){

this.AnimeService.getUltimoCapituloDelAnime(animeid).subscribe(
      (anime) => {
        this.animes$ = of(anime);
      },
      error => {
        console.error('Error al cargar el anime',error);
      }
    );

  }

}

