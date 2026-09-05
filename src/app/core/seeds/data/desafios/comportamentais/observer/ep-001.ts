import { EncontrePares } from "../../../../../models/desafios/encontre-pares/encontre-pares";
import { Rodada } from "../../../../../models/desafios/encontre-pares/rodada";
import { Par } from "../../../../../models/desafios/encontre-pares/par";
import { Dificuldade } from "../../../../../models/desafios/dificuldade";

export const DESAFIO_EP_OBSERVER_001 = new EncontrePares({
    id: "ep-observer-001",
    dificuldade: Dificuldade.Medio,
    grupo: "Comportamentais",
    nivel: 2,
    padrao: "Observer",
    rodadas: [
        new Rodada({
            id: "r1",
            pares: [
                new Par({ id: "r1p1", afirmacao: "Subject (o Carteiro)", correspondencia: "Guarda a lista de assinantes e distribui a edição nova pra todos quando publica algo." }),
                new Par({ id: "r1p2", afirmacao: "Assinante (Observer)", correspondencia: "Interface comum implementada por quem quer receber as edições." }),
                new Par({ id: "r1p3", afirmacao: "inscrever() / desinscrever()", correspondencia: "Adicionam ou removem um assinante da lista de distribuição do Carteiro." }),
                new Par({ id: "r1p4", afirmacao: "distribuirParaTodos()", correspondencia: "Percorre a lista de assinantes chamando o método de recebimento de cada um." }),
            ]
        }),
        new Rodada({
            id: "r2",
            pares: [
                new Par({ id: "r2p1", afirmacao: "Um-para-muitos", correspondencia: "O tipo de relação que o Observer modela: um Subject, muitos assinantes dependentes dele." }),
                new Par({ id: "r2p2", afirmacao: "receberEdicao(edicao)", correspondencia: "O método que todo assinante implementa; é o que o Carteiro chama pra avisar da edição nova." }),
                new Par({ id: "r2p3", afirmacao: "Sem o Observer", correspondencia: "Quem publica precisaria chamar manualmente cada assinante, um por um, toda vez que uma edição saísse." }),
                new Par({ id: "r2p4", afirmacao: "Assinante concreto", correspondencia: "A classe real que implementa a interface e decide o que fazer com a edição — o Carteiro não sabe nem se importa." }),
            ]
        }),
    ]
});
