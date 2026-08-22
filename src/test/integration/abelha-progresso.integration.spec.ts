import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthService } from "../../app/core/auth/auth.service";
import { authInterceptor } from "../../app/core/auth/auth.interceptor";
import { JogadorService } from "../../app/core/jogador/jogador.service";
import { AbelhaSelecionadaService } from "../../app/core/jogador/abelha-selecionada.service";
import { AbelhaProgressoService } from "../../app/core/progresso/abelha-progresso.service";
import { LocalizacaoAtualService } from "../../app/core/services/localizacao-atual.service";

function sufixoUnico(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

const SENHA_VALIDA = 'SenhaForte#123';
const MAPA_TESTE = 'mapa-teste-progresso';

async function aguardarEfeitos(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
}

describe('AbelhaProgressoService (integração real com o backend em ../new-back)', () => {
    let jogadorService: JogadorService;
    let abelhaSelecionadaService: AbelhaSelecionadaService;
    let abelhaProgressoService: AbelhaProgressoService;
    let localizacaoAtualService: LocalizacaoAtualService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(withInterceptors([authInterceptor]))],
        });
        const authService = TestBed.inject(AuthService);
        jogadorService = TestBed.inject(JogadorService);
        abelhaSelecionadaService = TestBed.inject(AbelhaSelecionadaService);
        abelhaProgressoService = TestBed.inject(AbelhaProgressoService);
        localizacaoAtualService = TestBed.inject(LocalizacaoAtualService);

        const sufixo = sufixoUnico();
        const email = `teste-prog-${sufixo}@femabee.test`;
        await authService.cadastrar({ nomeDeUsuario: `teste_prog_${sufixo}`, email, senha: SENHA_VALIDA });
        await authService.login({ email, senha: SENHA_VALIDA });

        const jogador = await jogadorService.criarJogador({
            nome: 'Jogador Progresso',
            comidaFavorita: 'Mel',
            abelha: { nome: 'Abelha Progresso' },
        });

        localizacaoAtualService.irPara(MAPA_TESTE);
        abelhaSelecionadaService.selecionar(jogador.abelhas[0]);
        await aguardarEfeitos();
    });

    it('nenhuma fase/aeroporto/ônibus está desbloqueado num mapa novo', () => {
        expect(abelhaProgressoService.estaFaseConcluida('fase-1')).toBe(false);
        expect(abelhaProgressoService.estaAeroportoDesbloqueado('aeroporto-1')).toBe(false);
        expect(abelhaProgressoService.estaOnibusDesbloqueado('onibus-1')).toBe(false);
    });

    it('marcar uma fase concluída reflete na hora (otimista) e persiste', async () => {
        abelhaProgressoService.marcarFaseConcluida('fase-1');

        expect(abelhaProgressoService.estaFaseConcluida('fase-1')).toBe(true);
        expect(abelhaProgressoService.ultimaFaseConcluida()).toBe('fase-1');

        await aguardarEfeitos();

        // Recarrega do zero (novo TestBed) pra confirmar que persistiu de verdade no backend.
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [provideHttpClient(withInterceptors([authInterceptor]))],
        });
        const novoAbelhaSelecionadaService = TestBed.inject(AbelhaSelecionadaService);
        const novoLocalizacaoAtualService = TestBed.inject(LocalizacaoAtualService);
        const novoAbelhaProgressoService = TestBed.inject(AbelhaProgressoService);

        novoLocalizacaoAtualService.irPara(MAPA_TESTE);
        novoAbelhaSelecionadaService.selecionar(abelhaSelecionadaService.abelha()!);
        await aguardarEfeitos();

        expect(novoAbelhaProgressoService.estaFaseConcluida('fase-1')).toBe(true);
    });

    it('desbloquear aeroporto e ônibus reflete localmente', () => {
        abelhaProgressoService.desbloquearAeroporto('aeroporto-1');
        abelhaProgressoService.desbloquearOnibus('onibus-1');

        expect(abelhaProgressoService.estaAeroportoDesbloqueado('aeroporto-1')).toBe(true);
        expect(abelhaProgressoService.estaOnibusDesbloqueado('onibus-1')).toBe(true);
    });

    it('marcar a mesma fase duas vezes não duplica o total global', () => {
        abelhaProgressoService.marcarFaseConcluida('fase-1');
        const totalDepoisDaPrimeira = abelhaProgressoService.totalFasesConcluidas();

        abelhaProgressoService.marcarFaseConcluida('fase-1');

        expect(abelhaProgressoService.totalFasesConcluidas()).toBe(totalDepoisDaPrimeira);
    });

    it('o total global de fases conta mapas diferentes juntos', async () => {
        abelhaProgressoService.marcarFaseConcluida('fase-1');
        expect(abelhaProgressoService.totalFasesConcluidas()).toBe(1);

        localizacaoAtualService.irPara(`${MAPA_TESTE}-2`);
        await aguardarEfeitos();

        abelhaProgressoService.marcarFaseConcluida('fase-2');
        expect(abelhaProgressoService.totalFasesConcluidas()).toBe(2);

        // Mudar de mapa não deve fazer a fase do mapa anterior "aparecer" no novo escopo.
        expect(abelhaProgressoService.estaFaseConcluida('fase-1')).toBe(false);
    });
});
