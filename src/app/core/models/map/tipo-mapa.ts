export enum TipoMapa {
    Mundi = "MUNDI",
    Continental = "CONTINENTAL",
    Regional = "REGIONAL"
}

/** Profundidade de cada tipo na hierarquia de navegação (Mundi -> Continental -> Regional). */
export const PROFUNDIDADE_TIPO_MAPA: Record<TipoMapa, number> = {
    [TipoMapa.Mundi]: 0,
    [TipoMapa.Continental]: 1,
    [TipoMapa.Regional]: 2
};
