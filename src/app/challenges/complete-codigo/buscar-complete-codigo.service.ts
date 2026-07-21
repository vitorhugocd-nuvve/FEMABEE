import { Injectable, signal } from "@angular/core";
import { CompleteCodigo } from "../../core/models/desafios/complete-codigo/complete-codigo";
import { Dificuldade } from "../../core/models/desafios/dificuldade";
import { CodigoIncompleto } from "../../core/models/desafios/complete-codigo/codigo-incompleto";
import { Trecho } from "../../core/models/desafios/complete-codigo/trecho";

/** Serviço de busca do CompleteCodigo — substitua o signal por uma chamada HTTP real */
@Injectable()
export class BuscarCompleteCodigoService {
    public data = signal<CompleteCodigo | undefined>(new CompleteCodigo({
        id: "cc-padroes-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 1,
        padrao: "Singleton & Builder",
        codigos: [
            new CodigoIncompleto({
                id: "cc1",
                arquivo: "Singleton.java",
                linguagem: "java",
                respostaCorretaId: "cc1-t1",
                explicacao: "getInstance() precisa checar se a instância ainda não existe antes de criá-la. Sem o \"if (instancia == null)\", cada chamada criaria uma instância nova, quebrando a garantia do Singleton.",
                template:
`public class Singleton {
    private static Singleton instancia;

    private Singleton() {}

    public static Singleton getInstance() {
{{1}}
        return instancia;
    }
}`,
                opcoes: [
                    new Trecho({ id: "cc1-t1", codigo: `        if (instancia == null) {\n            instancia = new Singleton();\n        }` }),
                    new Trecho({ id: "cc1-t2", codigo: `        instancia = new Singleton();` }),
                    new Trecho({ id: "cc1-t3", codigo: `        if (instancia != null) {\n            instancia = new Singleton();\n        }` }),
                    new Trecho({ id: "cc1-t4", codigo: `        instancia = getInstance();` }),
                ]
            }),
            new CodigoIncompleto({
                id: "cc2",
                arquivo: "PizzaBuilder.java",
                linguagem: "java",
                respostaCorretaId: "cc2-t1",
                explicacao: "Métodos fluentes de um Builder precisam retornar \"this\" para permitir encadear chamadas (ex.: builder.comTamanho(\"G\").comQueijoExtra()). Sem isso, a cadeia de chamadas quebra.",
                template:
`public class PizzaBuilder {
    private String tamanho;
    private boolean queijoExtra;

    public PizzaBuilder comTamanho(String tamanho) {
        this.tamanho = tamanho;
{{1}}
    }

    public Pizza build() {
        return new Pizza(tamanho, queijoExtra);
    }
}`,
                opcoes: [
                    new Trecho({ id: "cc2-t1", codigo: `        return this;` }),
                    new Trecho({ id: "cc2-t2", codigo: `        return null;` }),
                    new Trecho({ id: "cc2-t3", codigo: `        return new PizzaBuilder();` }),
                    new Trecho({ id: "cc2-t4", codigo: `        // nada a retornar` }),
                ]
            }),
        ]
    }));
}
