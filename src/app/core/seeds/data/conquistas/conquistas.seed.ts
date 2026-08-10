import { Conquista } from "../../../models/conquistas/conquista";
import { TipoCondicaoConquista } from "../../../models/conquistas/tipo-condicao-conquista";
import { TipoAparencia } from "../../../models/aparencia/tipo-aparencia";

export const ConquistasSeeds: Conquista[] = [
    new Conquista({
        id: "conquista-15-fases",
        titulo: "Veterana",
        descricao: "Complete 15 fases.",
        icone: "star",
        condicao: { tipo: TipoCondicaoConquista.FasesConcluidas, meta: 15 }
    }),

    new Conquista({
        id: "conquista-regiao-criacional",
        titulo: "Mestra dos Criacionais",
        descricao: "Complete toda a região Criacional.",
        icone: "flag",
        condicao: { tipo: TipoCondicaoConquista.RegiaoEspecifica, mapaId: "regional-criacional" }
    }),

    new Conquista({
        id: "conquista-desafio-final",
        titulo: "Desafio Final",
        descricao: "Complete o Final Challenge.",
        icone: "check-circle",
        condicao: { tipo: TipoCondicaoConquista.FaseEspecifica, acaoId: "9" }
    }),

    new Conquista({
        id: "conquista-sequencia-10",
        titulo: "Impecável",
        descricao: "Complete 10 fases seguidas sem errar nenhuma resposta.",
        icone: "zap",
        condicao: { tipo: TipoCondicaoConquista.SequenciaSemErrar, meta: 10 }
    }),

    new Conquista({
        id: "conquista-guarda-roupa-completo",
        titulo: "Fashionista",
        descricao: "Compre todas as roupas disponíveis na loja.",
        icone: "shopping-cart",
        condicao: { tipo: TipoCondicaoConquista.ComprasCompletas, tipoAparencia: TipoAparencia.Corpo }
    }),
];
