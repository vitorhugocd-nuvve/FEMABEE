import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesafioCompleteTextoComponent } from "./challenges/complete-texto/complete-texto.component";
import { DesafioQuizComponent } from "./challenges/quiz/quiz.component";
import { DesafioEncontreParesComponent } from "./challenges/encontre-pares/encontre-pares.component";
import { DesafioEncontreBugComponent } from "./challenges/encontre-bug/encontre-bug.component";
import { DesafioCompleteCodigoComponent } from "./challenges/complete-codigo/complete-codigo.component";
import { DesafioLicaoComponent } from "./challenges/licao/licao.component";
import { MapComponent } from "./map/map.component";
import { DesafioAtualService } from "./core/services/desafio-atual.service";
import { TipoDesafio } from "./core/models/desafios/tipo-desafio";

@Component({
  selector: 'app-root',
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
  `,
  imports: [RouterOutlet, DesafioCompleteTextoComponent, DesafioQuizComponent, DesafioEncontreParesComponent, DesafioEncontreBugComponent, DesafioCompleteCodigoComponent, DesafioLicaoComponent, MapComponent],
})
export class App {
  protected readonly title = signal('client');

  protected readonly desafioAtualService = inject(DesafioAtualService);
  protected readonly tipoDesafio = TipoDesafio;
}
