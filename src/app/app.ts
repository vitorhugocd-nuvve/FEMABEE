import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesafioCompleteTextoComponent } from "./challenges/complete-texto/complete-texto.component";
import { DesafioQuizComponent } from "./challenges/quiz/quiz.component";
import { MapComponent } from "./map/map.component";

@Component({
  selector: 'app-root',
  template: `
  <app-map />
  `,
  imports: [RouterOutlet, DesafioCompleteTextoComponent, DesafioQuizComponent, MapComponent],
})
export class App {
  protected readonly title = signal('client');
}
