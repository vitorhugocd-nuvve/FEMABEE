import { AcaoDoMapa } from "../../../models/map/acao-do-mapa";
import { Mapa } from "../../../models/map/mapa";
import { TipoAcao } from "../../../models/map/tipo-acao";

export const MapsSeeds = [
    new Mapa({
        id: "1",
        nome: "Construction Zone Island",
        padrao: "Creational",
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
                posicaoEmPx: { x: 28, y: 278 }
            }),

            new AcaoDoMapa({
                id: "2",
                titulo: "Pattern 2",
                tipo: TipoAcao.Desafio,
                posicaoEmPx: { x: 56, y: 245 }
            }),

            new AcaoDoMapa({
                id: "3",
                titulo: "Bus Stop",
                tipo: TipoAcao.Onibus,
                posicaoEmPx: { x: 90, y: 218 }
            }),

            new AcaoDoMapa({
                id: "4",
                titulo: "Pattern 3",
                tipo: TipoAcao.Desafio,
                posicaoEmPx: { x: 125, y: 190 }
            }),

            new AcaoDoMapa({
                id: "5",
                titulo: "Pattern 4",
                tipo: TipoAcao.Desafio,
                posicaoEmPx: { x: 158, y: 164 }
            }),

            new AcaoDoMapa({
                id: "6",
                titulo: "Airport",
                tipo: TipoAcao.Aviao,
                posicaoEmPx: { x: 196, y: 140 }
            }),

            new AcaoDoMapa({
                id: "7",
                titulo: "Pattern 5",
                tipo: TipoAcao.Desafio,
                posicaoEmPx: { x: 228, y: 110 }
            }),

            new AcaoDoMapa({
                id: "8",
                titulo: "Pattern 6",
                tipo: TipoAcao.Desafio,
                posicaoEmPx: { x: 260, y: 76 }
            }),

            new AcaoDoMapa({
                id: "9",
                titulo: "Final Challenge",
                tipo: TipoAcao.Desafio,
                posicaoEmPx: { x: 286, y: 42 }
            })
        ]
    })
];