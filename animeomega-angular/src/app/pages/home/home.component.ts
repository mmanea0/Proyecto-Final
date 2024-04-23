import { Component } from '@angular/core';
import {MenuComponent} from "../../shared/menu/menu.component";
import {BarraLateralComponent} from "../../shared/barra-lateral/barra-lateral.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MenuComponent,
    BarraLateralComponent,
    RouterOutlet
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
