import { TipoAparencia } from "./tipo-aparencia";

export type AparenciaProps = {
    id: number;
    tipo: TipoAparencia;
    urlImagem: string;
    nome: string;
    descricao: string;
    precoCompra: number;
    precoVenda?: number;
    disponivelVenda: boolean;
}

export class Aparencia {
    constructor(private props: AparenciaProps) { }

    get id() { return this.props.id; }
    get tipo() { return this.props.tipo; }
    get urlImagem() { return this.props.urlImagem; }
    get nome() { return this.props.nome; }
    get descricao() { return this.props.descricao; }
    get precoCompra() { return this.props.precoCompra; }
    get precoVenda() { return this.props.precoVenda; }
    get disponivelVenda() { return this.props.disponivelVenda; }
}