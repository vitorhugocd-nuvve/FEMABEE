import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_SINGLETON = new Mapa({
    id: "singleton",
    nome: "Ilha do Singleton",
    tipo: TipoMapa.Regional,
    padrao: "Singleton",
    url: "maps/regioes/criacionais/singleton.gif",
    tamanhoEmPx: {
        x: 288,
        y: 352
    },
    acoes: [
        new AcaoDoMapa({
            id: "rs-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-criacional",
            posicaoEmPx: { x: 144, y: 176 },
            mostrarLabel: true
        }),
    ]
});
