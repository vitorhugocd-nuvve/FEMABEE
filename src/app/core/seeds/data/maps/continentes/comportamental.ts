import { AcaoDoMapa } from "../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../models/map/mapa";
import { TipoAcao } from "../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../models/map/tipo-mapa";
import { ID_MAPA_INICIAL } from "../mapa-mundi";

export const CONTINENTE_COMPORTAMENTAL = new Mapa({
    id: "continental-comportamental",
    nome: "Continente Comportamental",
    tipo: TipoMapa.Continental,
    padrao: "Comportamental",
    url: "maps/continentes/comportamental.gif",
    tamanhoEmPx: {
        x: 608,
        y: 672
    },
    acoes: [
        new AcaoDoMapa({
            id: "cco-onibus-reg-chain-of-responsibility",
            titulo: "Chain of Responsibility",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "chain-of-responsibility",
            posicaoEmPx: { x: 256, y: 128 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-command",
            titulo: "Command",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "command",
            posicaoEmPx: { x: 416, y: 128 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-interpreter",
            titulo: "Interpreter",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "interpreter",
            posicaoEmPx: { x: 560, y: 128 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-iterator",
            titulo: "Iterator",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "iterator",
            posicaoEmPx: { x: 96, y: 336 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-mediator",
            titulo: "Mediator",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "mediator",
            posicaoEmPx: { x: 256, y: 336 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-memento",
            titulo: "Memento",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "memento",
            posicaoEmPx: { x: 416, y: 336 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-observer",
            titulo: "Observer",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "observer",
            posicaoEmPx: { x: 560, y: 336 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-state",
            titulo: "State",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "state",
            posicaoEmPx: { x: 96, y: 544 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-strategy",
            titulo: "Strategy",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "strategy",
            posicaoEmPx: { x: 256, y: 544 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-template-method",
            titulo: "Template Method",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "template-method",
            posicaoEmPx: { x: 416, y: 544 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-visitor",
            titulo: "Visitor",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "visitor",
            posicaoEmPx: { x: 560, y: 544 },
            mostrarLabel: true
        }),

        new AcaoDoMapa({
            id: "cco-aviao-mundi",
            titulo: "Voltar",
            tipo: TipoAcao.Aviao,
            mapaDestinoId: ID_MAPA_INICIAL,
            posicaoEmPx: { x: 96, y: 128 },
            mostrarLabel: true
        })
    ]
});
