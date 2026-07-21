export type ParProps = {
    id: string;
    afirmacao: string;
    correspondencia: string;
}

export class Par {
    constructor(private props: ParProps) {}

    get id() { return this.props.id; }
    get afirmacao() { return this.props.afirmacao; }
    get correspondencia() { return this.props.correspondencia; }
}
