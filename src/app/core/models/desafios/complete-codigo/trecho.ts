export type TrechoProps = {
    id: string;
    codigo: string;
}

export class Trecho {
    constructor(private props: TrechoProps) {}

    get id() { return this.props.id; }
    get codigo() { return this.props.codigo; }
}
