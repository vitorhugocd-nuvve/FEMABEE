import { Component, computed, inject, OnInit, signal, viewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { JogadorService } from "../core/jogador/jogador.service";
import { AbelhaSelecionadaService } from "../core/jogador/abelha-selecionada.service";
import { Abelha } from "../core/models/abelha/abelha";
import { AbelhaComponent } from "../../ui/abelha/abelha.component";
import { LoaderComponent } from "../../ui/loader/loader.component";
import { CenterComponent } from "../../ui/center/center.component";
import { TextComponent } from "../../ui/typography/text.component";
import { DescriptionComponent } from "../../ui/typography/description.component";
import { IconComponent } from "../../ui/icon/icon.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { DialogComponent } from "../../ui/dialog/dialog.component";
import { IndicatorComponent } from "../../ui/indicator/indicator.component";
import { Indication } from "../../ui/indicator/indication";
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
                <div class="relative">
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

                    @if (slot.abelha; as abelha) {
                        <button
                            type="button"
                            aria-label="Excluir abelha"
                            class="absolute -top-2 -right-2 h-8 w-8 flex items-center justify-center bg-red-600! border-2! border-red-800! shadow-border cursor-pointer hover:bg-red-700!"
                            (click)="onExcluirClick($event, abelha)"
                        >
                            <bee-icon icon="trash" [width]="16" />
                        </button>
                    }
                </div>
            }
        </div>
    }

    <app-criar-abelha
        [(open)]="dialogoAberto"
        [precisaCriarJogador]="!jogador()"
        (criada)="recarregar()"
    />

    <bee-dialog [(open)]="dialogoExclusaoAberto" title="Excluir Abelha" (closed)="abelhaParaExcluir.set(null)">
        @if (abelhaParaExcluir(); as abelha) {
            <div class="flex flex-col gap-4 p-4">
                <bee-description>
                    Isso vai apagar <strong>{{ abelha.nome }}</strong> permanentemente, junto com todo o progresso dessa run. Essa ação não pode ser desfeita.
                </bee-description>

                <bee-indicator class="w-full!" #indicadorExclusao />

                <div class="w-full flex flex-row justify-end gap-2">
                    <button bee-button type="button" (click)="cancelarExclusao()">
                        Cancelar
                    </button>
                    <button
                        bee-button
                        type="button"
                        class="bg-red-600! text-white! border-red-800! hover:bg-red-700!"
                        [disabled]="excluindo()"
                        (click)="confirmarExclusao(abelha)"
                    >
                        <bee-icon icon="trash" />
                        Excluir pra sempre
                    </button>
                </div>
            </div>
        }
    </bee-dialog>
    `,
    host: { class: 'block' },
    imports: [
        AbelhaComponent, LoaderComponent, CenterComponent, TextComponent, DescriptionComponent,
        IconComponent, ButtonComponent, DialogComponent, IndicatorComponent, CriarAbelhaComponent
    ]
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

    protected readonly dialogoExclusaoAberto = signal(false);
    protected readonly abelhaParaExcluir = signal<Abelha | null>(null);
    protected readonly excluindo = signal(false);
    private readonly indicadorExclusao = viewChild<IndicatorComponent>('indicadorExclusao');

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

    protected onExcluirClick(evento: Event, abelha: Abelha): void {
        evento.stopPropagation();
        this.abelhaParaExcluir.set(abelha);
        this.dialogoExclusaoAberto.set(true);
    }

    protected cancelarExclusao(): void {
        this.dialogoExclusaoAberto.set(false);
    }

    protected async confirmarExclusao(abelha: Abelha): Promise<void> {
        this.excluindo.set(true);
        try {
            await this.jogadorService.removerAbelha(abelha.id);
            this.dialogoExclusaoAberto.set(false);
        } catch (erro) {
            const mensagem = erro instanceof HttpErrorResponse
                ? (erro.error?.mensagem ?? 'Não foi possível excluir a abelha.')
                : 'Não foi possível excluir a abelha.';
            this.indicadorExclusao()?.show(new Indication({ title: 'Ops!', message: mensagem, severity: 'danger', ttlInMs: 4000 }));
        } finally {
            this.excluindo.set(false);
        }
    }
}
