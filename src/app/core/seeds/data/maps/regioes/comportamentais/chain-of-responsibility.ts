import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_CHAIN_OF_RESPONSIBILITY = new Mapa({
    id: "chain-of-responsibility",
    nome: "Ilha do Chain of Responsibility",
    tipo: TipoMapa.Regional,
    padrao: "Chain of Responsibility",
    url: "maps/regioes/comportamentais/CHAIN_OF_RESPONSABILITY.gif",
    tamanhoEmPx: {
        x: 448,
        y: 320
    },
    acoes: [
        new AcaoDoMapa({
            id: "rcor-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-comportamental",
            posicaoEmPx: { x: 224, y: 160 },
            mostrarLabel: true
        }),
    ]
});
