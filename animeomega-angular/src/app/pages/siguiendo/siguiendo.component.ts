import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../../shared/menu/menu.component";
import {BarraLateralComponent} from "../../shared/barra-lateral/barra-lateral.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-siguiendo',
  standalone: true,
  imports: [
    MenuComponent,
    BarraLateralComponent,
    NgIf
  ],
  templateUrl: './siguiendo.component.html',
  styleUrl: './siguiendo.component.css'
})
export class SiguiendoComponent implements OnInit{

  isLoading = false;

  constructor() { }

  ngOnInit(): void {
    this.isLoading = true;
  }

}
