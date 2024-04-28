import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AutenticacionService } from '../services/autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private autenticacionService: AutenticacionService, private router: Router) {}

  // Comprueba si el usuario tiene el rol ROLE_ADMIN
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.autenticacionService.getRoles().pipe(
      map(roles => {
        if (roles.includes('Administrador')) {
          return true; // Usuario tiene el rol ROLE_ADMIN, permitir el acceso
        } else {
          // Redirigir a una página no autorizada o mostrar un mensaje de error
          this.router.navigate(['/unauthorized']);
          return false;
        }
      })
    );
  }
}
