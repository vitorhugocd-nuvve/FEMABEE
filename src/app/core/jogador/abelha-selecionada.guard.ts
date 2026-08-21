import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AbelhaAtivaService } from "./abelha-ativa.service";

export const abelhaSelecionadaGuard: CanActivateFn = () => {
    const abelhaAtivaService = inject(AbelhaAtivaService);
    const router = inject(Router);

    if (abelhaAtivaService.abelhaAtivaId()) return true;

    router.navigateByUrl('/abelhas');
    return false;
};
