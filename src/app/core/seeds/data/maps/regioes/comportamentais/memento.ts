import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_MEMENTO = new Mapa({
    id: "memento",
    nome: "Ilha do Memento",
    tipo: TipoMapa.Regional,
    padrao: "Memento",
    url: "maps/regioes/comportamentais/MEMENTO.gif",
    tamanhoEmPx: {
        x: 256,
        y: 224
    },
    acoes: [
        new AcaoDoMapa({
            id: "rmm-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-comportamental",
            posicaoEmPx: { x: 128, y: 112 },
            mostrarLabel: true
        }),
    ]
});
