import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AutenticacionService } from '../services/autenticacion.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const autenticacionService = inject(AutenticacionService);
  const router = inject(Router);

  const isAuthenticated = autenticacionService.isSesionIniciada();
  if (isAuthenticated) {
    return true; // Usuario está autenticado, permitir el acceso
  } else {
    router.navigate(['/unauthorized']); // Redirigir a la página de login si no está autenticado
    return false;
  }
};
