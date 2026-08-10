import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_INTERPRETER = new Mapa({
    id: "interpreter",
    nome: "Ilha do Interpreter",
    tipo: TipoMapa.Regional,
    padrao: "Interpreter",
    url: "maps/regioes/comportamentais/INTERPRETER.gif",
    tamanhoEmPx: {
        x: 352,
        y: 384
    },
    acoes: [
        new AcaoDoMapa({
            id: "rin-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-comportamental",
            posicaoEmPx: { x: 176, y: 192 },
            mostrarLabel: true
        }),
    ]
});
