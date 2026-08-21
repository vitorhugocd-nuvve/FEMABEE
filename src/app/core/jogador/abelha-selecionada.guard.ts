import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AbelhaSelecionadaService } from "./abelha-selecionada.service";

export const abelhaSelecionadaGuard: CanActivateFn = () => {
    const abelhaSelecionadaService = inject(AbelhaSelecionadaService);
    const router = inject(Router);

    if (abelhaSelecionadaService.abelha()) return true;

    router.navigateByUrl('/abelhas');
    return false;
};
