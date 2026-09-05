import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoDesafio } from "../../../../../models/desafios/tipo-desafio";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";
import { Recompensa } from "../../../../../models/recompensa/recompensa";
import { TipoRecompensa } from "../../../../../models/recompensa/tipo-recompensa";

export const REGIAO_OBSERVER = new Mapa({
    id: "observer",
    nome: "Ilha do Observer",
    tipo: TipoMapa.Regional,
    padrao: "Observer",
    url: "maps/regioes/comportamentais/OBSERVER.gif",
    tamanhoEmPx: {
        x: 384,
        y: 256
    },
    acoes: [
        new AcaoDoMapa({
            id: "rob-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-comportamental",
            posicaoEmPx: { x: 192 + 64, y: 128 + 64 + 5 },
            mostrarLabel: true
        }),

        new AcaoDoMapa({
            id: "rob-licao-001",
            titulo: "O que é o Observer?",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-observer-001",
            posicaoEmPx: { x: 64, y: 144 },
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 30 })]
        }),

        new AcaoDoMapa({
            id: "rob-quiz-001",
            titulo: "Quiz: o básico",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.PerguntasRespostas,
            desafioId: "quiz-observer-001",
            posicaoEmPx: { x: 96, y: 128 },
            niveisDependentes: ["rob-licao-001"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 50 })]
        }),

        new AcaoDoMapa({
            id: "rob-loja-listras",
            titulo: "Listras & Cia",
            tipo: TipoAcao.Loja,
            lojaId: "observer-loja-listras",
            posicaoEmPx: { x: 160, y: 192 + 5 },
            mostrarLabel: true,
            niveisDependentes: ["rob-encontre-bug-001"]
        }),

        new AcaoDoMapa({
            id: "rob-complete-texto-001",
            titulo: "Complete o texto",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteTexto,
            desafioId: "ct-observer-001",
            posicaoEmPx: { x: 144, y: 128 },
            niveisDependentes: ["rob-quiz-001"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 40 })]
        }),

        new AcaoDoMapa({
            id: "rob-encontre-bug-001",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-observer-001",
            posicaoEmPx: { x: 176, y: 160 },
            niveisDependentes: ["rob-complete-texto-001"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 50 })]
        }),

        new AcaoDoMapa({
            id: "rob-encontre-pares-001",
            titulo: "Encontre os pares",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontrePares,
            desafioId: "ep-observer-001",
            posicaoEmPx: { x: 224, y: 144 },
            niveisDependentes: ["rob-encontre-bug-001"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 40 })]
        }),

        new AcaoDoMapa({
            id: "rob-loja-despojado",
            titulo: "Estilo Despojado",
            tipo: TipoAcao.Loja,
            lojaId: "observer-loja-despojado",
            posicaoEmPx: { x: 320, y: 64 + 5 },
            mostrarLabel: true,
            niveisDependentes: ["rob-complete-codigo-001"]
        }),

        new AcaoDoMapa({
            id: "rob-licao-002",
            titulo: "A estrutura completa",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-observer-002",
            posicaoEmPx: { x: 272, y: 128 },
            niveisDependentes: ["rob-encontre-pares-001"],
            recompensas: [
                new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 30 }),
                new Recompensa({ tipo: TipoRecompensa.Aparencia, aparenciaId: 3 }),
            ]
        }),

        new AcaoDoMapa({
            id: "rob-complete-codigo-001",
            titulo: "Complete o código",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteCodigo,
            desafioId: "cc-observer-001",
            posicaoEmPx: { x: 304, y: 96 },
            niveisDependentes: ["rob-licao-002"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 60 })]
        }),

        new AcaoDoMapa({
            id: "rob-encontre-bug-002",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-observer-002",
            posicaoEmPx: { x: 224, y: 96 },
            niveisDependentes: ["rob-encontre-bug-001", "rob-encontre-pares-001"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 50 })]
        }),

        new AcaoDoMapa({
            id: "rob-licao-003",
            titulo: "Variações e quando (não) usar",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-observer-003",
            posicaoEmPx: { x: 224, y: 48 },
            niveisDependentes: ["rob-encontre-bug-002"],
            recompensas: [new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 30 })]
        }),

        new AcaoDoMapa({
            id: "rob-quiz-002",
            titulo: "Quiz final",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.PerguntasRespostas,
            desafioId: "quiz-observer-002",
            posicaoEmPx: { x: 176, y: 48 },
            niveisDependentes: ["rob-licao-003"],
            recompensas: [
                new Recompensa({ tipo: TipoRecompensa.Dinheiro, valor: 100 }),
                new Recompensa({ tipo: TipoRecompensa.PassagemRegional }),
                new Recompensa({ tipo: TipoRecompensa.PassagemContinental }),
            ]
        }),
    ]
});
