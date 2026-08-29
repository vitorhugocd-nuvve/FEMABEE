import { EncontrePares } from "../../../../../models/desafios/encontre-pares/encontre-pares";
import { Rodada } from "../../../../../models/desafios/encontre-pares/rodada";
import { Par } from "../../../../../models/desafios/encontre-pares/par";
import { Dificuldade } from "../../../../../models/desafios/dificuldade";

export const DESAFIO_EP_SINGLETON_001 = new EncontrePares({
    id: "ep-singleton-001",
    dificuldade: Dificuldade.Medio,
    grupo: "Criacionais",
    nivel: 2,
    padrao: "Singleton",
    rodadas: [
        new Rodada({
            id: "r1",
            pares: [
                new Par({ id: "r1p1", afirmacao: "Construtor privado", correspondencia: "Impede que código externo crie novas instâncias com \"new\"." }),
                new Par({ id: "r1p2", afirmacao: "getInstance()", correspondencia: "Método estático que devolve sempre a mesma instância da classe." }),
                new Par({ id: "r1p3", afirmacao: "Primeira chamada", correspondencia: "Momento em que a instância única é criada e guardada." }),
                new Par({ id: "r1p4", afirmacao: "Instância única", correspondencia: "O único objeto da classe que existe durante toda a execução do programa." }),
            ]
        }),
        new Rodada({
            id: "r2",
            pares: [
                new Par({ id: "r2p1", afirmacao: "Estado global", correspondencia: "Dado compartilhado que qualquer parte do sistema pode ler e alterar, dificultando rastrear mudanças." }),
                new Par({ id: "r2p2", afirmacao: "Testabilidade ruim", correspondencia: "Dificuldade de isolar ou substituir a instância única por um dublê de teste." }),
                new Par({ id: "r2p3", afirmacao: "Dependência escondida", correspondencia: "Quando uma classe usa getInstance() no meio do código sem deixar claro, pela assinatura, que depende de outra." }),
                new Par({ id: "r2p4", afirmacao: "Uso indiscriminado", correspondencia: "Criar um Singleton só porque parece mais fácil de acessar de qualquer lugar, sem uma necessidade real de instância única." }),
            ]
        }),
    ]
});
