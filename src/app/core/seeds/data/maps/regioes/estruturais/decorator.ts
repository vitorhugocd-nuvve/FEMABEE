import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_DECORATOR = new Mapa({
    id: "decorator",
    nome: "Ilha do Decorator",
    tipo: TipoMapa.Regional,
    padrao: "Decorator",
    url: "maps/regioes/estruturais/decorator.gif",
    tamanhoEmPx: {
        x: 240,
        y: 368
    },
    acoes: [
        new AcaoDoMapa({
            id: "rde-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-estrutural",
            posicaoEmPx: { x: 120, y: 184 },
            mostrarLabel: true
        }),
    ]
});
