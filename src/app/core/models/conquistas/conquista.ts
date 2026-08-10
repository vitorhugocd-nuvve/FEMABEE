import { TipoAparencia } from "../aparencia/tipo-aparencia";
import { TipoCondicaoConquista } from "./tipo-condicao-conquista";

export type CondicaoConquista =
    | { tipo: TipoCondicaoConquista.FasesConcluidas; meta: number }
    | { tipo: TipoCondicaoConquista.FaseEspecifica; acaoId: string }
    | { tipo: TipoCondicaoConquista.RegiaoEspecifica; mapaId: string }
    | { tipo: TipoCondicaoConquista.SequenciaSemErrar; meta: number }
    | { tipo: TipoCondicaoConquista.ComprasCompletas; tipoAparencia: TipoAparencia };

export type ConquistaProps = {
    id: string;
    titulo: string;
    descricao: string;
    /** Slug do ícone (pixelarticons) exibido quando desbloqueada. */
    icone: string;
    condicao: CondicaoConquista;
}

export class Conquista {
    constructor(private props: ConquistaProps) { }

    get id() { return this.props.id; }
    get titulo() { return this.props.titulo; }
    get descricao() { return this.props.descricao; }
    get icone() { return this.props.icone; }
    get condicao() { return this.props.condicao; }
}
