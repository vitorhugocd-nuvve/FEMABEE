import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_STATE = new Mapa({
    id: "state",
    nome: "Ilha do State",
    tipo: TipoMapa.Regional,
    padrao: "State",
    url: "maps/regioes/comportamentais/STATE.gif",
    tamanhoEmPx: {
        x: 320,
        y: 320
    },
    acoes: [
        new AcaoDoMapa({
            id: "rst-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-comportamental",
            posicaoEmPx: { x: 160, y: 160 },
            mostrarLabel: true
        }),
    ]
});
