import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_OBSERVER = new Mapa({
    id: "observer",
    nome: "Ilha do Observer",
    tipo: TipoMapa.Regional,
    padrao: "Observer",
    url: "maps/regioes/comportamentais/OBSERVER.gif",
    tamanhoEmPx: {
        x: 384,
        y: 256
    },
    acoes: [
        new AcaoDoMapa({
            id: "rob-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-comportamental",
            posicaoEmPx: { x: 192, y: 128 },
            mostrarLabel: true
        }),
    ]
});
