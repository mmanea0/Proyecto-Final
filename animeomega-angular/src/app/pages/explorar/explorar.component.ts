import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AnimeService} from "../../service/anime.service";
import {Observable, of} from "rxjs";
import {TruncatePipe} from "../../pipe/limte.pipe";
import {MatPaginator} from "@angular/material/paginator";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [
    AsyncPipe,
    TruncatePipe,
    MatPaginator,
    InfiniteScrollDirective,
    NgForOf,
    FormsModule,
    MatFormField,
    MatSelect,
    ReactiveFormsModule,
    MatOption,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './explorar.component.html',
  styleUrl: './explorar.component.css'
})
export class ExplorarComponent implements OnInit{
  generosDisponibles: string[] = [];
  generosSeleccionados: string[] = [];
  annosDisponibles: number[] = [];
  annosSeleccionados: number[] = [];
  categoriasDisponibles: string[] = [];
  categoriasSeleccionadas: string[] = [];
  estadoDisponible: string[] = [];
  estadoSeleccionados: string[] = [];
  orderDisponible: string[] = [];
  orderSeleccionados: string = '';

  animes$: Observable<any> | undefined;
  generosControl = new FormControl();
  annosControl = new FormControl();
  categoriasControl = new FormControl();
  estadoControl = new FormControl();
  orderControl = new FormControl();

  pageSize = 20;
  pageIndex = 0;
  animes: any[] = [];
  allAnimes: any[] = [];
  constructor(
    private AnimeService: AnimeService,
    private router: ActivatedRoute,
    private ruta: Router
  ) {
  }

  ngOnInit(): void {
    this.cargarGeneros();
    this.cargarAnnos();
    this.cargarAnime();
    this.cargarCategorias();
    this.cargarEstados();
    this.cargarOrdenar();
    this.generosControl.valueChanges.subscribe((selectedGeneros: string[]) => {
      this.generosSeleccionados = selectedGeneros;
    });
    this.annosControl.valueChanges.subscribe((selectedAnnos: number[]) => {
      this.annosSeleccionados = selectedAnnos;
    });
    this.categoriasControl.valueChanges.subscribe((selectedCategorias: string[]) => {
      this.categoriasSeleccionadas = selectedCategorias;
    });
    this.estadoControl.valueChanges.subscribe((selectedEstado: string[]) => {
      this.estadoSeleccionados = selectedEstado;
    });
    this.orderControl.valueChanges.subscribe((selectedOrder: string) => {
      this.orderSeleccionados = selectedOrder;
    });

  }

  cargarAnime() {
    this.router.params.subscribe((params) => {
      const id = params['id'];
      this.AnimeService.getAnime().subscribe(
        (animes) => {
          this.allAnimes = animes;
          this.loadMoreAnimes();
        },
        error => {
          console.error('Error al cargar el anime', error);
        }
      );
    });
  }

  loadMoreAnimes() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newAnimes = this.allAnimes.slice(startIndex, endIndex);
    this.animes = this.animes.concat(newAnimes);
    this.pageIndex++;
  }

  onScroll() {
    this.loadMoreAnimes();
  }

  verAnime(anime: any): void {
    this.ruta.navigate(['/anime', anime.id]);
  }

  getShortSynopsis(synopsis: string): string {
    if (synopsis.length > 120) {
      return synopsis.substring(0, 120) + '...';
    }
    return synopsis;
  }

  cargarGeneros(): void {
    this.AnimeService.getgeneros().subscribe(
      (generos) => {
        this.generosDisponibles = generos;
      },
      error => {
        console.error('Error al cargar los géneros', error);
      }
    );
  }

  cargarAnnos(): void {
    this.AnimeService.getanno().subscribe(
      (annos) => {
        this.annosDisponibles = annos;
      },
      error => {
        console.error('Error al cargar los años', error);
      }
    );
  }

  cargarCategorias(): void {
    this.AnimeService.getcategorias().subscribe(
      (categorias) => {
        this.categoriasDisponibles = categorias;
      },
      error => {
        console.error('Error al cargar las categorias', error);
      }
    );
  }

  cargarEstados(): void {
    this.AnimeService.getestados().subscribe(
      (estados) => {
        this.estadoDisponible = estados;
      },
      error => {
        console.error('Error al cargar los estados', error);
      }
    );
  }

  cargarOrdenar(): void {
    this.AnimeService.getordenar().subscribe(
      (ordenar) => {
        this.orderDisponible = ordenar;
      },
      error => {
        console.error('Error al cargar los ordenar', error);
      }
    );
  }

  filtrar(): void {
    this.AnimeService.searchAnimes(this.generosSeleccionados, this.annosSeleccionados, this.categoriasSeleccionadas,this.estadoSeleccionados,this.orderSeleccionados).subscribe(
      (animes) => {
        this.allAnimes = animes;
        this.pageIndex = 0;
        this.animes = [];
        this.loadMoreAnimes();
      },
      error => {
        console.error('Error al filtrar', error);
      }
    );
  }

}
