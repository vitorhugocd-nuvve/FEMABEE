import { TamanhoAbelha } from "../aparencia/tamanhos";

export type AbelhaProps = {
    id: string;
    nome: string;
    tamanho?: TamanhoAbelha;
    comidaFavorita: string;
}

/**
 * O backend guarda `tamanho` como texto livre; aqui tipamos como TamanhoAbelha
 * porque só o form de criação de abelha (deste app) escreve esse campo.
 */
export class Abelha {
    constructor(private props: AbelhaProps) { }

    get id() { return this.props.id; }
    get nome() { return this.props.nome; }
    get tamanho() { return this.props.tamanho; }
    get comidaFavorita() { return this.props.comidaFavorita; }
}
