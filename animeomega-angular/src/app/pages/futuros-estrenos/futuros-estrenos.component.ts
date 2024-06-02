import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {AnimeService} from "../../service/anime.service";
import {FormsModule} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-futuros-estrenos',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './futuros-estrenos.component.html',
  styleUrl: './futuros-estrenos.component.css'
})
export class FuturosEstrenosComponent implements OnInit{
  animes: any[] = [];
  isLoading = false;
  selectedMes: string = '';
  ICONO_CAMPANA : SafeHtml;
  constructor(private animeService: AnimeService,
  private satizer : DomSanitizer
  ) {

    this.ICONO_CAMPANA = this.satizer.bypassSecurityTrustHtml(`
    <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_477_170)">
<path d="M28.334 14.1667C28.334 12.6638 28.931 11.2224 29.9937 10.1597C31.0564 9.09702 32.4978 8.5 34.0007 8.5C35.5035 8.5 36.9449 9.09702 38.0076 10.1597C39.0703 11.2224 39.6673 12.6638 39.6673 14.1667C42.9211 15.7052 45.695 18.1003 47.6915 21.095C49.688 24.0898 50.8319 27.5714 51.0007 31.1667V39.6667C51.2139 41.4282 51.8377 43.115 52.822 44.5914C53.8062 46.0677 55.1233 47.2923 56.6673 48.1667H11.334C12.878 47.2923 14.1951 46.0677 15.1793 44.5914C16.1636 43.115 16.7874 41.4282 17.0007 39.6667V31.1667C17.1694 27.5714 18.3133 24.0898 20.3098 21.095C22.3063 18.1003 25.0802 15.7052 28.334 14.1667Z" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M25.5 48.166V50.9993C25.5 53.2537 26.3955 55.4157 27.9896 57.0098C29.5837 58.6038 31.7457 59.4993 34 59.4993C36.2543 59.4993 38.4163 58.6038 40.0104 57.0098C41.6045 55.4157 42.5 53.2537 42.5 50.9993V48.166" stroke="white" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_477_170">
<rect width="68" height="68" fill="white"/>
</clipPath>
</defs>
</svg>`);
  }

  ngOnInit(): void {}

  onMesChange(event: any) {
    const mes = event.target.value;
    if (mes === '') {
      return;
    }
    this.isLoading = true;
    this.animeService.getFuturosestrenos(mes).subscribe(
      (animes) => {
        this.animes = animes;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar los animes', error);
        this.isLoading = false;
      }
    );
  }
}
