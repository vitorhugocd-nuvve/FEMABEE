import { CompleteTexto } from "../../../../../models/desafios/complete-texto/complete-texto";
import { Texto } from "../../../../../models/desafios/complete-texto/texto";
import { Dificuldade } from "../../../../../models/desafios/dificuldade";

export const DESAFIO_CT_OBSERVER_001 = new CompleteTexto({
    id: "ct-observer-001",
    dificuldade: Dificuldade.Facil,
    grupo: "Comportamentais",
    nivel: 1,
    padrao: "Observer",
    textos: [
        new Texto({
            id: "t1",
            texto: "O padrão {{1}} define uma dependência {{2}}: quando o {{3}} muda de estado, todos os assinantes inscritos são avisados.",
            opcoes: ["Observer", "um-para-muitos", "Subject", "Singleton", "um-para-um", "Cliente"],
            respostas: ["Observer", "um-para-muitos", "Subject"]
        }),
        new Texto({
            id: "t2",
            texto: "Cada assinante implementa uma {{1}} em comum, geralmente com um método chamado {{2}}, que o Carteiro chama pra avisar sobre a edição nova.",
            opcoes: ["interface", "classe final", "receberEdicao", "construir", "anotação", "destruir"],
            respostas: ["interface", "receberEdicao"]
        }),
        new Texto({
            id: "t3",
            texto: "Os métodos {{1}} e {{2}} permitem que um assinante entre ou saia da lista de distribuição do Carteiro a qualquer momento.",
            opcoes: ["inscrever", "desinscrever", "notificar", "clonar", "construir", "serializar"],
            respostas: ["inscrever", "desinscrever"]
        }),
    ]
});
