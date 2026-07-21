import { MapActionData } from "../../../../ui/map";
import { TAMANHO_TILE } from "../../constants/tile";
import { TipoAcao } from "./tipo-acao";

export type AcaoDoMapaProps = {
    id: string;
    tipo: TipoAcao;
    titulo: string;
    concluida: boolean;
    concluidaEm?: Date;
    posicaoEmPx: { x: number, y: number }
}

export class AcaoDoMapa {
    constructor (
        private props: Omit<AcaoDoMapaProps, 'concluida' | 'concluidaEm'> & {
            concluida?: boolean,
            concluidaEm?: Date
        }
    ) {
        this.props.concluida = props.concluida ?? false;
    }

    get id() { return this.props.id; }
    get tipo() { return this.props.tipo; }
    get titulo() { return this.props.titulo; }
    get concluida() { return this.props.concluida; }
    get concluidaEm() { return this.props.concluidaEm; }
    get posicaoEmPx() { return this.props.posicaoEmPx; }

    public marcarComoConluida() {}

    public posicaoEmTiles() {
        return {
            x: this.props.posicaoEmPx.x / TAMANHO_TILE,
            y: this.props.posicaoEmPx.y / TAMANHO_TILE
        }
    }

    // Método framework aí
    public toMapActionData(): MapActionData {
        return {
            x: this.posicaoEmTiles().x,
            y: this.posicaoEmTiles().y,
            color: '#fff',
            label: this.titulo
        }
    }
    
}