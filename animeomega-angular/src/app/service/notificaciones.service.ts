import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, map, Observable, of} from "rxjs";
import {Usuario} from "../interfaces/usuario";

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private base: string = `${environment.urlapi}`;

  constructor(
    private httpClient: HttpClient
  ) {

  }

  isSesionIniciada(): boolean {
    return !!localStorage.getItem('jwtToken');
  }


  getNotificaciones(): Observable<any[]> {
    if (this.isSesionIniciada()) {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
        });
        return this.httpClient.get<any>(`${this.base}/notificaciones`, { headers }).pipe(
          map(response => {
            if (Array.isArray(response)) {
              return response;
            } else {
              console.warn(response.message || 'Respuesta inesperada del servidor');
              return [];
            }
          }),
          catchError(error => {
            console.error('Error fetching notifications', error);
            return of([]); // Devolver un array vacío en caso de error
          })
        );
      }
    }
    return of([]); // Devolver un array vacío si no hay sesión iniciada
  }

  marcarLeida(idNotificacion: number): Observable<any> {
    if (this.isSesionIniciada()) {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
        });
        return this.httpClient.post<any>(`${this.base}/notificacionesleido/${idNotificacion}`, {}, { headers });
        }
  }
    return new Observable<any>();
  }


  marcarTodasComoLeidas(): Observable<any> {
    if (this.isSesionIniciada()) {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
        });
        return this.httpClient.post<any>(`${this.base}/notificacionesleidotodas`, {}, { headers });
      }
    }
    return of(null);
  }
  
}
