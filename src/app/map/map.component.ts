import { Component, inject } from "@angular/core";
import { BeeMapComponent, BeeMapActionComponent } from "../../ui/map";
import { MapaAtualService } from "./services/mapa-atual.service";
import { LoaderComponent } from "../../ui/loader/loader.component";
import { CenterComponent } from "../../ui/center/center.component";
import { TextComponent } from "../../ui/typography/text.component";
import { AcaoComponent } from "./actions/acao.component";
import { ConexoesNiveisComponent } from "./actions/conexoes-niveis.component";
import { MobileAcaoSelecionadaService, MobileAcaoSelecionadaComponent } from "./actions/mobile-acao-selecionada.component";
import { MapaHeaderComponent } from "./header/mapa-header.component";
import { MapaFooterComponent } from "./footer/mapa-footer.component";

@Component({
    selector: 'app-map',
    templateUrl: "./map.component.html",
    providers: [
        MapaAtualService,
        MobileAcaoSelecionadaService
    ],
    host: { class: 'w-dvw h-dvh' },
    imports: [BeeMapComponent, LoaderComponent, CenterComponent, TextComponent, AcaoComponent, ConexoesNiveisComponent, MobileAcaoSelecionadaComponent, MapaHeaderComponent, MapaFooterComponent]
})
export class MapComponent {
    private readonly mapaAtualService = inject(MapaAtualService);

    readonly mapa = this.mapaAtualService.mapa.asReadonly();
    readonly requesting = this.mapaAtualService.requesting.asReadonly();
}