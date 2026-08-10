import { Component, inject, model } from "@angular/core";
import { DialogComponent } from "../../../../ui/dialog/dialog.component";
import { AbelhaComponent } from "../../../../ui/abelha/abelha.component";
import { DescriptionComponent } from "../../../../ui/typography/description.component";
import { TipoAparencia } from "../../../core/models/aparencia/tipo-aparencia";
import { TamanhoAbelha } from "../../../core/models/aparencia/tamanhos";
import { TITULO_TAMANHO_ABELHA } from "../../../core/constants/aparencia";
import { AparenciaEquipadaService } from "../../../core/progresso/aparencia-equipada.service";
import { ClothSelectorComponent } from "./cloth-selector.component";

/** Todos os tipos de aparência existem como slot no guarda-roupa, mesmo os que ainda não têm nenhum item cadastrado. */
const TODOS_TIPOS_APARENCIA = Object.values(TipoAparencia);
const TODOS_TAMANHOS_ABELHA = Object.values(TamanhoAbelha);

@Component({
    selector: 'app-guarda-roupa',
    template: `
    <bee-dialog [(open)]="open" title="Guarda-Roupa">
        <div class="flex flex-col md:flex-row w-full">
            <!-- Painel esquerdo: prévia da abelha equipada -->
            <div class="relative shrink-0 w-full h-56 md:h-auto md:w-72 inside-border bg-[#111] overflow-hidden flex items-center justify-center">
                <img src="/wardrobe/luz.gif" class="absolute inset-0 m-auto w-62 h-62 object-contain pointer-events-none" alt="">
                <div class="relative mt-10">
                    <bee-abelha [tamanho]="tamanhoAtual()" [aparencias]="equipadas()" [scale]="3.5" />
                </div>
            </div>

            <!-- Painel direito: tamanho da abelha em grid + um seletor por tipo de aparência -->
            <div class="min-w-0 flex-1 flex flex-col gap-4 p-4 overflow-y-auto max-h-[70dvh]">
                <div class="grid grid-cols-2 gap-2">
                    @for (tamanho of tamanhos; track tamanho) {
                        <button
                            type="button"
                            (click)="selecionarTamanho(tamanho)"
                            class="shadow-border border-2 bg-neutral-300 p-1.5 flex flex-col items-center gap-1 cursor-pointer"
                            [class.bg-primary!]="tamanho === tamanhoAtual()"
                        >
                            <bee-abelha [tamanho]="tamanho" [aparencias]="equipadas()" [scale]="1.3" />
                            <bee-description class="text-center! truncate w-full">{{ tituloTamanhoAbelha[tamanho] }}</bee-description>
                        </button>
                    }
                </div>

                @for (tipo of tipos; track tipo) {
                    <app-cloth-selector [tipo]="tipo" />
                }
            </div>
        </div>
    </bee-dialog>
    `,
    imports: [DialogComponent, AbelhaComponent, DescriptionComponent, ClothSelectorComponent]
})
export class GuardaRoupaComponent {
    private readonly aparenciaEquipadaService = inject(AparenciaEquipadaService);

    readonly open = model.required<boolean>();

    protected readonly tipos = TODOS_TIPOS_APARENCIA;
    protected readonly tamanhos = TODOS_TAMANHOS_ABELHA;
    protected readonly tituloTamanhoAbelha = TITULO_TAMANHO_ABELHA;
    protected readonly equipadas = this.aparenciaEquipadaService.equipadas;
    protected readonly tamanhoAtual = this.aparenciaEquipadaService.tamanho;

    protected selecionarTamanho(tamanho: TamanhoAbelha): void {
        this.aparenciaEquipadaService.selecionarTamanho(tamanho);
    }
}
