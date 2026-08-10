import { AcaoDoMapa } from "../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../models/map/mapa";
import { TipoAcao } from "../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../models/map/tipo-mapa";
import { ID_MAPA_INICIAL } from "../mapa-mundi";

export const CONTINENTE_CRIACIONAL = new Mapa({
    id: "continental-criacional",
    nome: "Continente Criacional",
    tipo: TipoMapa.Continental,
    padrao: "Criacional",
    url: "maps/continentes/criacional.gif",
    tamanhoEmPx: {
        x: 320,
        y: 320
    },
    acoes: [
        new AcaoDoMapa({
            id: "cc-onibus-reg-factory",
            titulo: "Factory",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "factory",
            posicaoEmPx: { x: 208, y: 240 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cc-onibus-reg-singleton",
            titulo: "Singleton",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "singleton",
            posicaoEmPx: { x: 240, y: 128 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cc-onibus-reg-builder",
            titulo: "Builder",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "builder",
            posicaoEmPx: { x: 64, y: 176 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cc-onibus-reg-abstract-factory",
            titulo: "Abstract Factory",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "abstract-factory",
            posicaoEmPx: { x: 208, y: 64 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cc-onibus-reg-prototype",
            titulo: "Prototype",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "prototype",
            posicaoEmPx: { x: 128, y: 80 },
            mostrarLabel: true
        }),

        new AcaoDoMapa({
            id: "cc-aviao-mundi",
            titulo: "Voltar",
            tipo: TipoAcao.Aviao,
            mapaDestinoId: ID_MAPA_INICIAL,
            posicaoEmPx: { x: 160, y: 128 },
            mostrarLabel: true
        })
    ]
})