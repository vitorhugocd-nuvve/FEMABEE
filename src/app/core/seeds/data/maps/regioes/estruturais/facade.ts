import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_FACADE = new Mapa({
    id: "facade",
    nome: "Ilha da Facade",
    tipo: TipoMapa.Regional,
    padrao: "Facade",
    url: "maps/regioes/estruturais/facade.gif",
    tamanhoEmPx: {
        x: 464,
        y: 400
    },
    acoes: [
        new AcaoDoMapa({
            id: "rfa-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-estrutural",
            posicaoEmPx: { x: 232, y: 200 },
            mostrarLabel: true
        }),
    ]
});
