import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_FLYWEIGHT = new Mapa({
    id: "flyweight",
    nome: "Ilha do Flyweight",
    tipo: TipoMapa.Regional,
    padrao: "Flyweight",
    url: "maps/regioes/estruturais/flyweight.gif",
    tamanhoEmPx: {
        x: 336,
        y: 256
    },
    acoes: [
        new AcaoDoMapa({
            id: "rfl-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-estrutural",
            posicaoEmPx: { x: 168, y: 128 },
            mostrarLabel: true
        }),
    ]
});
