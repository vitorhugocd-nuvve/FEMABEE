import { Conquista } from "../../../models/conquistas/conquista";
import { TipoCondicaoConquista } from "../../../models/conquistas/tipo-condicao-conquista";

export const ConquistasSeeds: Conquista[] = [
    // TESTE — a mais fácil possível de disparar, só pra validar o fluxo de desbloqueio/toast. Remover depois.
    new Conquista({
        id: "conquista-teste-primeira-fase-singleton",
        titulo: "Primeiro Passo",
        descricao: "Complete a primeira fase do padrão Singleton.",
        icone: "star",
        condicao: { tipo: TipoCondicaoConquista.FaseEspecifica, acaoId: "rs-licao-001" }
    }),

    new Conquista({
        id: "conquista-singleton-completo",
        titulo: "Mestra do Singleton",
        descricao: "Complete a última fase do padrão Singleton.",
        icone: "star",
        condicao: { tipo: TipoCondicaoConquista.FaseEspecifica, acaoId: "rs-quiz-002" }
    }),

    new Conquista({
        id: "conquista-bridge-completo",
        titulo: "Mestra da Bridge",
        descricao: "Complete a última fase do padrão Bridge.",
        icone: "star",
        condicao: { tipo: TipoCondicaoConquista.FaseEspecifica, acaoId: "rbr-quiz-002" }
    }),

    new Conquista({
        id: "conquista-observer-completo",
        titulo: "Mestra do Observer",
        descricao: "Complete a última fase do padrão Observer.",
        icone: "star",
        condicao: { tipo: TipoCondicaoConquista.FaseEspecifica, acaoId: "rob-quiz-002" }
    }),

    new Conquista({
        id: "conquista-primeira-roupa",
        titulo: "Fashionista Iniciante",
        descricao: "Compre sua primeira roupa.",
        icone: "shopping-cart",
        condicao: { tipo: TipoCondicaoConquista.AparenciasObtidas, meta: 1 }
    }),

    new Conquista({
        id: "conquista-sequencia-10",
        titulo: "Impecável",
        descricao: "Complete 10 fases seguidas sem errar nenhuma resposta.",
        icone: "zap",
        condicao: { tipo: TipoCondicaoConquista.SequenciaSemErrar, meta: 10 }
    }),
];
