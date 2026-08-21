import { Abelha, AbelhaProps } from "../abelha/abelha";

export type JogadorProps = {
    id: string;
    abelhas: AbelhaProps[];
}

export class Jogador {
    constructor(private props: JogadorProps) { }

    get id() { return this.props.id; }
    get abelhas() { return this.props.abelhas.map(abelha => new Abelha(abelha)); }
}
