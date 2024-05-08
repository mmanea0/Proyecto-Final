import { Component, OnInit } from '@angular/core';
import {AutenticacionService} from "../../auth/services/autenticacion.service";
import {Router} from "@angular/router";
import {async, Observable} from "rxjs";
import {FormsModule} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {AsyncPipe, NgIf} from "@angular/common";
import {User} from "../../auth/interfaces/user";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {



  credenciales = {
    login: '',
    pass: '',
  };
  ICONO_DISCORD: SafeHtml;
  userRoles$: Observable<string[]> | undefined;

  datosUsuario$: Observable<any> | undefined;

  errorInicioSesion: boolean = false;

  constructor(
    private autenticacionService: AutenticacionService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.ICONO_DISCORD = this.sanitizer.bypassSecurityTrustHtml(
      '  <svg data-v-9d2fac81="" data-v-0fc51e59="" xmlns="http://www.w3.org/2000/svg"\n' +
      '       xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="icon" width="24px" height="24px"\n' +
      '       viewBox="0 0 24 24">\n' +
      '    <path fill="currentColor"\n' +
      '          d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"></path>\n' +
      '  </svg>')

  }

  ngOnInit(): void {
    this.userRoles$ = this.autenticacionService.getRoles();
    this.datosUsuario$ = this.autenticacionService.getDatosUsuario();
    this.monstrarinfmoracion();
    this.verificarAutenticacion();
    this.verCardUsuraio()
  }

  login() {
    this.autenticacionService.iniciarSesion(this.credenciales.login, this.credenciales.pass)
      .subscribe({
        next: (autenticado: boolean) => {
          if (autenticado) {
            // Si la autenticación es exitosa, obtener y verificar los roles del usuario
            this.userRoles$ = this.autenticacionService.getRoles();
            // Redirigir al usuario a la página de inicio sabiendo sus roles
            this.userRoles$.subscribe(roles => {
              if (roles &&( roles.includes('Administrador') || roles.includes('Usuario') || roles.includes('Moderador'))) {
                this.router.navigate(['']).then(() => {
                  // Recargar la página
                  window.location.reload();
                });
              } else {
                // Para otros usuarios sin roles
                this.router.navigate(['']).then(() => {
                  // Recargar la página
                  window.location.reload();
                });
              }
            });
          } else {
            // Manejar el caso en que `iniciarSesion` devuelva false
            this.errorInicioSesion = true;
          }
        },
        error: (error: any) => {
          console.error('Error al iniciar sesión', error);
          this.errorInicioSesion = true;
        }
      });
  }


  logout() {
    this.autenticacionService.logout();
    this.router.navigateByUrl('').then(() => {
      window.location.reload();
    });
  }

  mostrarFormularioNormal: boolean = false;

  mostrarFormulario() {
    this.mostrarFormularioNormal = true;
  }

  montarinfouser = false;

  verCardUsuraio(){
    if (this.montarinfouser) {
      this.datosUsuario$ = this.autenticacionService.getDatosUsuario();
    }
  }


  montarinfo() {
    // Verificar si la sesión está iniciada
    if (this.autenticacionService.isSesionIniciada()) {
      // Establecer montarinfo en verdadero para mostrar la información del usuario
      this.montarinfouser = true;
    }
  }


  verificarAutenticacion() {
    // Verificar si la sesión está iniciada
    this.montarinfouser = this.autenticacionService.isSesionIniciada();
  }

  monstrarinfmoracion() {
    this.autenticacionService.getDatosUsuario().subscribe(usuario => {
      this.montarinfo();
    });
  }

}

