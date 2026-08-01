import { TamanhoAbelha } from "../models/aparencia/tamanhos";
import { TipoAparencia } from "../models/aparencia/tipo-aparencia";

export const TAMANHO_APARENCIA_ABELHA = 32;

export const LOCALIZACAO_ICONE_APARENCIA_IMAGEM = 0;

/** Spritesheet base da abelha (mesmo formato ícone + 4 tamanhos das imagens de aparência), renderizada por baixo de todas as camadas. */
export const CAMINHO_IMAGEM_BASE_ABELHA = "/aparencia/tamanhos.gif";

export const LOCALIZACAO_APARENCIA_NA_IMAGEM: Record<TamanhoAbelha, number> = {
    PEQUENA_MAGRA: TAMANHO_APARENCIA_ABELHA,
    ALTA_MAGRA: TAMANHO_APARENCIA_ABELHA * 2,
    PEQUENA_GORDA: TAMANHO_APARENCIA_ABELHA * 3,
    ALTA_GORDA: TAMANHO_APARENCIA_ABELHA * 4
}

/** Ordem de empilhamento (de baixo pra cima) ao compor as camadas de aparência sobre a abelha. */
export const ORDEM_RENDERIZACAO_APARENCIA: TipoAparencia[] = [
    TipoAparencia.Rosto,
    TipoAparencia.Detalhes,
    TipoAparencia.Corpo,
    TipoAparencia.Jaqueta,
    TipoAparencia.Oculos,
    TipoAparencia.Chapeu
];