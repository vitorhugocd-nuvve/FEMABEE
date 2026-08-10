import { Component, DestroyRef, computed, effect, inject, signal } from "@angular/core";
import { DialogoAtualService } from "../core/services/dialogo-atual.service";
import { NpcRepositoryService } from "../core/seeds/repositories/npc-repository.service";
import { AbelhaComponent } from "../../ui/abelha/abelha.component";
import { TextComponent } from "../../ui/typography/text.component";
import { DescriptionComponent } from "../../ui/typography/description.component";
import { IconComponent } from "../../ui/icon/icon.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { SomService } from "../../services/som/som.service";

const VELOCIDADE_DIGITACAO_MS = 28;

@Component({
    selector: 'app-dialogo',
    template: `
    @if (dialogo(); as dialogo) {
        <div class="fixed inset-0 z-60 flex flex-col justify-end">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>

            <div class="relative flex flex-col items-center gap-2 p-4 pb-8 w-full">
                <div class="w-full max-w-lg flex flex-row justify-end">
                    <button bee-button size="small" (click)="fechar()" aria-label="Fechar diálogo">
                        <bee-icon icon="x" />
                    </button>
                </div>

                <div class="w-full max-w-lg flex flex-row items-end gap-3">
                    <div class="h-16 w-16 shrink-0 bg-amber-400 inside-border flex items-center justify-center">
                        @if (npc(); as npc) {
                            <bee-abelha [tamanho]="npc.tamanho" [aparencias]="npc.aparencias" [scale]="2" />
                        }
                    </div>

                    <div
                        (click)="avancar()"
                        class="shadow-border border-2 bg-neutral-100 p-3 flex-1 min-h-24 cursor-pointer flex flex-col justify-between gap-2">
                        <bee-text class="font-bold!">{{ npc()?.nome }}</bee-text>
                        <bee-text class="leading-relaxed flex-1">{{ textoVisivel() }}</bee-text>
                        @if (terminouDeDigitar()) {
                            <bee-description class="self-end animate-pulse">▼ toque para continuar</bee-description>
                        }
                    </div>
                </div>
            </div>
        </div>
    }
    `,
    imports: [AbelhaComponent, TextComponent, DescriptionComponent, IconComponent, ButtonComponent]
})
export class DialogoComponent {
    private readonly dialogoAtualService = inject(DialogoAtualService);
    private readonly npcRepositoryService = inject(NpcRepositoryService);
    private readonly somService = inject(SomService);

    protected readonly dialogo = this.dialogoAtualService.dialogoAtivo;

    protected readonly npc = computed(() => {
        const dialogo = this.dialogo();
        return dialogo ? this.npcRepositoryService.findById(dialogo.npcId) : undefined;
    });

    protected readonly indiceFala = signal(0);
    protected readonly caracteresVisiveis = signal(0);

    protected readonly falaAtual = computed(() => this.dialogo()?.falas.at(this.indiceFala()) ?? '');
    protected readonly textoVisivel = computed(() => this.falaAtual().slice(0, this.caracteresVisiveis()));
    protected readonly terminouDeDigitar = computed(() => this.caracteresVisiveis() >= this.falaAtual().length);

    private intervalId?: ReturnType<typeof setInterval>;

    constructor() {
        // Nova conversa: sempre começa da primeira fala.
        effect(() => {
            this.dialogo();
            this.indiceFala.set(0);
        });

        // Nova fala (troca de diálogo ou avanço de índice): reinicia a digitação.
        effect(() => {
            const fala = this.falaAtual();
            if (this.dialogo()) this.iniciarDigitacao(fala.length);
            else this.pararDigitacao();
        });

        inject(DestroyRef).onDestroy(() => this.pararDigitacao());
    }

    private iniciarDigitacao(tamanho: number): void {
        this.pararDigitacao();
        this.caracteresVisiveis.set(0);

        let contador = 0;
        this.intervalId = setInterval(() => {
            contador++;
            this.caracteresVisiveis.set(contador);
            if (contador % 2 === 0) this.somService.digitar();
            if (contador >= tamanho) this.pararDigitacao();
        }, VELOCIDADE_DIGITACAO_MS);
    }

    private pararDigitacao(): void {
        if (this.intervalId === undefined) return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    }

    protected avancar(): void {
        if (!this.terminouDeDigitar()) {
            // Toque durante a digitação: revela a fala inteira de uma vez.
            this.pararDigitacao();
            this.caracteresVisiveis.set(this.falaAtual().length);
            return;
        }

        const dialogo = this.dialogo();
        if (!dialogo) return;

        if (this.indiceFala() < dialogo.falas.length - 1) {
            this.indiceFala.update(indice => indice + 1);
        } else {
            this.dialogoAtualService.fechar();
        }
    }

    protected fechar(): void {
        this.dialogoAtualService.fechar();
    }
}
