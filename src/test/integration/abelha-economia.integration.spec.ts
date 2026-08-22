import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthService } from "../../app/core/auth/auth.service";
import { authInterceptor } from "../../app/core/auth/auth.interceptor";
import { JogadorService } from "../../app/core/jogador/jogador.service";
import { AbelhaSelecionadaService } from "../../app/core/jogador/abelha-selecionada.service";
import { AbelhaEconomiaService } from "../../app/core/jogador/abelha-economia.service";

function sufixoUnico(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

const SENHA_VALIDA = 'SenhaForte#123';

describe('AbelhaEconomiaService (integração real com o backend em ../new-back)', () => {
    let authService: AuthService;
    let jogadorService: JogadorService;
    let abelhaSelecionadaService: AbelhaSelecionadaService;
    let abelhaEconomiaService: AbelhaEconomiaService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(withInterceptors([authInterceptor]))],
        });
        authService = TestBed.inject(AuthService);
        jogadorService = TestBed.inject(JogadorService);
        abelhaSelecionadaService = TestBed.inject(AbelhaSelecionadaService);
        abelhaEconomiaService = TestBed.inject(AbelhaEconomiaService);

        const sufixo = sufixoUnico();
        const email = `teste-eco-${sufixo}@femabee.test`;
        await authService.cadastrar({ nomeDeUsuario: `teste_eco_${sufixo}`, email, senha: SENHA_VALIDA });
        await authService.login({ email, senha: SENHA_VALIDA });

        const jogador = await jogadorService.criarJogador({
            nome: 'Jogador Economia',
            comidaFavorita: 'Mel',
            abelha: { nome: 'Abelha Economia' },
        });
        abelhaSelecionadaService.selecionar(jogador.abelhas[0]);

        // AbelhaEconomiaService carrega via um effect() reagindo à abelha selecionada —
        // dá um tick pro efeito rodar e a chamada HTTP resolver antes de cada teste.
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('a abelha nasce com 500 de dinheiro e 1 passagem de cada tipo', () => {
        expect(abelhaEconomiaService.dinheiro()).toBe(500);
        expect(abelhaEconomiaService.ticketContinental()).toBe(1);
        expect(abelhaEconomiaService.ticketRegional()).toBe(1);
    });

    it('gasta dinheiro com sucesso e atualiza o saldo', async () => {
        const gastou = await abelhaEconomiaService.gastarDinheiro(200);

        expect(gastou).toBe(true);
        expect(abelhaEconomiaService.dinheiro()).toBe(300);
    });

    it('rejeita gastar mais dinheiro do que a abelha tem', async () => {
        const gastou = await abelhaEconomiaService.gastarDinheiro(1000);

        expect(gastou).toBe(false);
        expect(abelhaEconomiaService.dinheiro()).toBe(500);
    });

    it('gasta a passagem continental e depois rejeita gastar de novo', async () => {
        const primeiraVez = await abelhaEconomiaService.gastarPassagemContinental();
        const segundaVez = await abelhaEconomiaService.gastarPassagemContinental();

        expect(primeiraVez).toBe(true);
        expect(segundaVez).toBe(false);
        expect(abelhaEconomiaService.ticketContinental()).toBe(0);
    });

    it('gasta a passagem regional e depois rejeita gastar de novo', async () => {
        const primeiraVez = await abelhaEconomiaService.gastarPassagemRegional();
        const segundaVez = await abelhaEconomiaService.gastarPassagemRegional();

        expect(primeiraVez).toBe(true);
        expect(segundaVez).toBe(false);
        expect(abelhaEconomiaService.ticketRegional()).toBe(0);
    });
});
