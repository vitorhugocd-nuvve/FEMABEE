import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoDesafio } from "../../../../../models/desafios/tipo-desafio";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";
import { Recompensa } from "../../../../../models/recompensa/recompensa";
import { TipoRecompensa } from "../../../../../models/recompensa/tipo-recompensa";

export const REGIAO_BRIDGE = new Mapa({
    id: "bridge",
    nome: "Ilha da Bridge",
    tipo: TipoMapa.Regional,
    padrao: "Bridge",
    url: "maps/regioes/estruturais/bridge.gif",
    tamanhoEmPx: {
        x: 448,
        y: 320
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

        // FASE 1 — 20:2
        new AcaoDoMapa({
            id: "rbr-licao-001",
            titulo: "O que é a Bridge?",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-bridge-001",
            posicaoEmPx: { x: 320, y: 32 },
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 30 })]
        }),

        // FASE 2 — 19:5 (DEP 1)
        new AcaoDoMapa({
            id: "rbr-quiz-001",
            titulo: "Quiz: o básico",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.PerguntasRespostas,
            desafioId: "quiz-bridge-001",
            posicaoEmPx: { x: 304, y: 80 },
            niveisDependentes: ["rbr-licao-001"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 50 })]
        }),

        // FASE 3 — 23:5 (DEP 2)
        new AcaoDoMapa({
            id: "rbr-complete-texto-001",
            titulo: "Complete o texto",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteTexto,
            desafioId: "ct-bridge-001",
            posicaoEmPx: { x: 368, y: 80 },
            niveisDependentes: ["rbr-quiz-001"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 40 })]
        }),

        // FASE 5 — 23:8 (DEP 3)
        new AcaoDoMapa({
            id: "rbr-encontre-bug-001",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-bridge-001",
            posicaoEmPx: { x: 368, y: 128 },
            niveisDependentes: ["rbr-complete-texto-001"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 50 })]
        }),

        // FASE 6 — 21:11 (DEP 5)
        new AcaoDoMapa({
            id: "rbr-encontre-pares-001",
            titulo: "Encontre os pares",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontrePares,
            desafioId: "ep-bridge-001",
            posicaoEmPx: { x: 336, y: 176 },
            niveisDependentes: ["rbr-encontre-bug-001"],
            recompensas: [
                new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 40 }),
                new Recompensa({ tipo: TipoRecompensa.PassagemRegional }),
            ]
        }),

        // LOJA — 20:13 (DEP 6)
        new AcaoDoMapa({
            id: "rbr-loja-rostos",
            titulo: "Galeria de Rostos",
            tipo: TipoAcao.Loja,
            lojaId: "bridge-loja-rostos",
            posicaoEmPx: { x: 320, y: 208 },
            mostrarLabel: true,
            niveisDependentes: ["rbr-encontre-pares-001"]
        }),

        // FASE 7 — 18:11 (DEP 6)
        new AcaoDoMapa({
            id: "rbr-licao-002",
            titulo: "A estrutura completa",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-bridge-002",
            posicaoEmPx: { x: 288, y: 176 },
            niveisDependentes: ["rbr-encontre-pares-001"],
            recompensas: [
                new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 30 }),
                new Recompensa({ tipo: TipoRecompensa.Aparencia, aparenciaId: 5 }),
            ]
        }),

        // FASE 4 — 18:8 (DEP 2, 7) — só destrava depois de completar o ramal 3→5→6→7 inteiro
        new AcaoDoMapa({
            id: "rbr-complete-codigo-001",
            titulo: "Complete o código",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteCodigo,
            desafioId: "cc-bridge-001",
            posicaoEmPx: { x: 288, y: 128 },
            niveisDependentes: ["rbr-quiz-001", "rbr-licao-002"],
            recompensas: [
                new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 60 }),
                new Recompensa({ tipo: TipoRecompensa.PassagemContinental }),
            ]
        }),

        // FASE 8 — 14:18 (DEP 4)
        new AcaoDoMapa({
            id: "rbr-encontre-bug-002",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-bridge-002",
            posicaoEmPx: { x: 224, y: 288 },
            niveisDependentes: ["rbr-complete-codigo-001"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 50 })]
        }),

        // FASE 9 — 11:6 (DEP 8)
        new AcaoDoMapa({
            id: "rbr-licao-003",
            titulo: "Variações e quando (não) usar",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-bridge-003",
            posicaoEmPx: { x: 176, y: 96 },
            niveisDependentes: ["rbr-encontre-bug-002"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 30 })]
        }),

        // FASE 10 — 11:3 (DEP 9) — final alternativo (ramal curto)
        new AcaoDoMapa({
            id: "rbr-quiz-003",
            titulo: "Quiz: aprofundando",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.PerguntasRespostas,
            desafioId: "quiz-bridge-003",
            posicaoEmPx: { x: 176, y: 48 },
            niveisDependentes: ["rbr-licao-003"],
            recompensas: [
                new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 100 }),
                new Recompensa({ tipo: TipoRecompensa.PassagemRegional }),
            ]
        }),

        // FASE 11 — 4:6 (DEP 9)
        new AcaoDoMapa({
            id: "rbr-complete-texto-002",
            titulo: "Complete o texto",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteTexto,
            desafioId: "ct-bridge-002",
            posicaoEmPx: { x: 64, y: 96 },
            niveisDependentes: ["rbr-licao-003"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 40 })]
        }),

        // LOJA — 3:8 (DEP 11)
        new AcaoDoMapa({
            id: "rbr-loja-oculos",
            titulo: "Ótica da Ponte",
            tipo: TipoAcao.Loja,
            lojaId: "bridge-loja-oculos",
            posicaoEmPx: { x: 48, y: 128 },
            mostrarLabel: true,
            niveisDependentes: ["rbr-complete-texto-002"]
        }),

        // FASE 12 — 4:3 (DEP 11) — final da região
        new AcaoDoMapa({
            id: "rbr-quiz-002",
            titulo: "Quiz final",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.PerguntasRespostas,
            desafioId: "quiz-bridge-002",
            posicaoEmPx: { x: 64, y: 48 },
            niveisDependentes: ["rbr-complete-texto-002"],
            recompensas: [
                new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 100 }),
                new Recompensa({ tipo: TipoRecompensa.PassagemRegional }),
            ]
        }),
    ]
});
