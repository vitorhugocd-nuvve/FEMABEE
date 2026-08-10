import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_PROXY = new Mapa({
    id: "proxy",
    nome: "Ilha do Proxy",
    tipo: TipoMapa.Regional,
    padrao: "Proxy",
    url: "maps/regioes/estruturais/proxy.gif",
    tamanhoEmPx: {
        x: 272,
        y: 320
    },
    acoes: [
        new AcaoDoMapa({
            id: "rpx-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-estrutural",
            posicaoEmPx: { x: 136, y: 160 },
            mostrarLabel: true
        }),
    ]
});
