import { Aparencia } from "../../../models/aparencia/aparencia";
import { Loja } from "../../../models/aparencia/loja";
import { TipoAparencia } from "../../../models/aparencia/tipo-aparencia";

export const LojasSeeds = [
    new Loja({
        id: "1",
        nome: "Guarda-Roupa da Colmeia",
        descricao: "Roupas, rostos e acessórios para customizar sua abelha.",
        aparenciasDisponiveis: [
            new Aparencia({
                id: 1,
                tipo: TipoAparencia.Corpo,
                urlImagem: "/aparencia/body/black-turtleneck-sweater.gif",
                nome: "Suéter Gola Alta Preto",
                descricao: "Um suéter de gola alta na cor preta.",
                precoCompra: 120,
                precoVenda: 60,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 2,
                tipo: TipoAparencia.Corpo,
                urlImagem: "/aparencia/body/blue-turtleneck-sweater.gif",
                nome: "Suéter Gola Alta Azul",
                descricao: "Um suéter de gola alta na cor azul.",
                precoCompra: 120,
                precoVenda: 60,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 3,
                tipo: TipoAparencia.Corpo,
                urlImagem: "/aparencia/body/green-turtleneck-sweater.gif",
                nome: "Suéter Gola Alta Verde",
                descricao: "Um suéter de gola alta na cor verde.",
                precoCompra: 120,
                precoVenda: 60,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 4,
                tipo: TipoAparencia.Corpo,
                urlImagem: "/aparencia/body/orange-turtleneck-sweater.gif",
                nome: "Suéter Gola Alta Laranja",
                descricao: "Um suéter de gola alta na cor laranja.",
                precoCompra: 120,
                precoVenda: 60,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 5,
                tipo: TipoAparencia.Corpo,
                urlImagem: "/aparencia/body/pink-turtleneck-sweater.gif",
                nome: "Suéter Gola Alta Rosa",
                descricao: "Um suéter de gola alta na cor rosa.",
                precoCompra: 120,
                precoVenda: 60,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 6,
                tipo: TipoAparencia.Corpo,
                urlImagem: "/aparencia/body/purple-turtleneck-sweater.gif",
                nome: "Suéter Gola Alta Roxo",
                descricao: "Um suéter de gola alta na cor roxa.",
                precoCompra: 120,
                precoVenda: 60,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 7,
                tipo: TipoAparencia.Corpo,
                urlImagem: "/aparencia/body/red-turtleneck-sweater.gif",
                nome: "Suéter Gola Alta Vermelho",
                descricao: "Um suéter de gola alta na cor vermelha.",
                precoCompra: 120,
                precoVenda: 60,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 8,
                tipo: TipoAparencia.Corpo,
                urlImagem: "/aparencia/body/white-turtleneck-sweater.gif",
                nome: "Suéter Gola Alta Branco",
                descricao: "Um suéter de gola alta na cor branca.",
                precoCompra: 120,
                precoVenda: 60,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 9,
                tipo: TipoAparencia.Rosto,
                urlImagem: "/aparencia/rostos/1.gif",
                nome: "Rosto 1",
                descricao: "Uma expressão para sua abelha.",
                precoCompra: 80,
                precoVenda: 40,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 10,
                tipo: TipoAparencia.Rosto,
                urlImagem: "/aparencia/rostos/2.gif",
                nome: "Rosto 2",
                descricao: "Uma expressão para sua abelha.",
                precoCompra: 80,
                precoVenda: 40,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 11,
                tipo: TipoAparencia.Rosto,
                urlImagem: "/aparencia/rostos/3.gif",
                nome: "Rosto 3",
                descricao: "Uma expressão para sua abelha.",
                precoCompra: 80,
                precoVenda: 40,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 12,
                tipo: TipoAparencia.Rosto,
                urlImagem: "/aparencia/rostos/4.gif",
                nome: "Rosto 4",
                descricao: "Uma expressão para sua abelha.",
                precoCompra: 80,
                precoVenda: 40,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 13,
                tipo: TipoAparencia.Rosto,
                urlImagem: "/aparencia/rostos/5.gif",
                nome: "Rosto 5",
                descricao: "Uma expressão para sua abelha.",
                precoCompra: 80,
                precoVenda: 40,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 14,
                tipo: TipoAparencia.Rosto,
                urlImagem: "/aparencia/rostos/6.gif",
                nome: "Rosto 6",
                descricao: "Uma expressão para sua abelha.",
                precoCompra: 80,
                precoVenda: 40,
                disponivelVenda: true
            }),
            new Aparencia({
                id: 15,
                tipo: TipoAparencia.Oculos,
                urlImagem: "/aparencia/oculos/4.gif",
                nome: "Óculos Retrô",
                descricao: "Um óculos estiloso para sua abelha.",
                precoCompra: 200,
                precoVenda: 100,
                disponivelVenda: true
            })
        ]
    })
];
