import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_STRATEGY = new Mapa({
    id: "strategy",
    nome: "Ilha da Strategy",
    tipo: TipoMapa.Regional,
    padrao: "Strategy",
    url: "maps/regioes/comportamentais/STRATEGY.gif",
    tamanhoEmPx: {
        x: 432,
        y: 480
    },
    acoes: [
        new AcaoDoMapa({
            id: "rsy-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-comportamental",
            posicaoEmPx: { x: 216, y: 240 },
            mostrarLabel: true
        }),
    ]
});
