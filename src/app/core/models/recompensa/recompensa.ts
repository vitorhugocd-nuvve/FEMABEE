import { TipoRecompensa } from "./tipo-recompensa";

export type RecompensaProps = {
    tipo: TipoRecompensa;
    /** Quantia em dinheiro concedida — só quando `tipo` é `Dinheiro`. */
    valor?: number;
    /** Id da `Aparencia` (item de loja) concedida — só quando `tipo` é `Aparencia`. */
    aparenciaId?: number;
}

/** O que uma fase (AcaoDoMapa) concede ao ser concluída pela primeira vez. */
export class Recompensa {
    constructor(private props: RecompensaProps) { }

    get tipo() { return this.props.tipo; }
    get valor() { return this.props.valor; }
    get aparenciaId() { return this.props.aparenciaId; }
}
