import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import { KeyValuePipe } from "@angular/common";
import {ApiAnimeService} from "../../../service/api-anime.service";
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ModaladdanimeComponent} from "../../../componentes/modaladdanime/modaladdanime.component";
import {TablaanimeComponent} from "../../../componentes/tablaanime/tablaanime.component";

@Component({
  selector: 'app-gestion-animes',
  standalone: true,
  imports: [
    FormsModule,
    KeyValuePipe,
    ModaladdanimeComponent,
    TablaanimeComponent
  ],
  templateUrl: './gestion-animes.component.html',
  styleUrl: './gestion-animes.component.css'
})
export class GestionAnimesComponent {




  constructor(


  ) {

  }

}
