import { Component, computed, inject } from "@angular/core";
import { TextComponent } from "../../../ui/typography/text.component";
import { DescriptionComponent } from "../../../ui/typography/description.component";
import { MapaAtualService } from "../services/mapa-atual.service";
import { TipoMapa } from "../../core/models/map/tipo-mapa";
import { ProgressoMapaService } from "../../core/progresso/progresso-mapa.service";

const ROTULO_TIPO_MAPA: Record<TipoMapa, string> = {
    [TipoMapa.Mundi]: "Mundi",
    [TipoMapa.Continental]: "Continental",
    [TipoMapa.Regional]: "Regional"
};

@Component({
    selector: 'app-localizacao-atual',
    template: `
    @if (mapa(); as mapa) {
        <bee-text class="text-white! font-black! [-webkit-text-stroke:1px_white]! leading-none">{{ mapa.nome }}</bee-text>
        <bee-description class="text-white!/80 leading-none">{{ rotuloTipoMapa[mapa.tipo] }}</bee-description>
        @if (progressoFases(); as progresso) {
            <bee-description class="text-white!/80 leading-none">{{ progresso.concluidas }}/{{ progresso.total }} fases</bee-description>
        }
    }
    `,
    host: { class: 'flex flex-col justify-center' },
    imports: [TextComponent, DescriptionComponent]
})
export class LocalizacaoAtualComponent {
    private readonly mapaAtualService = inject(MapaAtualService);
    private readonly progressoMapaService = inject(ProgressoMapaService);

    protected readonly rotuloTipoMapa = ROTULO_TIPO_MAPA;
    protected readonly mapa = this.mapaAtualService.mapa;

    protected readonly progressoFases = computed(() => {
        const mapa = this.mapa();
        return mapa ? this.progressoMapaService.progresso(mapa) : undefined;
    });
}
