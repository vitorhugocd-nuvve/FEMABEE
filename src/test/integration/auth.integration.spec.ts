import { HttpErrorResponse } from "@angular/common/http";
import { provideHttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthService } from "../../app/core/auth/auth.service";

function sufixoUnico(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

const SENHA_VALIDA = 'SenhaForte#123';

describe('AuthService (integração real com o backend em ../new-back)', () => {
    let authService: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient()],
        });
        authService = TestBed.inject(AuthService);
    });

    it('cadastra um usuário novo com sucesso', async () => {
        const sufixo = sufixoUnico();
        await expect(
            authService.cadastrar({
                nomeDeUsuario: `teste_${sufixo}`,
                email: `teste-${sufixo}@femabee.test`,
                senha: SENHA_VALIDA,
            }),
        ).resolves.toBeUndefined();
    });

    it('rejeita cadastro com email duplicado', async () => {
        const sufixo = sufixoUnico();
        const payload = {
            nomeDeUsuario: `teste_${sufixo}`,
            email: `teste-${sufixo}@femabee.test`,
            senha: SENHA_VALIDA,
        };
        await authService.cadastrar(payload);

        await expect(authService.cadastrar(payload)).rejects.toMatchObject({
            status: 409,
        } satisfies Partial<HttpErrorResponse>);
    });

    it('loga com credenciais corretas e guarda o token', async () => {
        const sufixo = sufixoUnico();
        const email = `teste-${sufixo}@femabee.test`;
        await authService.cadastrar({ nomeDeUsuario: `teste_${sufixo}`, email, senha: SENHA_VALIDA });

        await authService.login({ email, senha: SENHA_VALIDA });

        expect(authService.token()).toBeTruthy();
        expect(authService.autenticado()).toBe(true);
    });

    it('rejeita login com senha errada', async () => {
        const sufixo = sufixoUnico();
        const email = `teste-${sufixo}@femabee.test`;
        await authService.cadastrar({ nomeDeUsuario: `teste_${sufixo}`, email, senha: SENHA_VALIDA });

        await expect(
            authService.login({ email, senha: 'SenhaErrada#999' }),
        ).rejects.toMatchObject({ status: 401 });
    });
});
