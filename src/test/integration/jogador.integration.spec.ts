import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthService } from "../../app/core/auth/auth.service";
import { authInterceptor } from "../../app/core/auth/auth.interceptor";
import { JogadorService } from "../../app/core/jogador/jogador.service";
import { TamanhoAbelha } from "../../app/core/models/aparencia/tamanhos";

function sufixoUnico(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

const SENHA_VALIDA = 'SenhaForte#123';

async function criarUsuarioAutenticado(authService: AuthService): Promise<void> {
    const sufixo = sufixoUnico();
    const email = `teste-${sufixo}@femabee.test`;
    await authService.cadastrar({ nomeDeUsuario: `teste_${sufixo}`, email, senha: SENHA_VALIDA });
    await authService.login({ email, senha: SENHA_VALIDA });
}

describe('JogadorService (integração real com o backend em ../new-back)', () => {
    let authService: AuthService;
    let jogadorService: JogadorService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(withInterceptors([authInterceptor]))],
        });
        authService = TestBed.inject(AuthService);
        jogadorService = TestBed.inject(JogadorService);
        await criarUsuarioAutenticado(authService);
    });

    it('retorna null quando o usuário ainda não tem jogador', async () => {
        const jogador = await jogadorService.buscarPerfil();
        expect(jogador).toBeNull();
    });

    it('cria o jogador junto com a primeira abelha', async () => {
        const jogador = await jogadorService.criarJogador({
            nome: 'Jogador Teste',
            abelha: { nome: 'Abelha 1', tamanho: TamanhoAbelha.AltaGorda, comidaFavorita: 'Mel' },
        });

        expect(jogador.abelhas).toHaveLength(1);
        expect(jogador.abelhas[0].nome).toBe('Abelha 1');
        expect(jogador.abelhas[0].comidaFavorita).toBe('Mel');
    });

    it('rejeita criar um segundo jogador pro mesmo usuário', async () => {
        await jogadorService.criarJogador({
            nome: 'Jogador Teste',
            abelha: { nome: 'Abelha 1', comidaFavorita: 'Mel' },
        });

        await expect(
            jogadorService.criarJogador({
                nome: 'Outro',
                abelha: { nome: 'Abelha X', comidaFavorita: 'Pólen' },
            }),
        ).rejects.toMatchObject({ status: 409 });
    });

    it('permite até 3 abelhas e rejeita a 4ª', async () => {
        await jogadorService.criarJogador({
            nome: 'Jogador Teste',
            abelha: { nome: 'Abelha 1', comidaFavorita: 'Mel' },
        });
        await jogadorService.criarAbelha({ nome: 'Abelha 2', comidaFavorita: 'Pólen' });
        await jogadorService.criarAbelha({ nome: 'Abelha 3', comidaFavorita: 'Néctar' });

        expect(jogadorService.jogador()?.abelhas).toHaveLength(3);

        await expect(jogadorService.criarAbelha({ nome: 'Abelha 4', comidaFavorita: 'Geleia real' })).rejects.toMatchObject({
            status: 400,
        });
    });

    it('permite excluir a última abelha do jogador', async () => {
        const jogador = await jogadorService.criarJogador({
            nome: 'Jogador Teste',
            abelha: { nome: 'Abelha Única', comidaFavorita: 'Mel' },
        });

        await jogadorService.removerAbelha(jogador.abelhas[0].id);

        expect(jogadorService.jogador()?.abelhas).toHaveLength(0);
    });
});
