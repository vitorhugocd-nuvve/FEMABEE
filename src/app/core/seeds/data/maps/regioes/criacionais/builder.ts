import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoDesafio } from "../../../../../models/desafios/tipo-desafio";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_BUILDER = new Mapa({
    id: "builder",
    nome: "Oficina de Montagem",
    tipo: TipoMapa.Regional,
    padrao: "Builder",
    url: "maps/regioes/criacionais/builder.gif",
    tamanhoEmPx: {
        x: 352,
        y: 352
    },
    acoes: [
        new AcaoDoMapa({
            id: "rb-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-criacional",
            posicaoEmPx: { x: 112, y: 288 },
            mostrarLabel: true
        }),

        new AcaoDoMapa({
            id: "rb-licao-001",
            titulo: "O que é o Builder?",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-builder-001",
            posicaoEmPx: { x: 112, y: 240 }
        }),

        new AcaoDoMapa({
            id: "rb-quiz-001",
            titulo: "Quiz: o básico",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.PerguntasRespostas,
            desafioId: "quiz-builder-001",
            posicaoEmPx: { x: 64, y: 240 }
        }),

        new AcaoDoMapa({
            id: "rb-complete-texto-001",
            titulo: "Complete o texto",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteTexto,
            desafioId: "ct-builder-001",
            posicaoEmPx: { x: 64, y: 208 }
        }),

        new AcaoDoMapa({
            id: "rb-encontre-bug-001",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-builder-001",
            posicaoEmPx: { x: 64, y: 144 }
        }),

        new AcaoDoMapa({
            id: "rb-licao-002",
            titulo: "A estrutura completa",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-builder-002",
            posicaoEmPx: { x: 112, y: 128 }
        }),

        new AcaoDoMapa({
            id: "rb-encontre-pares-001",
            titulo: "Encontre os pares",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontrePares,
            desafioId: "ep-builder-001",
            posicaoEmPx: { x: 128, y: 112 }
        }),

        new AcaoDoMapa({
            id: "rb-complete-codigo-001",
            titulo: "Complete o código",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteCodigo,
            desafioId: "cc-builder-001",
            posicaoEmPx: { x: 80, y: 112 }
        }),

        new AcaoDoMapa({
            id: "rb-encontre-bug-002",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-builder-002",
            posicaoEmPx: { x: 48, y: 112 }
        }),

        new AcaoDoMapa({
            id: "rb-licao-003",
            titulo: "Director e quando (não) usar",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-builder-003",
            posicaoEmPx: { x: 192, y: 176 }
        }),

        new AcaoDoMapa({
            id: "rb-loja-001",
            titulo: "Loja",
            tipo: TipoAcao.Loja,
            lojaId: "1",
            posicaoEmPx: { x: 192, y: 176 }
        }),
    ]
});
