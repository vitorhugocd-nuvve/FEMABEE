import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_BRIDGE = new Mapa({
    id: "bridge",
    nome: "Ilha da Bridge",
    tipo: TipoMapa.Regional,
    padrao: "Bridge",
    url: "maps/regioes/estruturais/bridge.gif",
    tamanhoEmPx: {
        x: 448,
        y: 256
    },
    acoes: [
        new AcaoDoMapa({
            id: "rbr-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-estrutural",
            posicaoEmPx: { x: 224, y: 128 },
            mostrarLabel: true
        }),
    ]
});
