import { Dialogo } from "../../../models/dialogo/dialogo";
import { TipoGatilhoDialogo } from "../../../models/dialogo/tipo-gatilho-dialogo";
import { TipoAcao } from "../../../models/map/tipo-acao";

export const DialogosSeeds: Dialogo[] = [
    new Dialogo({
        id: "dialogo-boas-vindas-mundi",
        npcId: "mel",
        falas: [
            "Oi! Eu sou a Mel, e vou te ajudar por aqui.",
            "Esse é o mapa Mundi — cada continente representa uma família de padrões de projeto.",
            "Voe até um aeroporto pra começar a explorar. Boa sorte!"
        ],
        gatilho: { tipo: TipoGatilhoDialogo.AoEntrarNoMapa, mapaId: "mundi" }
    }),

    new Dialogo({
        id: "dialogo-primeira-fase",
        npcId: "mel",
        falas: [
            "Boa, você completou sua primeira fase!",
            "Continue assim e logo vai dominar todos os padrões dessa região."
        ],
        gatilho: { tipo: TipoGatilhoDialogo.AoConcluirFase, acaoId: "1" }
    }),

    new Dialogo({
        id: "dialogo-fashionista",
        npcId: "mel",
        falas: [
            "Uau, olha só esse guarda-roupa! Você tem bom gosto.",
            "Continue comprando roupas novas na loja — sempre tem coisa chegando."
        ],
        gatilho: { tipo: TipoGatilhoDialogo.AoComprarRoupas, meta: 2 }
    }),

    new Dialogo({
        id: "dialogo-passagens-onibus",
        npcId: "mel",
        falas: [
            "Você já tem passagens de ônibus de sobra!",
            "Aproveita pra visitar as regiões vizinhas."
        ],
        gatilho: { tipo: TipoGatilhoDialogo.AoObterPassagens, tipoPassagem: TipoAcao.Onibus, meta: 4 }
    }),

    new Dialogo({
        id: "dialogo-boas-vindas-factory",
        npcId: "mel",
        falas: [
            "Chegamos na Ilha da Fábrica! Aqui a gente aprende o Factory Method — o padrão que ensina a delegar 'qual objeto criar' pra quem sabe decidir isso melhor.",
            "Repara nas paradas pelo caminho: lição, quiz, textos, pares e uns bugs pra caçar — cada uma destrava um pedacinho novo do padrão.",
            "Bora explorar? Boa sorte por aqui!"
        ],
        gatilho: { tipo: TipoGatilhoDialogo.AoEntrarNoMapa, mapaId: "factory" }
    }),

    new Dialogo({
        id: "dialogo-boas-vindas-prototype",
        npcId: "mel",
        falas: [
            "Bem-vindo à Oficina de Clonagem! Aqui a gente aprende o Prototype — o padrão de clonar um objeto já pronto em vez de montar tudo do zero de novo.",
            "Presta atenção na diferença entre cópia rasa e cópia profunda — é onde a maioria das pegadinhas mora.",
            "Vai lá, tem lição, quiz e bugs de clonagem esperando por você!"
        ],
        gatilho: { tipo: TipoGatilhoDialogo.AoEntrarNoMapa, mapaId: "prototype" }
    }),

    new Dialogo({
        id: "dialogo-boas-vindas-builder",
        npcId: "mel",
        falas: [
            "Chegamos na Oficina de Montagem! Aqui a gente aprende o Builder — o padrão de montar um objeto complicado passo a passo, em vez de um construtor gigante com parâmetro pra tudo.",
            "Repara como cada método fluente devolve o próprio builder — é isso que deixa dar pra encadear as chamadas.",
            "Bora montar uns caminhões? Boa sorte por aqui!"
        ],
        gatilho: { tipo: TipoGatilhoDialogo.AoEntrarNoMapa, mapaId: "builder" }
    })
];
