import { Component} from '@angular/core';
import {GenerosComponent} from "../../../componentes/estadisticas/generos/generos.component";
import {RankingfavoritoComponent} from "../../../componentes/estadisticas/rankingfavorito/rankingfavorito.component";
import {
  RankingAbandonadoComponent
} from "../../../componentes/estadisticas/ranking-abandonado/ranking-abandonado.component";
import {
  RankingCompletadosComponent
} from "../../../componentes/estadisticas/ranking-completados/ranking-completados.component";
import {
  RankingUsuarioAnimesCompletadoComponent
} from "../../../componentes/estadisticas/ranking-usuario-animes-completado/ranking-usuario-animes-completado.component";


@Component({
  selector: 'app-estadisticas',
  standalone: true,
  templateUrl: './estadisticas.component.html',
  imports: [
    GenerosComponent,
    RankingfavoritoComponent,
    RankingAbandonadoComponent,
    RankingCompletadosComponent,
    RankingUsuarioAnimesCompletadoComponent
  ],
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {
}
