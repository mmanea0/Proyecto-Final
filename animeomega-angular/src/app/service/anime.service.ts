import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
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
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        // Construir las cabeceras de la solicitud con el token JWT
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
        });
        return this.httpClient.get<any>(this.favoritosUrl, {headers});
      }
    }
    // Si no se encontró un token JWT o la sesión no está iniciada, retornar un observable vacío o manejar el caso según sea necesario
    return new Observable<any>();
  }


  getUnfavortio(animeId: number): Observable<any> {
    if (this.isSesionIniciada()) {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
        });
        return this.httpClient.get<any>(`${this.base}/favorito/${animeId}`, { headers });
      }
    }
    return new Observable<any>();
  }

  GetUnEpisodioVisto($id_capitulo: number): Observable<any> {
    if (this.isSesionIniciada()) {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
        });
        return this.httpClient.get<any>(`${this.base}/capitulosvisto/${$id_capitulo}`, { headers });
      }
    }
    return new Observable<any>();
  }

  marcarComoVisto($id_capitulo: number): Observable<any> {
    if (this.isSesionIniciada()) {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
        });
        return this.httpClient.post<any>(`${this.base}/marcarvisto/${$id_capitulo}`, {}, { headers });
      }
    }
    return throwError('Token JWT no encontrado o sesión no iniciada');
  }



  removeFavorito(animeId: number): Observable<any> {
    if (this.isSesionIniciada()) {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${jwtToken}`
        });
        return this.httpClient.post<any>(`${this.base}/eliminarFavorito/${animeId}`, {}, { headers });
      }
    }
    return throwError('Token JWT no encontrado o sesión no iniciada');
  }


  addAnimeToList(animeId: number, endpoint: string): Observable<any> {
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
        return this.httpClient.post<any>(`${this.base}/${endpoint}/${animeId}`, {}, { headers });
      } else {
        // Manejar el caso de token faltante
        return throwError('Token JWT no encontrado');
      }
    } else {
      // Manejar el caso de sesión no iniciada
      return throwError('Sesión no iniciada');
    }
  }

  addFavoritos(animeId: number): Observable<any> {
    return this.addAnimeToList(animeId, 'agregarfavorito');
  }

  addPendientes(animeId: number): Observable<any> {
    return this.addAnimeToList(animeId, 'agregarpendiente');
  }

  addSiguiendo(animeId: number): Observable<any> {
    return this.addAnimeToList(animeId, 'agregarsiguiendo');
  }

  addCompleado(animeId: number): Observable<any> {
    return this.addAnimeToList(animeId, 'agregarcompleado');
  }

  addAbandonado(animeId: number): Observable<any> {
    return this.addAnimeToList(animeId, 'agregarabandonado');
  }

  bibliotecaUsuario(estadoId?: number): Observable<any> {
    let params = new HttpParams();
    if (estadoId !== undefined) {
      params = params.set('estado_id', estadoId.toString());
    }

    // Obtener el token JWT del almacenamiento local
    const jwtToken = localStorage.getItem('jwtToken');
    // Verificar si se encontró un token JWT
    if (!jwtToken) {
      return throwError('Token JWT no encontrado');
    }

    // Construir las cabeceras de la solicitud con el token JWT
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });

    return this.httpClient.get<any>(`${this.base}/biblioteca`, { params, headers }).pipe(
      catchError(error => {
        // Manejar errores de la solicitud HTTP
        return throwError(error);
      })
    );
  }



  // Función para verificar si la sesión está iniciada
  isSesionIniciada(): boolean {
    return !!localStorage.getItem('jwtToken');
  }


  //mostrar ultimos añadidos
  getultimos(): Observable<any> {
    const $anime = this.httpClient.get<Anime[]>(`${this.base}/ultimoscapitulos`);
    return $anime;

  }

  addCapituloAnime(idAnime: number, capituloData: any): Observable<any> {
    const $anime= this.httpClient.post<any>(`${this.base}/addcapituloanime/${idAnime}`, capituloData);
    return $anime;
  }

  deleteAnime(idAnime: number): Observable<any> {

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
        return this.httpClient.post<any>(`${this.base}/quitaranime/${idAnime}`, {}, { headers });
      } else {
        // Manejar el caso de token faltante
        return throwError('Token JWT no encontrado');
      }
    } else {
      // Manejar el caso de sesión no iniciada
      return throwError('Sesión no iniciada');
    }

   }
}
