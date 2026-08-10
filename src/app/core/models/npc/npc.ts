import { Aparencia } from "../aparencia/aparencia";
import { TamanhoAbelha } from "../aparencia/tamanhos";

export type NpcProps = {
    id: string;
    nome: string;
    tamanho: TamanhoAbelha;
    /** Roupa do NPC — pode ficar vazio, é só uma abelha comum. */
    aparencias?: Aparencia[];
}

/** Um NPC é, em síntese, só uma abelha com nome — usa o mesmo renderizador (`bee-abelha`) do jogador. */
export class Npc {
    constructor(private props: NpcProps) { }

    get id() { return this.props.id; }
    get nome() { return this.props.nome; }
    get tamanho() { return this.props.tamanho; }
    get aparencias(): Aparencia[] { return this.props.aparencias ?? []; }
}
