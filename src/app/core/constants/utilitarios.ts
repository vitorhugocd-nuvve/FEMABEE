import { TipoDesafio } from "../models/desafios/tipo-desafio";
import { TipoAcao } from "../models/map/tipo-acao";

/** Tileset de ícones de ação do mapa (desafios, ônibus, avião, loja). Grid 4x4 de tiles 16x16. */
export const CAMINHO_TILESET_UTILITARIOS = "/utils/utilitario.gif";

export const COLUNAS_TILESET_UTILITARIOS = 4;

/**
 * Ícone base (não concluído) por TipoDesafio.
 * `EncontrePares` ainda não tem ícone próprio no tileset — reaproveita o do Quiz (`PerguntasRespostas`) até ganhar um.
 */
export const ICONE_DESAFIO_POR_TIPO: Record<TipoDesafio, number> = {
    [TipoDesafio.EncontreBug]: 0,
    [TipoDesafio.PerguntasRespostas]: 1,
    [TipoDesafio.CompleteTexto]: 2,
    [TipoDesafio.CompleteCodigo]: 3,
    [TipoDesafio.EncontrePares]: 1,
    [TipoDesafio.Licao]: 8
};

/** Ícone concluído por TipoDesafio — mesmo mapeamento de `ICONE_DESAFIO_POR_TIPO`, uma linha abaixo no tileset. */
export const ICONE_DESAFIO_CONCLUIDO_POR_TIPO: Record<TipoDesafio, number> = {
    [TipoDesafio.EncontreBug]: 4,
    [TipoDesafio.PerguntasRespostas]: 5,
    [TipoDesafio.CompleteTexto]: 6,
    [TipoDesafio.CompleteCodigo]: 7,
    [TipoDesafio.EncontrePares]: 5,
    [TipoDesafio.Licao]: 12
};

export const ICONE_ONIBUS = 9;
export const ICONE_ONIBUS_OBTIDO = 13;

export const ICONE_AVIAO = 10;
export const ICONE_AVIAO_OBTIDO = 14;

export const ICONE_LOJA = 15;

/** Ícone base (não obtido) por TipoAcao, para os tipos sem sub-tipo (Onibus, Aviao, Loja). */
export const ICONE_ACAO_POR_TIPO: Partial<Record<TipoAcao, number>> = {
    [TipoAcao.Onibus]: ICONE_ONIBUS,
    [TipoAcao.Aviao]: ICONE_AVIAO,
    [TipoAcao.Loja]: ICONE_LOJA
};

/** Ícone obtido por TipoAcao — só Onibus e Aviao têm variante obtida. */
export const ICONE_ACAO_OBTIDO_POR_TIPO: Partial<Record<TipoAcao, number>> = {
    [TipoAcao.Onibus]: ICONE_ONIBUS_OBTIDO,
    [TipoAcao.Aviao]: ICONE_AVIAO_OBTIDO
};
