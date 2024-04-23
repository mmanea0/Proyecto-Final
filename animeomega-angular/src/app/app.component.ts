import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthDiscordService} from "./service/auth-discord.service";
import {MenuComponent} from "./shared/menu/menu.component";
import {LoginComponent} from "./shared/login/login.component";
import {BarraLateralComponent} from "./shared/barra-lateral/barra-lateral.component";
import {HomeComponent} from "./pages/home/home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, LoginComponent, BarraLateralComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'animeomega-angular';


  constructor(
   private authDiscordService: AuthDiscordService,
  ) {

  }

  login() {
    this.authDiscordService.iniciosesiondiscord().subscribe(response => {
      console.log(response);
    },
      error => {
        console.log(error);
      }
    );
  }

  muestrausuario() {

    this.authDiscordService.muestrausuario().subscribe(response => {
      console.log(response);
    });
  }
}
