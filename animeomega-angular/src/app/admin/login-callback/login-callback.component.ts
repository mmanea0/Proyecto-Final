import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthDiscordService} from "../../service/auth-discord.service";


@Component({
  selector: 'app-login-callback',
  standalone: true,
  imports: [],
  templateUrl: './login-callback.component.html',
  styleUrl: './login-callback.component.css'
})
export class LoginCallbackComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private authService: AuthDiscordService,
    private router: Router

  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];

      if (accessToken) {
        this.authService.iniciarSesionExterna({ access_token: accessToken })
          .subscribe(success => {
            if (success) {
              console.log('Inicio de sesión externo exitoso');
              // Redirigir a la página de inicio y recargar
              this.router.navigate(['']).then(() => {
                window.location.reload();
              });
            } else {
              console.log('Inicio de sesión externo fallido');
              // Manejar error
              this.router.navigate(['']).then(() => {
                window.location.reload();
              });
            }
          });
      }
    });}}
