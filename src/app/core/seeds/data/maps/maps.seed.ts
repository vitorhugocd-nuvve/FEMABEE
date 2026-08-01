import { AcaoDoMapa } from "../../../models/map/acao-do-mapa";
import { Mapa } from "../../../models/map/mapa";
import { TipoAcao } from "../../../models/map/tipo-acao";
import { TipoDesafio } from "../../../models/desafios/tipo-desafio";
import { TipoMapa } from "../../../models/map/tipo-mapa";

/** Mapa em que a abelha começa (usado por LocalizacaoAtualService). */
export const ID_MAPA_INICIAL = "mundi";

export const MapsSeeds = [
    // Mundi: contém 1 aeroporto por continente. Só o continente Criacional está construído por enquanto;
    // os outros 2 (Comportamental, Estrutural) entram quando houver mapa/arte pra eles.
    new Mapa({
        id: ID_MAPA_INICIAL,
        nome: "Mundi",
        tipo: TipoMapa.Mundi,
        padrao: "Mundo",
        url: "/maps/mapa1.webp",
        tamanhoEmPx: {
            x: 320,
            y: 320
        },
        acoes: [
            new AcaoDoMapa({
                id: "m-aeroporto-criacional",
                titulo: "Continente Criacional",
                tipo: TipoAcao.Aviao,
                mapaDestinoId: "continental-criacional",
                posicaoEmPx: { x: 150, y: 150 }
            })
        ]
    }),

    // Continental (Criacional): N paradas de ônibus (1 por região do continente) + 1 avião de volta ao Mundi.
    new Mapa({
        id: "continental-criacional",
        nome: "Continente Criacional",
        tipo: TipoMapa.Continental,
        padrao: "Criacional",
        url: "/maps/mapa1.webp",
        tamanhoEmPx: {
            x: 320,
            y: 320
        },
        acoes: [
            new AcaoDoMapa({
                id: "cc-onibus-regional",
                titulo: "Região Criacional",
                tipo: TipoAcao.Onibus,
                mapaDestinoId: "regional-criacional",
                posicaoEmPx: { x: 100, y: 200 }
            }),

            new AcaoDoMapa({
                id: "cc-aviao-mundi",
                titulo: "Mundi",
                tipo: TipoAcao.Aviao,
                mapaDestinoId: ID_MAPA_INICIAL,
                posicaoEmPx: { x: 250, y: 60 }
            })
        ]
    }),

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
