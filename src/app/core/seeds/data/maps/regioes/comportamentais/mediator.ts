import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_MEDIATOR = new Mapa({
    id: "mediator",
    nome: "Ilha do Mediator",
    tipo: TipoMapa.Regional,
    padrao: "Mediator",
    url: "maps/regioes/comportamentais/MEDIATOR.gif",
    tamanhoEmPx: {
        x: 336,
        y: 320
    },
    acoes: [
        new AcaoDoMapa({
            id: "rme-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-comportamental",
            posicaoEmPx: { x: 168, y: 160 },
            mostrarLabel: true
        }),
    ]
});
