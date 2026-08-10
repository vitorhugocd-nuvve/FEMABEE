import { AcaoDoMapa } from "../../../models/map/acao-do-mapa";
import { Mapa } from "../../../models/map/mapa";
import { TipoAcao } from "../../../models/map/tipo-acao";
import { TipoMapa } from "../../../models/map/tipo-mapa";

export const ID_MAPA_INICIAL = "mundi";

export const MAPA_MUNDI = new Mapa({
    id: ID_MAPA_INICIAL,
    nome: "Mundi",
    tipo: TipoMapa.Mundi,
    padrao: "Mundo",
    url: "/maps/mundi.gif",
    tamanhoEmPx: {
        x: 512,
        y: 400
    },
    acoes: [
        new AcaoDoMapa({
            id: "m-aeroporto-estrutural",
            titulo: "Continente Estrutural",
            tipo: TipoAcao.Aviao,
            mapaDestinoId: "continental-estrutural",
            posicaoEmPx: { x: 192, y: 272 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "m-aeroporto-criacional",
            titulo: "Continente Criacional",
            tipo: TipoAcao.Aviao,
            mapaDestinoId: "continental-criacional",
            posicaoEmPx: { x: 112, y: 112 },
            mostrarLabel: true
        }),
        new AcaoDoMapa({
            id: "m-aeroporto-comportamental",
            titulo: "Continente Comportamental",
            tipo: TipoAcao.Aviao,
            mapaDestinoId: "continental-comportamental",
            posicaoEmPx: { x: 352, y: 192 },
            mostrarLabel: true
        }),
    ]
});
