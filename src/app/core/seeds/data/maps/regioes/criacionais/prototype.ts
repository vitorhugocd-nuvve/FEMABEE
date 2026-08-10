import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoDesafio } from "../../../../../models/desafios/tipo-desafio";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_PROTOTYPE = new Mapa({
    id: "prototype",
    nome: "Oficina de Clonagem",
    tipo: TipoMapa.Regional,
    padrao: "Prototype",
    url: "maps/regioes/criacionais/prototype.gif",
    tamanhoEmPx: {
        x: 256,
        y: 352
    },
    acoes: [
        new AcaoDoMapa({
            id: "rp-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-criacional",
            posicaoEmPx: { x: 112, y: 288 },
            mostrarLabel: true
        }),

        new AcaoDoMapa({
            id: "rp-licao-001",
            titulo: "O que é o Prototype?",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-prototype-001",
            posicaoEmPx: { x: 112, y: 240 }
        }),

        new AcaoDoMapa({
            id: "rp-quiz-001",
            titulo: "Quiz: o básico",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.PerguntasRespostas,
            desafioId: "quiz-prototype-001",
            posicaoEmPx: { x: 64, y: 240 }
        }),

        new AcaoDoMapa({
            id: "rp-complete-texto-001",
            titulo: "Complete o texto",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteTexto,
            desafioId: "ct-prototype-001",
            posicaoEmPx: { x: 64, y: 208 }
        }),

        new AcaoDoMapa({
            id: "rp-encontre-bug-001",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-prototype-001",
            posicaoEmPx: { x: 64, y: 144 }
        }),

        new AcaoDoMapa({
            id: "rp-licao-002",
            titulo: "A estrutura completa",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-prototype-002",
            posicaoEmPx: { x: 112, y: 128 }
        }),

        new AcaoDoMapa({
            id: "rp-encontre-pares-001",
            titulo: "Encontre os pares",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontrePares,
            desafioId: "ep-prototype-001",
            posicaoEmPx: { x: 128, y: 112 }
        }),

        new AcaoDoMapa({
            id: "rp-complete-codigo-001",
            titulo: "Complete o código",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.CompleteCodigo,
            desafioId: "cc-prototype-001",
            posicaoEmPx: { x: 80, y: 112 }
        }),

        new AcaoDoMapa({
            id: "rp-encontre-bug-002",
            titulo: "Encontre o bug",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.EncontreBug,
            desafioId: "eb-prototype-002",
            posicaoEmPx: { x: 48, y: 112 }
        }),

        new AcaoDoMapa({
            id: "rp-licao-003",
            titulo: "Cópia rasa, cópia profunda e registro",
            tipo: TipoAcao.Desafio,
            tipoDesafio: TipoDesafio.Licao,
            desafioId: "licao-prototype-003",
            posicaoEmPx: { x: 192, y: 176 }
        }),

        new AcaoDoMapa({
            id: "rp-loja-001",
            titulo: "Loja",
            tipo: TipoAcao.Loja,
            lojaId: "1",
            posicaoEmPx: { x: 192, y: 176 }
        }),
    ]
});
