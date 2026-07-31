import { Aparencia } from "./aparencia";

export type LojaProps = {
    id: string;
    nome: string;
    descricao: string;
    aparenciasDisponiveis: Aparencia[]
}

export class Loja {
    constructor(private props: LojaProps) { }

    get id() { return this.props.id; }
    get nome() { return this.props.nome; }
    get descricao() { return this.props.descricao; }
    get aparenciasDisponiveis() { return this.props.aparenciasDisponiveis; }
}