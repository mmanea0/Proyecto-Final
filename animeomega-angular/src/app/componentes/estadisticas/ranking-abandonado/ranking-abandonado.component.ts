import {Component, OnInit} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {EstadisticasService} from "../../../service/estadisticas.service";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-ranking-abandonado',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatPaginator
  ],
  templateUrl: './ranking-abandonado.component.html',
  styleUrl: './ranking-abandonado.component.css'
})
export class RankingAbandonadoComponent implements OnInit{


  displayedColumns: string[] = ['nombre_original_sin_kanji', 'total_abandonados'];
  dataSource = new MatTableDataSource<any>();

  constructor(private estadisticasService: EstadisticasService) { }

  ngOnInit(): void {
    this.estadisticasService.getAbandonadosTotales().subscribe(data => {
      this.dataSource.data = data;
    });
  }

}
