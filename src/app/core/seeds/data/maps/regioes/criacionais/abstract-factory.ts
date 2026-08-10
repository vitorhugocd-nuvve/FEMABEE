import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_ABSTRACT_FACTORY = new Mapa({
    id: "abstract-factory",
    nome: "Ilha da Abstract Factory",
    tipo: TipoMapa.Regional,
    padrao: "Abstract Factory",
    url: "maps/regioes/criacionais/abstract_factory.gif",
    tamanhoEmPx: {
        x: 288,
        y: 256
    },
    acoes: [
        new AcaoDoMapa({
            id: "raf-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-criacional",
            posicaoEmPx: { x: 144, y: 128 },
            mostrarLabel: true
        }),
    ]
});
