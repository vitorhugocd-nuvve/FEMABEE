import { TAMANHO_TILE } from "../../constants/tile";
import { AcaoDoMapa } from "./acao-do-mapa";

export type MapaProps = {
    id: string;
    nome: string;
    padrao: string;
    url: string;
    acoes: AcaoDoMapa[],
    tamanhoEmPx: { x: number, y: number }
}

export class Mapa {
    constructor (
        private props: MapaProps
    ) {}

    get id() { return this.props.id; }
    get nome() { return this.props.nome; }
    get padrao() { return this.props.padrao; }
    get url() { return this.props.url; }
    get tamanhoEmPx() { return this.props.tamanhoEmPx; }

    get quantidadeTiles() {
        return {
            x: this.tamanhoEmPx.x / TAMANHO_TILE,
            y: this.tamanhoEmPx.y / TAMANHO_TILE,
        }
    }

    public getMapActionDataList() {
        return this.props.acoes.map(grab => grab.toMapActionData())
    }
}