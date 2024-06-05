import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {combineLatest, map, Observable, of, switchMap, tap} from "rxjs";
import {AnimeService} from "../../service/anime.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { AsyncPipe } from "@angular/common";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-ver-capitulo',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink
],
  templateUrl: './ver-capitulo.component.html',
  styleUrl: './ver-capitulo.component.css'
})
export class VerCapituloComponent implements OnInit, OnDestroy{

  isLoading = false;
  ICONO_ANIME: SafeResourceUrl;
  ICONO_BOMBILLA: SafeResourceUrl;
  ICONO_ANTERIOR: SafeResourceUrl;
  ICONO_SIGUIENTE: SafeResourceUrl;
  private clickListener: (() => void) | null = null;
  filtroOscuroActivo = false;
  videoEnlaces: string[] = [];
  capituloAnteriorDisponible = false;
  capituloSiguienteDisponible = false;


  animeAndEnlaces$: Observable<{ anime: any, enlaces: any }> | undefined;
    constructor(
      private animeService: AnimeService,
      private route: ActivatedRoute,
      private router: Router,
      private sanitizer: DomSanitizer,
      private renderer: Renderer2,
    ) {

      this.ICONO_ANIME = this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-menu-2" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M4 6l16 0" />
  <path d="M4 12l16 0" />
  <path d="M4 18l16 0" />
</svg>`);
      this.ICONO_BOMBILLA = this.sanitizer.bypassSecurityTrustHtml(`
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_471_2)">
<path d="M5.5 22H7.33333M22 5.5V7.33333M36.6667 22H38.5M10.2667 10.2667L11.55 11.55M33.7333 10.2667L32.45 11.55" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.5007 29.334C14.9615 28.1796 13.8246 26.5703 13.2509 24.7339C12.6773 22.8974 12.696 20.9271 13.3044 19.1019C13.9128 17.2767 15.08 15.6892 16.6408 14.5643C18.2016 13.4393 20.0767 12.834 22.0007 12.834C23.9246 12.834 25.7997 13.4393 27.3605 14.5643C28.9213 15.6892 30.0885 17.2767 30.6969 19.1019C31.3053 20.9271 31.324 22.8974 30.7504 24.7339C30.1767 26.5703 29.0398 28.1796 27.5007 29.334C26.7849 30.0425 26.2459 30.9096 25.9274 31.8651C25.6089 32.8206 25.5198 33.8377 25.6673 34.834C25.6673 35.8064 25.281 36.7391 24.5934 37.4267C23.9057 38.1143 22.9731 38.5007 22.0007 38.5007C21.0282 38.5007 20.0956 38.1143 19.4079 37.4267C18.7203 36.7391 18.334 35.8064 18.334 34.834C18.4815 33.8377 18.3924 32.8206 18.0739 31.8651C17.7554 30.9096 17.2164 30.0425 16.5007 29.334Z" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.7832 31.166H26.2165" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_471_2">
<rect width="44" height="44" fill="white"/>
</clipPath>
</defs>
</svg>
      `);

      this.ICONO_ANTERIOR = this.sanitizer.bypassSecurityTrustHtml(`
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_463_110)">
<path d="M22.0004 27.4991V34.0734C22.0003 34.4359 21.8927 34.7903 21.6913 35.0917C21.4898 35.3932 21.2035 35.6281 20.8686 35.7668C20.5336 35.9055 20.1651 35.9419 19.8095 35.8711C19.4539 35.8004 19.1273 35.6259 18.8709 35.3696L6.79654 23.2952C6.45284 22.9514 6.25977 22.4852 6.25977 21.9991C6.25977 21.5129 6.45284 21.0467 6.79654 20.7029L18.8709 8.62857C19.1273 8.37226 19.4539 8.19771 19.8095 8.127C20.1651 8.0563 20.5336 8.0926 20.8686 8.23133C21.2035 8.37006 21.4898 8.60498 21.6913 8.9064C21.8927 9.20782 22.0003 9.5622 22.0004 9.92474V16.4991H33.0004V27.4991H22.0004Z" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M38.5 27.5V16.5" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_463_110">
<rect width="44" height="44" fill="white"/>
</clipPath>
</defs>
</svg>
      `);

      this.ICONO_SIGUIENTE = this.sanitizer.bypassSecurityTrustHtml(`
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_463_114)">
<path d="M22 16.4991V9.92474C22.0001 9.5622 22.1076 9.20782 22.3091 8.9064C22.5106 8.60498 22.7969 8.37006 23.1318 8.23133C23.4668 8.0926 23.8353 8.0563 24.1909 8.127C24.5465 8.19771 24.8731 8.37226 25.1295 8.62857L37.2038 20.7029C37.5475 21.0467 37.7406 21.5129 37.7406 21.9991C37.7406 22.4852 37.5475 22.9514 37.2038 23.2952L25.1295 35.3696C24.8731 35.6259 24.5465 35.8004 24.1909 35.8711C23.8353 35.9419 23.4668 35.9055 23.1318 35.7668C22.7969 35.6281 22.5106 35.3932 22.3091 35.0917C22.1076 34.7903 22.0001 34.4359 22 34.0734V27.4991H11V16.4991H22Z" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.5 16.5V27.5" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_463_114">
<rect width="44" height="44" fill="white"/>
</clipPath>
</defs>
</svg>
      `);


    }

  ngOnInit(): void {
    this.cargarCapitulo();
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
  }


  aplicarFiltroOscuro(event: MouseEvent): void {
    event.stopPropagation();

    this.filtroOscuroActivo = true;

    // Añadir listener global para detectar clics fuera del iframe
    this.clickListener = this.renderer.listen('document', 'click', (clickEvent) => {
      const targetElement = clickEvent.target as HTMLElement;
      if (!targetElement.closest('.video-container')) {
        this.eliminarFiltroOscuro();
      }
    });
  }

  eliminarFiltroOscuro(): void {
    this.filtroOscuroActivo = false;
    if (this.clickListener) {
      this.clickListener();
      this.clickListener = null;
    }
  }

  cargarCapitulo(): void {
    this.animeAndEnlaces$ = this.route.params.pipe(
      switchMap(params => {
        const animeId = params['animeId'];
        const capituloId = params['capituloId'];
        return combineLatest([
          this.animeService.getAnimePorId(animeId),
          this.animeService.getEnlacesCapitulo(animeId, capituloId)
        ]).pipe(
          tap(() => {
            this.isLoading = false;
          }),
          tap(([anime, enlaces]) => {
            const capituloAnteriorId = parseInt(capituloId) - 1;
            this.capituloAnteriorDisponible = capituloAnteriorId >= 1;
          })
        );
      }),
      map(([anime, enlaces]) => ({ anime, enlaces }))
    );
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  verAnime(animeId: number): void {
    this.router.navigate(['/anime', animeId]);
  }

  volverAlCapituloanterior(): void {
    // Obtener los parámetros de la ruta actual
    const currentAnimeId = this.route.snapshot.params['animeId'];
    const currentCapituloId = this.route.snapshot.params['capituloId'];

    // Calcular el ID del capítulo anterior (por ejemplo, decrementar en 1)
    const capituloAnteriorId = parseInt(currentCapituloId) - 1;

    // Construir la ruta del capítulo anterior
    const rutaCapituloAnterior = `/anime/${currentAnimeId}/capitulo/${capituloAnteriorId}`;

    // Navegar a la ruta del capítulo anterior solo si hay un capítulo anterior
    if (capituloAnteriorId >= 1) {
      this.router.navigate([rutaCapituloAnterior]);
    } else {
      // Lógica adicional si no hay capítulos anteriores
      // Por ejemplo, mostrar un mensaje o deshabilitar el botón
    }
  }

  verCapituloSiguiente(): void {
    // Obtener los parámetros de la ruta actual
    const currentAnimeId = this.route.snapshot.params['animeId'];
    const currentCapituloId = this.route.snapshot.params['capituloId'];

    // Calcular el ID del capítulo siguiente (por ejemplo, incrementar en 1)
    const capituloSiguienteId = parseInt(currentCapituloId) + 1;

    // Construir la ruta del capítulo siguiente
    const rutaCapituloSiguiente = `/anime/${currentAnimeId}/capitulo/${capituloSiguienteId}`;

    // Navegar a la ruta del capítulo siguiente
    this.router.navigate([rutaCapituloSiguiente]);
  }
}


