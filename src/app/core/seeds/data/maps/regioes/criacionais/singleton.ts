import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoDesafio } from "../../../../../models/desafios/tipo-desafio";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";
import { Recompensa } from "../../../../../models/recompensa/recompensa";
import { TipoRecompensa } from "../../../../../models/recompensa/tipo-recompensa";

export const REGIAO_SINGLETON = new Mapa({
    id: "singleton",
    nome: "Ilha do Singleton",
    tipo: TipoMapa.Regional,
    padrao: "Singleton",
    url: "maps/regioes/criacionais/singleton.gif",
    tamanhoEmPx: {
        x: 288,
        y: 352
    },
    acoes: [
        new AcaoDoMapa({
            id: "rs-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-criacional",
            posicaoEmPx: { x: 176 + 32 + 16, y: 256 + 6 },
            mostrarLabel: true
        }),

        // FASE 1 — 11:16
        new AcaoDoMapa({
            id: "rs-licao-001",
            titulo: "O que é o Singleton?",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-singleton-001",
            posicaoEmPx: { x: 176, y: 256 },
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 30 })]
        }),

        // FASE 2 — 8:16
        new AcaoDoMapa({
            id: "rs-quiz-001",
            titulo: "Quiz: o básico",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.PerguntasRespostas,
            desafioId: "quiz-singleton-001",
            posicaoEmPx: { x: 128, y: 256 },
            niveisDependentes: ["rs-licao-001"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 50 })]
        }),

        // FASE 3 — 8:13
        new AcaoDoMapa({
            id: "rs-complete-texto-001",
            titulo: "Complete o texto",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteTexto,
            desafioId: "ct-singleton-001",
            posicaoEmPx: { x: 128, y: 208 },
            niveisDependentes: ["rs-quiz-001"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 40 })]
        }),

        // FASE 4 — 8:11
        new AcaoDoMapa({
            id: "rs-encontre-bug-001",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-singleton-001",
            posicaoEmPx: { x: 128, y: 176 },
            niveisDependentes: ["rs-complete-texto-001"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 50 })]
        }),

        // FASE 5 (ALT) — 2:11 — ramal opcional a partir da FASE 4, destrava a LOJA ao lado
        new AcaoDoMapa({
            id: "rs-encontre-pares-001",
            titulo: "Encontre os pares",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontrePares,
            desafioId: "ep-singleton-001",
            posicaoEmPx: { x: 32, y: 176 },
            niveisDependentes: ["rs-encontre-bug-001"],
            recompensas: [
                new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 40 }),
            ]
        }),

        // LOJA — 2:8 (DEP: FASE 5 ALT)
        new AcaoDoMapa({
            id: "rs-loja-classico",
            titulo: "Guarda-Roupa Clássico",
            tipo: TipoAcao.Loja,
            lojaId: "singleton-loja-classico",
            posicaoEmPx: { x: 32, y: 128 },
            mostrarLabel: true,
            niveisDependentes: ["rs-encontre-pares-001"]
        }),

        // FASE 5 — 8:8 — continuação do fluxo principal a partir da FASE 4
        new AcaoDoMapa({
            id: "rs-licao-002",
            titulo: "A estrutura completa",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-singleton-002",
            posicaoEmPx: { x: 128, y: 128 },
            niveisDependentes: ["rs-encontre-bug-001"],
            recompensas: [
                new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 30 }),
                new Recompensa({ tipo: TipoRecompensa.Aparencia, aparenciaId: 2 }),
            ]
        }),

        // FASE 6 (ALT) — 5:8 — ramal opcional a partir da FASE 5
        new AcaoDoMapa({
            id: "rs-complete-codigo-001",
            titulo: "Complete o código",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteCodigo,
            desafioId: "cc-singleton-001",
            posicaoEmPx: { x: 80, y: 128 },
            niveisDependentes: ["rs-licao-002"],
            recompensas: [
                new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 60 }),
            ]
        }),

        // FASE 7 — 8:5
        new AcaoDoMapa({
            id: "rs-encontre-bug-002",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-singleton-002",
            posicaoEmPx: { x: 128, y: 80 },
            niveisDependentes: ["rs-licao-002"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 50 })]
        }),

        // FASE 8 — 11:5
        new AcaoDoMapa({
            id: "rs-licao-003",
            titulo: "Variações e quando (não) usar",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-singleton-003",
            posicaoEmPx: { x: 176, y: 80 },
            niveisDependentes: ["rs-encontre-bug-002"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 30 })]
        }),

        // LOJA — 14:5 (DEP: FASE 8) — bônus, não faz parte do fluxo principal
        new AcaoDoMapa({
            id: "rs-loja-vibrante",
            titulo: "Guarda-Roupa Vibrante",
            tipo: TipoAcao.Loja,
            lojaId: "singleton-loja-vibrante",
            posicaoEmPx: { x: 224, y: 80 },
            mostrarLabel: true,
            niveisDependentes: ["rs-licao-003"]
        }),

        // FASE 9 — 11:2 — final da região
        new AcaoDoMapa({
            id: "rs-quiz-002",
            titulo: "Quiz final",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.PerguntasRespostas,
            desafioId: "quiz-singleton-002",
            posicaoEmPx: { x: 176, y: 32 },
            niveisDependentes: ["rs-licao-003"],
            recompensas: [
                new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 100 }),
                new Recompensa({ tipo: TipoRecompensa.PassagemRegional }),
                new Recompensa({ tipo: TipoRecompensa.PassagemContinental }),
            ]
        }),
    ]
});
