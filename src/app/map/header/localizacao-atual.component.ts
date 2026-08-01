import { Component, inject } from "@angular/core";
import { TextComponent } from "../../../ui/typography/text.component";
import { DescriptionComponent } from "../../../ui/typography/description.component";
import { MapaAtualService } from "../services/mapa-atual.service";
import { TipoMapa } from "../../core/models/map/tipo-mapa";

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
    }
    `,
    host: { class: 'flex flex-col justify-center' },
    imports: [TextComponent, DescriptionComponent]
})
export class LocalizacaoAtualComponent {
    private readonly mapaAtualService = inject(MapaAtualService);

    protected readonly rotuloTipoMapa = ROTULO_TIPO_MAPA;
    protected readonly mapa = this.mapaAtualService.mapa;
}
