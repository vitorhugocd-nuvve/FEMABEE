import { AcaoDoMapa } from "../../../../../models/map/acao-do-mapa";
import { Mapa } from "../../../../../models/map/mapa";
import { TipoAcao } from "../../../../../models/map/tipo-acao";
import { TipoMapa } from "../../../../../models/map/tipo-mapa";

export const REGIAO_VISITOR = new Mapa({
    id: "visitor",
    nome: "Ilha do Visitor",
    tipo: TipoMapa.Regional,
    padrao: "Visitor",
    url: "maps/regioes/comportamentais/VISITOR.gif",
    tamanhoEmPx: {
        x: 320,
        y: 448
    },
    acoes: [
        new AcaoDoMapa({
            id: "rvi-onibus-continental",
            titulo: "Voltar ao Continental",
            tipo: TipoAcao.Onibus,
            mapaDestinoId: "continental-comportamental",
            posicaoEmPx: { x: 160, y: 224 },
            mostrarLabel: true
        }),
    ]
});
