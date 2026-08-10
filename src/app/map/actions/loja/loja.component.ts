import { Component, computed, inject, input, signal } from "@angular/core";
import { LargeComponent } from "../../../../ui/typography/large.component";
import { BeeDividerComponent } from "../../../../ui/divider/divider.component";
import { TextComponent } from "../../../../ui/typography/text.component";
import { DescriptionComponent } from "../../../../ui/typography/description.component";
import { AbelhaComponent } from "../../../../ui/abelha/abelha.component";
import { ButtonComponent } from "../../../../ui/button/button.component";
import { IconComponent } from "../../../../ui/icon/icon.component";
import { LojaRepositoryService } from "../../../core/seeds/repositories/loja-repository.service";
import { TipoAparencia } from "../../../core/models/aparencia/tipo-aparencia";
import { Aparencia } from "../../../core/models/aparencia/aparencia";
import { TamanhoAbelha } from "../../../core/models/aparencia/tamanhos";
import { estiloIconeAparencia, TITULO_TAMANHO_ABELHA, TITULO_TIPO_APARENCIA } from "../../../core/constants/aparencia";
import { AparenciaObtidaService } from "../../../core/progresso/aparencia-obtida.service";
import { SomService } from "../../../../services/som/som.service";

@Component({
    selector: 'app-loja-action',
    template: `
    @if (loja(); as loja) {
        @if (selecionado(); as item) {
            <!-- Step 2: detalhe do item selecionado -->
            <div class="w-full flex flex-row items-center gap-2">
                <button bee-button size="small" (click)="voltar()" aria-label="Voltar para a lista">
                    <bee-icon icon="arrow-left" />
                </button>
                <bee-large>{{ item.nome }}</bee-large>
            </div>
            <bee-divider direction="horizontal" />

            <div class="w-full flex flex-row items-start justify-around gap-2">
                @for (tamanho of tamanhosAbelha; track tamanho) {
                    <div class="flex flex-col items-center gap-1">
                        <bee-abelha [tamanho]="tamanho" [aparencias]="[item]" [scale]="2" />
                        <bee-description class="text-center!">{{ tituloTamanhoAbelha[tamanho] }}</bee-description>
                    </div>
                }
            </div>

            <bee-divider direction="horizontal" />
            <div class="w-full flex flex-row items-center justify-between">
                <div class="flex flex-row items-center gap-1">
                    <img src="/icons/dinheiro.png" class="tile-icon w-4! h-4!" alt="">
                    <bee-description>Compra: {{ item.precoCompra }}</bee-description>
                </div>
                @if (item.disponivelVenda) {
                    <div class="flex flex-row items-center gap-1">
                        <img src="/icons/dinheiro.png" class="tile-icon w-4! h-4!" alt="">
                        <bee-description>Venda: {{ item.precoVenda }}</bee-description>
                    </div>
                }
            </div>

            <bee-divider direction="horizontal" />
            <footer class="w-full flex flex-row-reverse">
                <button bee-button [disabled]="jaPossui(item)" (click)="comprar(item)">
                    @if (jaPossui(item)) {
                        <bee-icon icon="check-circle" />
                        Já possui
                    } @else {
                        <bee-icon icon="shopping-cart" />
                        Comprar
                    }
                </button>
            </footer>
        } @else {
            <!-- Step 1: lista de itens da loja -->
            <bee-large>{{ loja.nome }}</bee-large>
            <bee-divider direction="horizontal" />
            <bee-description>{{ loja.descricao }}</bee-description>

            @for (grupo of grupos(); track grupo.tipo) {
                <bee-divider direction="horizontal" />
                <bee-text class="font-bold!">{{ tituloTipoAparencia[grupo.tipo] }}</bee-text>
                <div class="w-full grid grid-cols-3 gap-2">
                    @for (aparencia of grupo.itens; track aparencia.id) {
                        <div
                            (click)="selecionar(aparencia)"
                            class="shadow-border border-2 bg-neutral-300 p-1.5 flex flex-col items-center gap-1 cursor-pointer"
                        >
                            <div [style]="estiloIconeAparencia(aparencia)" role="img" [attr.aria-label]="aparencia.nome"></div>
                            <bee-description class="text-center!">{{ aparencia.nome }}</bee-description>
                            <div class="w-full flex flex-row items-center justify-between">
                                <bee-description>Compra</bee-description>
                                <div class="flex flex-row items-center gap-1">
                                    <img src="/icons/dinheiro.png" class="tile-icon w-4! h-4!" alt="">
                                    <bee-description>{{ aparencia.precoCompra }}</bee-description>
                                </div>
                            </div>
                            @if (aparencia.disponivelVenda) {
                                <div class="w-full flex flex-row items-center justify-between">
                                    <bee-description>Venda</bee-description>
                                    <div class="flex flex-row items-center gap-1">
                                        <img src="/icons/dinheiro.png" class="tile-icon w-4! h-4!" alt="">
                                        <bee-description>{{ aparencia.precoVenda }}</bee-description>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>
            }
        }
    }
    `,
    host: {
        class: 'w-full flex flex-col gap-2'
    },
    imports: [LargeComponent, BeeDividerComponent, TextComponent, DescriptionComponent, AbelhaComponent, ButtonComponent, IconComponent]
})
export class LojaActionComponent {
    private readonly lojaRepositoryService = inject(LojaRepositoryService);
    private readonly aparenciaObtidaService = inject(AparenciaObtidaService);
    private readonly somService = inject(SomService);

    protected readonly tituloTipoAparencia = TITULO_TIPO_APARENCIA;
    protected readonly tituloTamanhoAbelha = TITULO_TAMANHO_ABELHA;
    protected readonly tamanhosAbelha = Object.values(TamanhoAbelha);
    protected readonly estiloIconeAparencia = estiloIconeAparencia;

    readonly lojaId = input.required<string>();

    protected readonly selecionado = signal<Aparencia | null>(null);

    protected selecionar(aparencia: Aparencia) {
        this.selecionado.set(aparencia);
    }

    protected voltar() {
        this.selecionado.set(null);
    }

    protected jaPossui(aparencia: Aparencia): boolean {
        return this.aparenciaObtidaService.possui(aparencia.id);
    }

    protected comprar(aparencia: Aparencia): void {
        if (this.jaPossui(aparencia)) return;
        this.aparenciaObtidaService.marcarObtida(aparencia.id);
        this.somService.sucesso();
    }

    protected readonly loja = computed(() => this.lojaRepositoryService.findById(this.lojaId()));

    protected readonly grupos = computed(() => {
        const loja = this.loja();
        if (!loja) return [];

        const porTipo = new Map<TipoAparencia, Aparencia[]>();
        for (const aparencia of loja.aparenciasDisponiveis) {
            const itens = porTipo.get(aparencia.tipo) ?? [];
            itens.push(aparencia);
            porTipo.set(aparencia.tipo, itens);
        }

        return Array.from(porTipo.entries()).map(([tipo, itens]) => ({ tipo, itens }));
    });
}
