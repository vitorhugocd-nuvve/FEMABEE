import { CompleteCodigo } from "../../../../../models/desafios/complete-codigo/complete-codigo";
import { CodigoIncompleto } from "../../../../../models/desafios/complete-codigo/codigo-incompleto";
import { Trecho } from "../../../../../models/desafios/complete-codigo/trecho";
import { Dificuldade } from "../../../../../models/desafios/dificuldade";

export const DESAFIO_CC_SINGLETON_001 = new CompleteCodigo({
    id: "cc-singleton-001",
    dificuldade: Dificuldade.Dificil,
    grupo: "Criacionais",
    nivel: 2,
    padrao: "Singleton",
    codigos: [
        new CodigoIncompleto({
            id: "cc1",
            arquivo: "CentralDeRadio.java",
            linguagem: "java",
            respostaCorretaId: "cc1-t1",
            explicacao: "getInstance(chave) precisa checar se o registro já tem uma instância pra aquela chave antes de criar uma nova. Sem o \"if (!registro.containsKey(chave))\", cada chamada substituiria a instância guardada, quebrando a garantia de uma instância por chave.",
            template:
`public class CentralDeRadio {
    private static final Map<String, CentralDeRadio> registro = new HashMap<>();

    private CentralDeRadio() {}

    public static CentralDeRadio getInstance(String chave) {
{{1}}
        return registro.get(chave);
    }
}`,
            opcoes: [
                new Trecho({ id: "cc1-t1", codigo: `        if (!registro.containsKey(chave)) {\n            registro.put(chave, new CentralDeRadio());\n        }` }),
                new Trecho({ id: "cc1-t2", codigo: `        registro.put(chave, new CentralDeRadio());` }),
                new Trecho({ id: "cc1-t3", codigo: `        if (registro.containsKey(chave)) {\n            registro.put(chave, new CentralDeRadio());\n        }` }),
                new Trecho({ id: "cc1-t4", codigo: `        return new CentralDeRadio();` }),
            ]
        }),
        new CodigoIncompleto({
            id: "cc2",
            arquivo: "RegistroDeConexoes.java",
            linguagem: "java",
            respostaCorretaId: "cc2-t1",
            explicacao: "getInstance(banco) usa containsKey(), put() e get() — métodos de Map. O campo precisa ser um Map<String, RegistroDeConexoes> estático (compartilhado entre todas as chamadas, já que o método é static) e final (a referência ao mapa não muda, só o conteúdo dele).",
            template:
`public class RegistroDeConexoes {
{{1}}

    private RegistroDeConexoes() {}

    public static RegistroDeConexoes getInstance(String banco) {
        if (!registro.containsKey(banco)) {
            registro.put(banco, new RegistroDeConexoes());
        }
        return registro.get(banco);
    }
}`,
            opcoes: [
                new Trecho({ id: "cc2-t1", codigo: `    private static final Map<String, RegistroDeConexoes> registro = new HashMap<>();` }),
                new Trecho({ id: "cc2-t2", codigo: `    private static RegistroDeConexoes instancia = new RegistroDeConexoes();` }),
                new Trecho({ id: "cc2-t3", codigo: `    private Map<String, RegistroDeConexoes> registro = new HashMap<>();` }),
                new Trecho({ id: "cc2-t4", codigo: `    private static final List<RegistroDeConexoes> registro = new ArrayList<>();` }),
            ]
        }),
    ]
});
