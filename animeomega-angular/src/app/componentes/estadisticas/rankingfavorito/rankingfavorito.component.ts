import {Component, input, OnInit, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {EstadisticasService} from "../../../service/estadisticas.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-rankingfavorito',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    MatInput,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatPaginator,
    MatSort
  ],
  templateUrl: './rankingfavorito.component.html',
  styleUrl: './rankingfavorito.component.css'
})
export class RankingfavoritoComponent implements OnInit{

  displayedColumns: string[] = ['nombre', 'total_favoritos'];
  dataSource!: MatTableDataSource<any>; // Agrega el signo de exclamación para indicar a TypeScript que la propiedad será inicializada más tarde
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private estadisticasService: EstadisticasService) { }

  ngOnInit(): void {
    this.estadisticasService.getFavoritosTotales().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }


}
