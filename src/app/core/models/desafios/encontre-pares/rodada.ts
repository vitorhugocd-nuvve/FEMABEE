import { Par } from "./par";

export type RodadaProps = {
    id: string;
    pares: Par[];
}

export class Rodada {
    constructor(private props: RodadaProps) {}

    get id() { return this.props.id; }
    get pares(): Par[] { return this.props.pares; }
    get totalPares(): number { return this.props.pares.length; }
}
