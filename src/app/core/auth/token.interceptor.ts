// src/app/core/auth/token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Solo agrega el token de autenticación para las solicitudes a la API
  if (req.url.startsWith(environment.apiUrl) && authService.token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.token}`
      }
    });
  }
  return next(req);
};