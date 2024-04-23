import { Component } from '@angular/core';
import {MenuComponent} from "../../shared/menu/menu.component";
import {BarraLateralComponent} from "../../shared/barra-lateral/barra-lateral.component";

@Component({
  selector: 'app-siguiendo',
  standalone: true,
  imports: [
    MenuComponent,
    BarraLateralComponent
  ],
  templateUrl: './siguiendo.component.html',
  styleUrl: './siguiendo.component.css'
})
export class SiguiendoComponent {

}
