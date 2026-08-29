import { CompleteTexto } from "../../../../../models/desafios/complete-texto/complete-texto";
import { Texto } from "../../../../../models/desafios/complete-texto/texto";
import { Dificuldade } from "../../../../../models/desafios/dificuldade";

export const DESAFIO_CT_SINGLETON_001 = new CompleteTexto({
    id: "ct-singleton-001",
    dificuldade: Dificuldade.Medio,
    grupo: "Criacionais",
    nivel: 1,
    padrao: "Singleton",
    textos: [
        new Texto({
            id: "t1",
            texto: "O padrão {{1}} garante que uma classe possua apenas {{2}} instância e fornece um {{3}} de acesso a ela.",
            opcoes: ["ponto global", "uma única", "Singleton", "Factory", "duas", "método privado"],
            respostas: ["Singleton", "uma única", "ponto global"]
        }),
        new Texto({
            id: "t2",
            texto: "Para implementar o Singleton, o {{1}} deve ser privado para impedir que objetos externos criem novas instâncias usando o operador {{2}}.",
            opcoes: ["construtor", "destrutor", "new", "delete", "interface", "método"],
            respostas: ["construtor", "new"]
        }),
        new Texto({
            id: "t3",
            texto: "Se cada parte do sistema pudesse criar sua própria {{1}} da classe em vez de usar getInstance(), as informações ficariam {{2}} entre as partes, mesmo representando a mesma coisa.",
            opcoes: ["cópia", "fora de sincronia", "herança", "sincronizadas", "interface", "idênticas"],
            respostas: ["cópia", "fora de sincronia"]
        }),
    ]
});
