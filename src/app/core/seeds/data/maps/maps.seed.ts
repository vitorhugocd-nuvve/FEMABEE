import { AcaoDoMapa } from "../../../models/map/acao-do-mapa";
import { Mapa } from "../../../models/map/mapa";
import { TipoAcao } from "../../../models/map/tipo-acao";
import { TipoDesafio } from "../../../models/desafios/tipo-desafio";
import { TipoMapa } from "../../../models/map/tipo-mapa";
import { ID_MAPA_INICIAL, MAPA_MUNDI } from "./mapa-mundi";

import { CONTINENTE_CRIACIONAL } from "./continentes/criacaional";
// Só o Continente Criacional (com a Ilha do Singleton) está liberado nesta fase do jogo —
// os demais continentes ficam comentados (não removidos) até terem suas regiões implementadas.
// import { CONTINENTE_COMPORTAMENTAL } from "./continentes/comportamental";
// import { CONTINENTE_ESTRUTURAL } from "./continentes/estrutural";

// Só Singleton está liberado nesta fase do jogo — as demais regiões ficam comentadas
// (não removidas) até terem suas fases implementadas / voltarem a ficar disponíveis.
// import { REGIAO_FACTORY } from "./regioes/criacionais/factory";
// import { REGIAO_PROTOTYPE } from "./regioes/criacionais/prototype";
// import { REGIAO_BUILDER } from "./regioes/criacionais/builder";
import { REGIAO_SINGLETON } from "./regioes/criacionais/singleton";
// import { REGIAO_ABSTRACT_FACTORY } from "./regioes/criacionais/abstract-factory";

// import { REGIAO_CHAIN_OF_RESPONSIBILITY } from "./regioes/comportamentais/chain-of-responsibility";
// import { REGIAO_COMMAND } from "./regioes/comportamentais/command";
// import { REGIAO_INTERPRETER } from "./regioes/comportamentais/interpreter";
// import { REGIAO_ITERATOR } from "./regioes/comportamentais/iterator";
// import { REGIAO_MEDIATOR } from "./regioes/comportamentais/mediator";
// import { REGIAO_MEMENTO } from "./regioes/comportamentais/memento";
// import { REGIAO_OBSERVER } from "./regioes/comportamentais/observer";
// import { REGIAO_STATE } from "./regioes/comportamentais/state";
// import { REGIAO_STRATEGY } from "./regioes/comportamentais/strategy";
// import { REGIAO_TEMPLATE_METHOD } from "./regioes/comportamentais/template-method";
// import { REGIAO_VISITOR } from "./regioes/comportamentais/visitor";

// import { REGIAO_ADAPTER } from "./regioes/estruturais/adapter";
// import { REGIAO_BRIDGE } from "./regioes/estruturais/bridge";
// import { REGIAO_COMPOSITE } from "./regioes/estruturais/composite";
// import { REGIAO_DECORATOR } from "./regioes/estruturais/decorator";
// import { REGIAO_FACADE } from "./regioes/estruturais/facade";
// import { REGIAO_FLYWEIGHT } from "./regioes/estruturais/flyweight";
// import { REGIAO_PROXY } from "./regioes/estruturais/proxy";


export const MapsSeeds = [
    // Mundi: contém 1 aeroporto por continente.
    MAPA_MUNDI,

    // ── Continentes: N paradas de ônibus (1 por região) + 1 avião de volta ao Mundi. ──────────
    // Só o Criacional está liberado nesta fase — os demais ficam comentados acima (não removidos).
    CONTINENTE_CRIACIONAL,
    // CONTINENTE_COMPORTAMENTAL,
    // CONTINENTE_ESTRUTURAL,

    // ── Regiões Criacionais ────────────────────────────────────────────────────────────────
    // Só Singleton está liberado nesta fase — as demais regiões ficam comentadas acima
    // (não removidas) até terem suas fases implementadas.
    // REGIAO_FACTORY,
    // REGIAO_PROTOTYPE,
    // REGIAO_BUILDER,
    REGIAO_SINGLETON,
    // REGIAO_ABSTRACT_FACTORY,

    // ── Regiões Comportamentais (comentadas — só Singleton está liberado nesta fase) ──────────
    // REGIAO_CHAIN_OF_RESPONSIBILITY,
    // REGIAO_COMMAND,
    // REGIAO_INTERPRETER,
    // REGIAO_ITERATOR,
    // REGIAO_MEDIATOR,
    // REGIAO_MEMENTO,
    // REGIAO_OBSERVER,
    // REGIAO_STATE,
    // REGIAO_STRATEGY,
    // REGIAO_TEMPLATE_METHOD,
    // REGIAO_VISITOR,

    // ── Regiões Estruturais (comentadas — só Singleton está liberado nesta fase) ───────────────
    // REGIAO_ADAPTER,
    // REGIAO_BRIDGE,
    // REGIAO_COMPOSITE,
    // REGIAO_DECORATOR,
    // REGIAO_FACADE,
    // REGIAO_FLYWEIGHT,
    // REGIAO_PROXY,

    // Regional (Criacional): os desafios do padrão + 1 ônibus de volta ao Continental.
    new Mapa({
        id: "regional-criacional",
        nome: "Construction Zone Island",
        tipo: TipoMapa.Regional,
        padrao: "Criacional",
        url: "/maps/mapa1.webp",
        tamanhoEmPx: {
            x: 320,
            y: 320
        },
        acoes: [
            new AcaoDoMapa({
                id: "1",
                titulo: "Pattern 1",
                tipo: TipoAcao.Desafio,
                tipoDesafio: TipoDesafio.EncontreBug,
                desafioId: "eb-singleton-001",
                posicaoEmPx: { x: 28, y: 278 }
            }),

            new AcaoDoMapa({
                id: "2",
                titulo: "Pattern 2",
                tipo: TipoAcao.Desafio,
                tipoDesafio: TipoDesafio.PerguntasRespostas,
                desafioId: "quiz-singleton-001",
                posicaoEmPx: { x: 56, y: 245 }
            }),

            new AcaoDoMapa({
                id: "3",
                titulo: "Voltar ao Continental",
                tipo: TipoAcao.Onibus,
                mapaDestinoId: "continental-criacional",
                posicaoEmPx: { x: 90, y: 218 }
            }),

            new AcaoDoMapa({
                id: "4",
                titulo: "Pattern 3",
                tipo: TipoAcao.Desafio,
                tipoDesafio: TipoDesafio.CompleteTexto,
                desafioId: "ct-singleton-001",
                posicaoEmPx: { x: 125, y: 190 }
            }),

            new AcaoDoMapa({
                id: "5",
                titulo: "Pattern 4",
                tipo: TipoAcao.Desafio,
                tipoDesafio: TipoDesafio.CompleteCodigo,
                desafioId: "cc-padroes-001",
                posicaoEmPx: { x: 158, y: 164 }
            }),

            new AcaoDoMapa({
                id: "7",
                titulo: "Pattern 5",
                tipo: TipoAcao.Desafio,
                tipoDesafio: TipoDesafio.EncontrePares,
                desafioId: "ep-padroes-001",
                posicaoEmPx: { x: 228, y: 110 }
            }),

            new AcaoDoMapa({
                id: "8",
                titulo: "Lição",
                tipo: TipoAcao.Desafio,
                tipoDesafio: TipoDesafio.Licao,
                desafioId: "licao-singleton-001",
                posicaoEmPx: { x: 260, y: 76 }
            }),

            new AcaoDoMapa({
                id: "9",
                titulo: "Final Challenge",
                tipo: TipoAcao.Desafio,
                tipoDesafio: TipoDesafio.EncontreBug,
                desafioId: "eb-singleton-001",
                posicaoEmPx: { x: 286, y: 42 }
            }),

            new AcaoDoMapa({
                id: "10",
                titulo: "Loja",
                tipo: TipoAcao.Loja,
                posicaoEmPx: { x: 65, y: 270 },
                lojaId: "1"
            })
        ]
    })
];
