import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoDesafio } from "../../../../../models/desafios/tipo-desafio";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_BRIDGE = new Mapa({
    id: "bridge",
    nome: "Ilha da Bridge",
    tipo: TipoMapa.Regional,
    padrao: "Bridge",
    url: "maps/regioes/estruturais/bridge.gif",
    tamanhoEmPx: {
        x: 448,
        y: 256
    },
    acoes: [
        new AcaoDoMapa({
            id: "rbr-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-estrutural",
            posicaoEmPx: { x: 224, y: 128 },
            mostrarLabel: true
        }),

        new AcaoDoMapa({
            id: "rbr-licao-001",
            titulo: "O que é a Bridge?",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-bridge-001",
            posicaoEmPx: { x: 32, y: 32 }
        }),

        new AcaoDoMapa({
            id: "rbr-quiz-001",
            titulo: "Quiz: o básico",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.PerguntasRespostas,
            desafioId: "quiz-bridge-001",
            posicaoEmPx: { x: 64, y: 32 },
            niveisDependentes: ["rbr-licao-001"]
        }),

        new AcaoDoMapa({
            id: "rbr-complete-texto-001",
            titulo: "Complete o texto",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteTexto,
            desafioId: "ct-bridge-001",
            posicaoEmPx: { x: 96, y: 32 },
            niveisDependentes: ["rbr-quiz-001"]
        }),

        new AcaoDoMapa({
            id: "rbr-encontre-bug-001",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-bridge-001",
            posicaoEmPx: { x: 160, y: 64 },
            niveisDependentes: ["rbr-complete-texto-001"]
        }),

        new AcaoDoMapa({
            id: "rbr-encontre-pares-001",
            titulo: "Encontre os pares",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontrePares,
            desafioId: "ep-bridge-001",
            posicaoEmPx: { x: 256, y: 64 },
            niveisDependentes: ["rbr-encontre-bug-001"]
        }),

        new AcaoDoMapa({
            id: "rbr-licao-002",
            titulo: "A estrutura completa",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-bridge-002",
            posicaoEmPx: { x: 352, y: 96 },
            niveisDependentes: ["rbr-encontre-pares-001"]
        }),

        new AcaoDoMapa({
            id: "rbr-complete-codigo-001",
            titulo: "Complete o código",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteCodigo,
            desafioId: "cc-bridge-001",
            posicaoEmPx: { x: 384, y: 160 },
            niveisDependentes: ["rbr-licao-002"]
        }),

        new AcaoDoMapa({
            id: "rbr-encontre-bug-002",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-bridge-002",
            posicaoEmPx: { x: 320, y: 224 },
            niveisDependentes: ["rbr-complete-codigo-001"]
        }),

        new AcaoDoMapa({
            id: "rbr-licao-003",
            titulo: "Variações e quando (não) usar",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-bridge-003",
            posicaoEmPx: { x: 224, y: 224 },
            niveisDependentes: ["rbr-encontre-bug-002"]
        }),

        new AcaoDoMapa({
            id: "rbr-quiz-002",
            titulo: "Quiz final",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.PerguntasRespostas,
            desafioId: "quiz-bridge-002",
            posicaoEmPx: { x: 128, y: 224 },
            niveisDependentes: ["rbr-licao-003"]
        }),
    ]
});
