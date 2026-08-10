import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoDesafio } from "../../../../../models/desafios/tipo-desafio";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_FACTORY = new Mapa({
    id: "factory",
    nome: "Ilha da Fábrica",
    tipo: TipoMapa.Regional,
    padrao: "Factory Method",
    url: "maps/regioes/criacionais/factory.gif",
    tamanhoEmPx: {
        x: 336,
        y: 432
    },
    acoes: [
        new AcaoDoMapa({
            id: "rf-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-criacional",
            posicaoEmPx: { x: 128, y: 64 },
            mostrarLabel: true
        }),

        new AcaoDoMapa({
            id: "rf-licao-001",
            titulo: "O que é o Factory Method?",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-factory-001",
            posicaoEmPx: { x: 128, y: 96 }
        }),

        new AcaoDoMapa({
            id: "rf-quiz-001",
            titulo: "Quiz: o básico",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.PerguntasRespostas,
            desafioId: "quiz-factory-001",
            posicaoEmPx: { x: 128, y: 160 }
        }),

        new AcaoDoMapa({
            id: "rf-loja-001",
            titulo: "Loja",
            tipo: TipoAcao.Loja,
            lojaId: "1",
            posicaoEmPx: { x: 64, y: 160 }
        }),

        new AcaoDoMapa({
            id: "rf-complete-texto-001",
            titulo: "Complete o texto",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteTexto,
            desafioId: "ct-factory-001",
            posicaoEmPx: { x: 160, y: 160 }
        }),

        new AcaoDoMapa({
            id: "rf-encontre-bug-001",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-factory-001",
            posicaoEmPx: { x: 160, y: 192 }
        }),

        new AcaoDoMapa({
            id: "rf-encontre-pares-001",
            titulo: "Encontre os pares",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontrePares,
            desafioId: "ep-factory-001",
            posicaoEmPx: { x: 160, y: 240 }
        }),

        new AcaoDoMapa({
            id: "rf-licao-002",
            titulo: "A estrutura completa",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-factory-002",
            posicaoEmPx: { x: 192, y: 240 }
        }),

        new AcaoDoMapa({
            id: "rf-complete-codigo-001",
            titulo: "Complete o código",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteCodigo,
            desafioId: "cc-factory-001",
            posicaoEmPx: { x: 192, y: 288 }
        }),

        new AcaoDoMapa({
            id: "rf-encontre-bug-002",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-factory-002",
            posicaoEmPx: { x: 224, y: 288 }
        }),

        new AcaoDoMapa({
            id: "rf-licao-003",
            titulo: "Variações e quando (não) usar",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-factory-003",
            posicaoEmPx: { x: 224, y: 256 }
        }),

        new AcaoDoMapa({
            id: "rf-loja-002",
            titulo: "Loja",
            tipo: TipoAcao.Loja,
            lojaId: "1",
            posicaoEmPx: { x: 272, y: 352 }
        }),
    ]
});
