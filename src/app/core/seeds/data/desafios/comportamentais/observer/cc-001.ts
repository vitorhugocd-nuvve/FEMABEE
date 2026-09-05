import { CompleteCodigo } from "../../../../../models/desafios/complete-codigo/complete-codigo";
import { CodigoIncompleto } from "../../../../../models/desafios/complete-codigo/codigo-incompleto";
import { Trecho } from "../../../../../models/desafios/complete-codigo/trecho";
import { Dificuldade } from "../../../../../models/desafios/dificuldade";

export const DESAFIO_CC_OBSERVER_001 = new CompleteCodigo({
    id: "cc-observer-001",
    dificuldade: Dificuldade.Medio,
    grupo: "Comportamentais",
    nivel: 2,
    padrao: "Observer",
    codigos: [
        new CodigoIncompleto({
            id: "cc1",
            arquivo: "PainelDeAssinaturas.java",
            linguagem: "java",
            respostaCorretaId: "cc1-t1",
            explicacao: "No modelo Pull, o Carteiro só avisa que algo mudou — quem busca o dado de volta é o próprio assinante, chamando um método do Carteiro (aqui, getEdicaoAtual()) pra pegar exatamente o que precisa.",
            template:
`public class PainelDeAssinaturas implements AssinantePull {
    @Override
    public void receberAviso(CarteiroDaColmeia carteiro) {
{{1}}
        System.out.println("Nova edição: " + edicao);
    }
}`,
            opcoes: [
                new Trecho({ id: "cc1-t1", codigo: `        String edicao = carteiro.getEdicaoAtual();` }),
                new Trecho({ id: "cc1-t2", codigo: `        String edicao = this.getEdicaoAtual();` }),
                new Trecho({ id: "cc1-t3", codigo: `        String edicao = "Edição 1";` }),
                new Trecho({ id: "cc1-t4", codigo: `        carteiro.setEdicaoAtual(edicao);` }),
            ]
        }),
        new CodigoIncompleto({
            id: "cc2",
            arquivo: "AssinanteVip.java",
            linguagem: "java",
            respostaCorretaId: "cc2-t1",
            explicacao: "O assinante recebeu um objeto EdicaoDaGazeta (não um valor solto), então pra saber se a edição é especial ele precisa checar o campo \"ehEdicaoEspecial\" desse objeto — não o número da edição, nem o método errado.",
            template:
`public class AssinanteVip implements Assinante {
    @Override
    public void receberEdicao(EdicaoDaGazeta evento) {
{{1}}
            System.out.println("Edição especial chegou: " + evento.numeroDaEdicao);
        }
    }
}`,
            opcoes: [
                new Trecho({ id: "cc2-t1", codigo: `        if (evento.ehEdicaoEspecial) {` }),
                new Trecho({ id: "cc2-t2", codigo: `        if (evento.numeroDaEdicao) {` }),
                new Trecho({ id: "cc2-t3", codigo: `        if (!evento.ehEdicaoEspecial) {` }),
                new Trecho({ id: "cc2-t4", codigo: `        if (evento.getEdicaoAtual()) {` }),
            ]
        }),
    ]
});
