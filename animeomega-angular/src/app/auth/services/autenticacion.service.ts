import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Observable, catchError, map, of} from 'rxjs';
import {AlertController} from '@ionic/angular';
import {User} from '../interfaces/user';
import {LoginRequest, LoginResponse} from "../interfaces/auth";
import {environment} from "../../../environments/environment";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  // URL Inicio de sesión
  private loginUrl: string = `${environment.urlapi}/iniciosesion`;
  private registerUrl = `${environment.urlapi}/register`;

  // Token JWT que nos devuelve el servidor al iniciar sesión
  private jwtToken: string | null = null;
  private roles: string[] = [];
  private username: string | null = null;

  constructor(
    private httpClient: HttpClient,
    private alertController: AlertController,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  /**
   * Método para iniciar sesión
   * @param login
   * @param pass
   * @returns
   */
  iniciarSesion(login: string, pass: string): Observable<boolean> {

    // Crea el objeto que contiene las credenciales
    const credenciales: LoginRequest = {
      nickname: login,
      password: pass
    }

    // Retorna un observable
    return this.httpClient.post<LoginResponse>(this.loginUrl, credenciales)
      .pipe(
        map((response) => {
          if (response.activo === 0) {
            return false;
          } else if (response.bloqueado === 1) {
            return false;
          } else if (response && response.access_token) {
            // Toma el token JWT y lo almacena
            this.jwtToken = response.access_token;

            localStorage.setItem('jwtToken', response.access_token);

            // Toma los roles y los almacena
            this.roles = response.roles;
            localStorage.setItem('roles', JSON.stringify(response.roles));
            console.log('Roles del usuario: ', JSON.stringify(response.roles));
            console.log(response.bloqueado, response.activo);
            this.username = response.nickname;
            localStorage.setItem('nickname', response.nickname);
            return true;
          } else {
            throw new Error('Credenciales inválidas');
          }
        }),
        catchError((error: any) => {
          console.error('Error en la autenticación:', error);
          return of(false);
        })
      );
  }

  isSesionIniciada(): boolean {
    // Verifica si está en el lado del cliente antes de acceder a localStorage
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('jwtToken'); // Devuelve true si hay un token JWT en localStorage (!! convierte el valor en booleano)
    } else {
      // En el servidor, asume que la sesión no está iniciada por defecto
      return false;
    }
  }

  // // Devuelve el token JWT del usuario que ha iniciado sesión
  getJwtToken(): string | null {
    // Si no hay token en la memoria, intenta obtenerlo del localStorage
    if (!this.jwtToken) {
      this.jwtToken = localStorage.getItem('jwtToken');
    }
    return this.jwtToken;
  }

  // Recoge los roles del usuario que ha iniciado sesión
  getRoles(): Observable<string[]> {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    return of(roles);
  }

  getDatosUsuario(): Observable<User> {
    // Verificar si la sesión está iniciada
    if (this.isSesionIniciada()) {
      // Obtener el token JWT del almacenamiento local
      const jwtToken = localStorage.getItem('jwtToken');
      // Verificar si se encontró un token JWT
      if (jwtToken) {
        // Construir las cabeceras de la solicitud con el token JWT
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
        });
        // Realizar la solicitud HTTP con las cabeceras
        return this.httpClient.get<User>(`${this.loginUrl}/info`, {headers});
      }
    }
    // Si no se encontró un token JWT o la sesión no está iniciada, retornar un observable vacío o manejar el caso según sea necesario
    return new Observable<User>();
  }

// Cierra la sesión
logout()
{
  this.jwtToken = null;
  localStorage.clear();
  window.location.reload();
}

/*
 * Registro de usuario
 * @param user
 */
register(user
:
User
):
Observable < any > {
  return this.httpClient.post(this.registerUrl, user);
}

}



