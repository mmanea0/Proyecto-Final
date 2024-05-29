import {Component, Input, OnInit} from '@angular/core';
import {Usuario} from "../../../interfaces/usuario";
import {ActivatedRoute, Router} from "@angular/router";
import {GestionUsuarioService} from "../../../service/gestion-usuario.service";
import {map, Observable, of} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TruncatePipe} from "../../../pipe/limte.pipe";




@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  templateUrl: './gestion-usuarios.component.html',
  imports: [
    AsyncPipe,
    FormsModule,
    TruncatePipe
  ],
  styleUrl: './gestion-usuarios.component.css'
})


export class GestionUsuariosComponent implements OnInit{

  usuarios$: Observable<any> | undefined;
  @Input() filtro: string | undefined;
  @Input() datos: any[] | undefined;
  idUsuario: any;

  constructor(
    private usuarioService: GestionUsuarioService,
    private router: ActivatedRoute,
    private ruta: Router
  ) {
  }

  ngOnInit() {
    this.cargarUsuarios();
  }


  cargarUsuarios() {
    this.router.params.subscribe((params) => {
      const id = params['id'];
      this.usuarioService.getUsuarios().subscribe(
        (usuario) => {
          this.usuarios$ = of(usuario);


        },
        error => {
          console.error('Error al cargar el usuario',error);

        }
      );
    });
  }

  actualizarTabla(): void {
    this.cargarUsuarios();
  }

  buscar(): void {
    if (!this.filtro || this.filtro.trim() === '') {
      // Si el filtro está vacío, cargar todos los animes nuevamente
      this.cargarUsuarios();
      return;
    }

    if (!this.usuarios$) {
      // Si no hay animes cargados, no realizar la búsqueda
      return;
    }

    this.usuarios$ = this.usuarioService.getUsuarios().pipe(
      map(usuarios => {
        if (!usuarios) {
          return [];
        }

        return usuarios.filter((usuario: any) =>
          usuario.name.toLowerCase().includes(this.filtro!.toLowerCase())
        );
      })
    );
  }


  openDeleteModal(usuarioId: any): void {
    if (typeof usuarioId !== 'number') {
      console.error('El ID del anime no es un número:', usuarioId);
      return;
    }
    console.log('Función openDeleteModal llamada con ID:', usuarioId);
    this.idUsuario = usuarioId;
  }


  deleteAnime(animeId:any): void {
    if (!animeId) {
      console.error('ID del anime no definido');
      return;
    }

    this.usuarioService.borrarUsuario(animeId).subscribe(
      (response) => {
        console.log('Usuario eliminado correctamente', response);
        this.ruta.navigate(['/admin/gestionUsuario']);
      },
      (error) => {
        console.error('Error eliminando Usuario', error);
      }
    );
  }


}
