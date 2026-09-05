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
            posicaoEmPx: { x: 320, y: 197 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-command",
            titulo: "Command",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "command",
            posicaoEmPx: { x: 448, y: 341 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-interpreter",
            titulo: "Interpreter",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "interpreter",
            posicaoEmPx: { x: 448, y: 533 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-iterator",
            titulo: "Iterator",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "iterator",
            posicaoEmPx: { x: 368, y: 549 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-mediator",
            titulo: "Mediator",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "mediator",
            posicaoEmPx: { x: 336, y: 421 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-memento",
            titulo: "Memento",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "memento",
            posicaoEmPx: { x: 272, y: 309 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-observer",
            titulo: "Observer",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "observer",
            posicaoEmPx: { x: 240, y: 149 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-state",
            titulo: "Signal",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "state",
            posicaoEmPx: { x: 368, y: 293 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-strategy",
            titulo: "Strategy",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "strategy",
            posicaoEmPx: { x: 128, y: 101 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-template-method",
            titulo: "Template Method",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "template-method",
            posicaoEmPx: { x: 416, y: 437 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "cco-onibus-reg-visitor",
            titulo: "Visitor",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "visitor",
            posicaoEmPx: { x: 192, y: 229 },
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
