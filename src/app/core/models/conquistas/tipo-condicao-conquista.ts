export enum TipoCondicaoConquista {
    /** Completar N fases (ações de Desafio/Onibus/Aviao) no total, em qualquer mapa. */
    FasesConcluidas = "FASES_CONCLUIDAS",
    /** Completar uma fase (AcaoDoMapa) específica. */
    FaseEspecifica = "FASE_ESPECIFICA",
    /** Completar todas as fases de um mapa (região) específico. */
    RegiaoEspecifica = "REGIAO_ESPECIFICA",
    /** Completar N fases seguidas sem nenhuma resposta errada. */
    SequenciaSemErrar = "SEQUENCIA_SEM_ERRAR",
    /** Comprar todos os itens de aparência de um tipo (ex.: todas as roupas). */
    ComprasCompletas = "COMPRAS_COMPLETAS",
    /** Obter N aparências no total (compradas ou de recompensa) — ex.: "comprou a primeira roupa" com meta 1. */
    AparenciasObtidas = "APARENCIAS_OBTIDAS",
}
