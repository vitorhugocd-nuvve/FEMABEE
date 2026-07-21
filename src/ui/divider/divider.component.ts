import { Component, computed, input, numberAttribute } from '@angular/core';

export type BeeDividerDirection = 'horizontal' | 'vertical';

@Component({
  selector: 'bee-divider',
  standalone: true,
  host: {
    style: 'display: contents',
  },
  template: `
    <div
      [class]="classes()"
      [style]="styles()"
      role="separator"
      [attr.aria-orientation]="direction()"
    ></div>
  `,
})
export class BeeDividerComponent {
  /** Direção do divider */
  direction = input<BeeDividerDirection>('horizontal');

  /** Espessura da linha, em px (padrão: 1) */
  lines = input(1, { transform: numberAttribute });

  /** Espaçamento (margin) ao redor do divider, em px (padrão: 4) */
  lineSpacing = input(4, { transform: numberAttribute });

  protected readonly isHorizontal = computed(() => this.direction() === 'horizontal');

  protected readonly classes = computed(() =>
    this.isHorizontal()
      ? 'block w-full shrink-0 bg-current'
      : 'block h-full shrink-0 bg-current',
  );

  protected readonly styles = computed(() => {
    const thickness = `${this.lines()}px`;
    const spacing = `${this.lineSpacing()}px`;

    return this.isHorizontal()
      ? { height: thickness, margin: `${spacing} 0` }
      : { width: thickness, margin: `0 ${spacing}` };
  });
}