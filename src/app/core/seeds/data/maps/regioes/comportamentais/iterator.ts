import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_ITERATOR = new Mapa({
    id: "iterator",
    nome: "Ilha do Iterator",
    tipo: TipoMapa.Regional,
    padrao: "Iterator",
    url: "maps/regioes/comportamentais/ITERATOR.gif",
    tamanhoEmPx: {
        x: 320,
        y: 384
    },
    acoes: [
        new AcaoDoMapa({
            id: "rit-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-comportamental",
            posicaoEmPx: { x: 160, y: 192 },
            mostrarLabel: true
        }),
    ]
});
