import { Component} from '@angular/core';
import {GenerosComponent} from "../../../componentes/estadisticas/generos/generos.component";


@Component({
  selector: 'app-estadisticas',
  standalone: true,
  templateUrl: './estadisticas.component.html',
  imports: [
    GenerosComponent
  ],
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {
}
