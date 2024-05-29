import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {EstadisticasGenero} from "../interfaces/estadisticas-genero";

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private base: string = `${environment.urlapi}`;

  constructor(private httpClient: HttpClient) { }

  isSesionIniciada(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  getGenero(): Observable<any> {
    if (this.isSesionIniciada()) {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
        });
        return this.httpClient.get<EstadisticasGenero[]>(`${this.base}/generosmasvistos`, { headers });
      }
    }
    return new Observable<EstadisticasGenero[]>();
  }



}
