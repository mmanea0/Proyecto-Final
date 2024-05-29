import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Usuario} from "../interfaces/usuario";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class GestionUsuarioService {

  private base: string = `${environment.urlapi}`;

  constructor(   private httpClient: HttpClient) {

  }
  isSesionIniciada(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  getUsuarios(): Observable<any> {
    if (this.isSesionIniciada()) {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
        });
        return this.httpClient.get<Usuario[]>(`${this.base}/usuarios`, { headers });
      }
    }
    return new Observable<any>();

  }


  borrarUsuario(idUsuario: number): Observable<any> {
    if (this.isSesionIniciada()) {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
        });
        // Pasar los encabezados como tercer parámetro
        return this.httpClient.post<any>(`${this.base}/eliminarusuario/${idUsuario}`, {}, { headers });
      }
    }
    return new Observable<any>();
  }

}
