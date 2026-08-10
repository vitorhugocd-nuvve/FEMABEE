import { Aparencia } from "../models/aparencia/aparencia";
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

export const TITULO_TIPO_APARENCIA: Record<TipoAparencia, string> = {
    [TipoAparencia.Corpo]: "Roupas",
    [TipoAparencia.Rosto]: "Rostos",
    [TipoAparencia.Oculos]: "Óculos",
    [TipoAparencia.Chapeu]: "Chapéus",
    [TipoAparencia.Jaqueta]: "Jaquetas",
    [TipoAparencia.Detalhes]: "Detalhes"
};

export const TITULO_TAMANHO_ABELHA: Record<TamanhoAbelha, string> = {
    [TamanhoAbelha.PequenaMagra]: "Pequena Magrinha",
    [TamanhoAbelha.AltaMagra]: "Alta Magrinha",
    [TamanhoAbelha.PequenaGorda]: "Pequena Fofa",
    [TamanhoAbelha.AltaGorda]: "Alta Fofa"
};

/**
 * As imagens de aparência são spritesheets de 32x160px (5 blocos de 32x32):
 * o bloco 0 é o ícone, os blocos 1-4 são a aparência aplicada em cada TamanhoAbelha.
 * Recorta sempre o bloco do ícone (offset fixo em LOCALIZACAO_ICONE_APARENCIA_IMAGEM).
 */
export function estiloIconeAparencia(aparencia: Aparencia) {
    return {
        width: `${TAMANHO_APARENCIA_ABELHA}px`,
        height: `${TAMANHO_APARENCIA_ABELHA}px`,
        backgroundImage: `url('${aparencia.urlImagem}')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `${-LOCALIZACAO_ICONE_APARENCIA_IMAGEM}px 0px`,
        backgroundSize: 'auto',
        imageRendering: 'pixelated'
    };
}