import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_ADAPTER = new Mapa({
    id: "adapter",
    nome: "Ilha do Adapter",
    tipo: TipoMapa.Regional,
    padrao: "Adapter",
    url: "maps/regioes/estruturais/adapter.gif",
    tamanhoEmPx: {
        x: 432,
        y: 256
    },
    acoes: [
        new AcaoDoMapa({
            id: "rad-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-estrutural",
            posicaoEmPx: { x: 216, y: 128 },
            mostrarLabel: true
        }),
    ]
});
