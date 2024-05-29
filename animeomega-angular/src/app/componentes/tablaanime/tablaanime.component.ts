import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {map, Observable, of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AnimeService} from "../../service/anime.service";
import {AsyncPipe} from "@angular/common";
import {TruncatePipe} from "../../pipe/limte.pipe";
import {FormsModule} from "@angular/forms";

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


  openEditModal(animeId: any): void {
    if (typeof animeId !== 'number') {
      console.error('El ID del anime no es un número:', animeId);
      return;
    }
    console.log('Función openEditModal llamada con ID:', animeId);
    this.idAnime = animeId;
    this.capituloData = {
      numero_capitulo: '',
      sipnosis: '',
      duracion: '',
      enlaces: [{ url: '' }]
    };
  }

  onSubmit(): void {

    if (!this.idAnime) {
      console.error('ID del anime no definido');
      return;
    }

    this.AnimeService.addCapituloAnime(this.idAnime, this.capituloData).subscribe(
      (response) => {
        console.log('Capítulo añadido correctamente', response);
      },
      (error) => {
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

}

