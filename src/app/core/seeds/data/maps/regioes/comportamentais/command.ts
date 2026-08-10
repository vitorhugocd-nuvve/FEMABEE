import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_COMMAND = new Mapa({
    id: "command",
    nome: "Ilha do Command",
    tipo: TipoMapa.Regional,
    padrao: "Command",
    url: "maps/regioes/comportamentais/COMMAND.gif",
    tamanhoEmPx: {
        x: 432,
        y: 320
    },
    acoes: [
        new AcaoDoMapa({
            id: "rcm-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-comportamental",
            posicaoEmPx: { x: 216, y: 160 },
            mostrarLabel: true
        }),
    ]
});
