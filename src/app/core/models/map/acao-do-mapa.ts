import { MapActionData } from "../../../../ui/map";
import { TAMANHO_TILE } from "../../constants/tile";
import { TipoDesafio } from "../desafios/tipo-desafio";
import { TipoAcao } from "./tipo-acao";

export type AcaoDoMapaProps = {
    id: string;
    tipo: TipoAcao;
    titulo: string;
    posicaoEmPx: { x: number, y: number }
    /** Referencia a Loja exibida quando `tipo` é `TipoAcao.Loja`. */
    lojaId?: string;
    /** Tipo do desafio exibido quando `tipo` é `TipoAcao.Desafio`. */
    tipoDesafio?: TipoDesafio;
    /** Mapa para o qual a ação navega quando `tipo` é `TipoAcao.Onibus` ou `TipoAcao.Aviao`. */
    mapaDestinoId?: string;
    /** Desafio aberto quando `tipo` é `TipoAcao.Desafio`. */
    desafioId?: string;
    /** Exibe o título embaixo da ação no mapa. Padrão: `false`. */
    mostrarLabel?: boolean;
    /** Ids de outras ações do mesmo mapa que precisam estar concluídas antes desta. Desenha uma linha de conexão no mapa. */
    niveisDependentes?: string[];
}

export class AcaoDoMapa {
    constructor (
        private props: AcaoDoMapaProps
    ) {}

    get id() { return this.props.id; }
    get tipo() { return this.props.tipo; }
    get titulo() { return this.props.titulo; }
    get posicaoEmPx() { return this.props.posicaoEmPx; }
    get lojaId() { return this.props.lojaId; }
    get tipoDesafio() { return this.props.tipoDesafio; }
    get mapaDestinoId() { return this.props.mapaDestinoId; }
    get desafioId() { return this.props.desafioId; }
    get mostrarLabel() { return this.props.mostrarLabel ?? false; }
    get niveisDependentes() { return this.props.niveisDependentes ?? []; }

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
            label: this.mostrarLabel ? this.titulo : undefined
        }
    }
    
}