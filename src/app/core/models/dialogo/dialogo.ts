import { TipoAcao } from "../map/tipo-acao";
import { TipoGatilhoDialogo } from "./tipo-gatilho-dialogo";

export type GatilhoDialogo =
    | { tipo: TipoGatilhoDialogo.AoEntrarNoMapa; mapaId: string }
    | { tipo: TipoGatilhoDialogo.AoConcluirFase; acaoId: string }
    | { tipo: TipoGatilhoDialogo.AoComprarRoupas; meta: number }
    | { tipo: TipoGatilhoDialogo.AoObterPassagens; tipoPassagem: TipoAcao.Onibus | TipoAcao.Aviao; meta: number };

export type DialogoProps = {
    id: string;
    npcId: string;
    /** Falas em sequência — uma de cada vez, com efeito de digitação. */
    falas: string[];
    gatilho: GatilhoDialogo;
}

export class Dialogo {
    constructor(private props: DialogoProps) { }

    get id() { return this.props.id; }
    get npcId() { return this.props.npcId; }
    get falas() { return this.props.falas; }
    get gatilho() { return this.props.gatilho; }
}
