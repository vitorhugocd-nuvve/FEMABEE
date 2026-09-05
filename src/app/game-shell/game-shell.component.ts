import { Component, effect, inject, viewChild } from "@angular/core";
import { DesafioCompleteTextoComponent } from "../challenges/complete-texto/complete-texto.component";
import { DesafioQuizComponent } from "../challenges/quiz/quiz.component";
import { DesafioEncontreParesComponent } from "../challenges/encontre-pares/encontre-pares.component";
import { DesafioEncontreBugComponent } from "../challenges/encontre-bug/encontre-bug.component";
import { DesafioCompleteCodigoComponent } from "../challenges/complete-codigo/complete-codigo.component";
import { DesafioLicaoComponent } from "../challenges/licao/licao.component";
import { MapComponent } from "../map/map.component";
import { DesafioAtualService } from "../core/services/desafio-atual.service";
import { TipoDesafio } from "../core/models/desafios/tipo-desafio";
import { ConquistaProgressoService } from "../core/services/conquista-progresso.service";
import { ConquistaService } from "../core/services/conquista.service";
import { RecompensaService } from "../core/services/recompensa.service";
import { DialogoGatilhoService } from "../core/services/dialogo-gatilho.service";
import { MusicaAmbienteService } from "../core/services/musica-ambiente.service";
import { DialogoComponent } from "../dialogo/dialogo.component";
import { IndicatorComponent } from "../../ui/indicator/indicator.component";

@Component({
  selector: 'app-game-shell',
  template: `
  <app-map />
  @if (desafioAtualService.tipoAtivo(); as tipo) {
    <div class="fixed inset-0 z-50">
      @switch (tipo) {
        @case (tipoDesafio.PerguntasRespostas) { <app-desafio-quiz /> }
        @case (tipoDesafio.EncontreBug) { <app-desafio-encontre-bug /> }
        @case (tipoDesafio.CompleteTexto) { <app-desafio-complete-texto /> }
        @case (tipoDesafio.CompleteCodigo) { <app-desafio-complete-codigo /> }
        @case (tipoDesafio.EncontrePares) { <app-desafio-encontre-pares /> }
        @case (tipoDesafio.Licao) { <app-desafio-licao /> }
      }
    </div>
  }
  <app-dialogo />
  <bee-indicator #recompensaIndicator />
  <bee-indicator #conquistaIndicator />
  `,
  imports: [DesafioCompleteTextoComponent, DesafioQuizComponent, DesafioEncontreParesComponent, DesafioEncontreBugComponent, DesafioCompleteCodigoComponent, DesafioLicaoComponent, MapComponent, DialogoComponent, IndicatorComponent],
})
export class GameShellComponent {
  protected readonly desafioAtualService = inject(DesafioAtualService);
  protected readonly tipoDesafio = TipoDesafio;

  private readonly recompensaService = inject(RecompensaService);
  private readonly recompensaIndicator = viewChild<IndicatorComponent>('recompensaIndicator');

  private readonly conquistaService = inject(ConquistaService);
  private readonly conquistaIndicator = viewChild<IndicatorComponent>('conquistaIndicator');

  // Injetados só pra instanciar eagerly — os efeitos que observam conclusão de desafios,
  // reavaliam conquistas, disparam diálogos e tocam a trilha ambiente precisam começar
  // a rodar assim que o jogador entra na run. Antes rodavam desde o boot do App; agora
  // que existe login/seleção de abelha antes do jogo, o boot certo é aqui.
  private readonly conquistaProgressoService = inject(ConquistaProgressoService);
  private readonly dialogoGatilhoService = inject(DialogoGatilhoService);
  private readonly musicaAmbienteService = inject(MusicaAmbienteService);

  constructor() {
    console.log('[GAME-SHELL] instância CRIADA');
  }

  /** Um único bee-indicator, global, anuncia toda recompensa de fase — não faz sentido cada desafio ter o seu. */
  private readonly _anunciarRecompensa = effect(() => {
    const indicacao = this.recompensaService.pendente();
    console.log('[GAME-SHELL] efeito _anunciarRecompensa disparou, pendente()=', indicacao);
    if (indicacao) {
      this.recompensaIndicator()?.show(indicacao);
      this.recompensaService.consumirPendente();
    }
  });

  /** Indicator dedicado (não o de recompensa) pra não colidir quando as duas coincidem — ex.: completar a última fase de uma região concede recompensa E desbloqueia a conquista "Mestra do <padrão>" no mesmo instante. */
  private readonly _anunciarConquista = effect(() => {
    const indicacao = this.conquistaService.pendente();
    console.log('[GAME-SHELL] efeito _anunciarConquista disparou, pendente()=', indicacao);
    if (indicacao) {
      this.conquistaIndicator()?.show(indicacao);
      this.conquistaService.consumirPendente();
    }
  });
}
