import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_TEMPLATE_METHOD = new Mapa({
    id: "template-method",
    nome: "Ilha do Template Method",
    tipo: TipoMapa.Regional,
    padrao: "Template Method",
    url: "maps/regioes/comportamentais/TEMPLATE.gif",
    tamanhoEmPx: {
        x: 320,
        y: 448
    },
    acoes: [
        new AcaoDoMapa({
            id: "rtm-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-comportamental",
            posicaoEmPx: { x: 160, y: 224 },
            mostrarLabel: true
        }),
    ]
});
