import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesafioCompleteTextoComponent } from "./challenges/complete-texto/complete-texto.component";
import { DesafioQuizComponent } from "./challenges/quiz/quiz.component";
import { DesafioEncontreParesComponent } from "./challenges/encontre-pares/encontre-pares.component";
import { DesafioEncontreBugComponent } from "./challenges/encontre-bug/encontre-bug.component";
import { DesafioCompleteCodigoComponent } from "./challenges/complete-codigo/complete-codigo.component";
import { MapComponent } from "./map/map.component";

@Component({
  selector: 'app-root',
  template: `
  <app-map />
  `,
  imports: [RouterOutlet, DesafioCompleteTextoComponent, DesafioQuizComponent, DesafioEncontreParesComponent, DesafioEncontreBugComponent, DesafioCompleteCodigoComponent, MapComponent],
})
export class App {
  protected readonly title = signal('client');
}
