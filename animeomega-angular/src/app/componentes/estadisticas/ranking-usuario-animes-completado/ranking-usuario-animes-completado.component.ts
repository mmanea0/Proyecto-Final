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
  selector: 'app-ranking-usuario-animes-completado',
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
  templateUrl: './ranking-usuario-animes-completado.component.html',
  styleUrl: './ranking-usuario-animes-completado.component.css'
})
export class RankingUsuarioAnimesCompletadoComponent implements OnInit{
  displayedColumns: string[] = ['usuario', 'total_vistos'];
  dataSource!: MatTableDataSource<any>; // Agrega el signo de exclamación para indicar a TypeScript que la propiedad será inicializada más tarde
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private estadisticasService: EstadisticasService) { }

  ngOnInit(): void {
    this.estadisticasService.getUsuarioquemasanimeacompletado().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }
}
