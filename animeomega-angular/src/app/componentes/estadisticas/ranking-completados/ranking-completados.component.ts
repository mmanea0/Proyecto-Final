import {Component, OnInit, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {EstadisticasService} from "../../../service/estadisticas.service";

@Component({
  selector: 'app-ranking-completados',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatTable,
    MatHeaderCellDef
  ],
  templateUrl: './ranking-completados.component.html',
  styleUrl: './ranking-completados.component.css'
})
export class RankingCompletadosComponent implements OnInit{


  displayedColumns: string[] = ['nombre_original_sin_kanji', 'total_completados'];
  dataSource = new MatTableDataSource<any>();

  constructor(private estadisticasService: EstadisticasService) { }

  ngOnInit(): void {
    this.estadisticasService.getCompletadosTotales().subscribe(data => {
      this.dataSource.data = data;
    });
  }
}
