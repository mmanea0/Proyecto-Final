import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable, of} from "rxjs";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthDiscordService {
  public loginUrl : string = `${environment.urlapi}/login`;
  private muestraUsuario : string = `${environment.urlapi}/usuario`;
  private jwtToken: string | null = null;

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


iniciosesiondiscord(): Observable<any> {
  return this.httpClient.get<any>(this.loginUrl);
  }

muestrausuario() {
    return this.httpClient.get(this.muestraUsuario);
}

  iniciarSesionExterna(data: { access_token: string }): Observable<boolean> {
    // Verifica si está en el lado del cliente antes de acceder a localStorage
    if (isPlatformBrowser(this.platformId)) {
      // Guarda el token JWT y los datos del usuario
      this.jwtToken = data.access_token;
      localStorage.setItem('jwtToken', data.access_token);
    }
    // Considera que la sesión ha sido iniciada exitosamente
    return of(true);
  }
}
