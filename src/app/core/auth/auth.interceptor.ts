import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AuthService } from "./auth.service";

/** Anexa o Bearer token em toda chamada; em 401, desloga e manda pro login (token expirado/inválido). */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.token();
    const requisicaoAutenticada = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(requisicaoAutenticada).pipe(
        catchError((erro) => {
            if (erro.status === 401) {
                authService.logout();
                router.navigateByUrl('/login');
            }
            return throwError(() => erro);
        }),
    );
};
