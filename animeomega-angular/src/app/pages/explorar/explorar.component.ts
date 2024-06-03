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
  generosDisponibles: string[] = ['Action', 'Adventure', 'Comedy', 'Drama','Fantasy','Slice of Life'];
  generosSeleccionados: string[] = [];
  annosDisponibles: number[] = [2021, 2020, 2019, 2018, 2017, 2016, 2015,2006];
  annosSeleccionados: number[] = [];
  animes$: Observable<any> | undefined;
  generosControl = new FormControl();
  annosControl = new FormControl();
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
    this.cargarAnime();
    this.generosControl.valueChanges.subscribe((selectedGeneros: string[]) => {
      this.generosSeleccionados = selectedGeneros;
    });

    this.annosControl.valueChanges.subscribe((selectedAnnos: number[]) => {
      this.annosSeleccionados = selectedAnnos;
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

  toggleGeneroSeleccionado(genero: string): void {
    const index = this.generosSeleccionados.indexOf(genero);
    if (index === -1) {
      this.generosSeleccionados.push(genero);
    } else {
      this.generosSeleccionados.splice(index, 1);
    }
  }

  toggleAnnoSeleccionado(anno: number): void {
    const index = this.annosSeleccionados.indexOf(anno);
    if (index === -1) {
      this.annosSeleccionados.push(anno);
    } else {
      this.annosSeleccionados.splice(index, 1);
    }
  }

  filtrar(): void {
    this.AnimeService.searchAnimes(this.generosSeleccionados, this.annosSeleccionados).subscribe(
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
