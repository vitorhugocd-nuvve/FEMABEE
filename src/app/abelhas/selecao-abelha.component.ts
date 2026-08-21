import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { JogadorService } from "../core/jogador/jogador.service";
import { AbelhaSelecionadaService } from "../core/jogador/abelha-selecionada.service";
import { Abelha } from "../core/models/abelha/abelha";
import { AbelhaComponent } from "../../ui/abelha/abelha.component";
import { LoaderComponent } from "../../ui/loader/loader.component";
import { CenterComponent } from "../../ui/center/center.component";
import { TextComponent } from "../../ui/typography/text.component";
import { TamanhoAbelha } from "../core/models/aparencia/tamanhos";
import { CriarAbelhaComponent } from "./criar-abelha.component";

type Slot = { posicao: 'esquerda' | 'centro' | 'direita'; abelha: Abelha | null };

const POSICOES: Slot['posicao'][] = ['esquerda', 'centro', 'direita'];

@Component({
    selector: 'app-selecao-abelha',
    template: `
    @if (carregando()) {
        <bee-center class="h-dvh w-dvw pattern-background">
            <bee-loader [width]="32" />
        </bee-center>
    } @else {
        <div class="w-dvw h-dvh flex flex-row items-center justify-center gap-8 pattern-background">
            @for (slot of slots(); track slot.posicao) {
                <button
                    type="button"
                    class="shadow-border border-2 bg-neutral-300 w-56 h-72 flex flex-col items-center justify-center gap-3 cursor-pointer"
                    [class.h-80]="slot.posicao === 'centro'"
                    (click)="onSlotClick(slot)"
                >
                    @if (slot.abelha; as abelha) {
                        <bee-abelha [tamanho]="abelha.tamanho ?? tamanhoPadrao" [scale]="3" />
                        <bee-text class="font-bold">{{ abelha.nome }}</bee-text>
                    } @else {
                        <span class="text-8xl font-bold text-neutral-500 leading-none">+</span>
                        <bee-text>Nova Abelha</bee-text>
                    }
                </button>
            }
        </div>
    }

    <app-criar-abelha
        [(open)]="dialogoAberto"
        [precisaCriarJogador]="!jogador()"
        (criada)="recarregar()"
    />
    `,
    host: { class: 'block' },
    imports: [AbelhaComponent, LoaderComponent, CenterComponent, TextComponent, CriarAbelhaComponent]
})
export class SelecaoAbelhaComponent implements OnInit {
    private readonly jogadorService = inject(JogadorService);
    private readonly abelhaSelecionadaService = inject(AbelhaSelecionadaService);
    private readonly router = inject(Router);

    protected readonly tamanhoPadrao = TamanhoAbelha.AltaGorda;
    protected readonly dialogoAberto = signal(false);
    private readonly carregouUmaVez = signal(false);

    protected readonly jogador = this.jogadorService.jogador;
    protected readonly carregando = computed(() => !this.carregouUmaVez() && this.jogadorService.solicitando());

    protected readonly slots = computed<Slot[]>(() => {
        const abelhas = this.jogador()?.abelhas ?? [];
        return POSICOES.map((posicao, indice) => ({ posicao, abelha: abelhas[indice] ?? null }));
    });

    async ngOnInit(): Promise<void> {
        await this.jogadorService.buscarPerfil();
        this.carregouUmaVez.set(true);
    }

    protected onSlotClick(slot: Slot): void {
        if (slot.abelha) {
            this.abelhaSelecionadaService.selecionar(slot.abelha);
            this.router.navigateByUrl('/');
            return;
        }

        this.dialogoAberto.set(true);
    }

    protected async recarregar(): Promise<void> {
        this.dialogoAberto.set(false);
        await this.jogadorService.buscarPerfil();
    }
}
