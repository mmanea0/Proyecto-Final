import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Anime} from "../interfaces/anime";

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  private base: string = `${environment.urlapi}`;
  private animeUrl: string = `${environment.urlapi}/anime`;
  private favoritosUrl: string = `${environment.urlapi}/favoritos`;

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  getAnime(): Observable<any> {
    const $anime = this.httpClient.get<Anime[]>(`${this.animeUrl}`);
    return $anime;
  }

  getAnimeNombre(anime: string): Observable<any> {
    const $anime = this.httpClient.get<Anime>(`${this.animeUrl}/${anime}`);
    return $anime;
  }

  getAnimePorId(id: number): Observable<any> {
    const $anime = this.httpClient.get<Anime>(`${this.animeUrl}/id/${id}`);
    return $anime;

  }

  getEnlacesCapitulo(animeId: number, capituloId: number): Observable<any> {
    const $anime = this.httpClient.get<any>(`${this.animeUrl}/${animeId}/capitulos/${capituloId}`);
    return $anime;
  }

  getFavoritosUsuario(): Observable<any> {
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
        return this.httpClient.get<any>(this.favoritosUrl, {headers});
      }
    }
    // Si no se encontró un token JWT o la sesión no está iniciada, retornar un observable vacío o manejar el caso según sea necesario
    return new Observable<any>();
  }

  // Función para verificar si la sesión está iniciada
  private isSesionIniciada(): boolean {
    return !!localStorage.getItem('jwtToken');
  }


  //mostrar ultimos añadidos
  getultimos(): Observable<any> {
    const $anime = this.httpClient.get<Anime[]>(`${this.base}/ultimosanimes`);
    return $anime;

  }
}
