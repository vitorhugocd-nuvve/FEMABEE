import { Quiz } from "../../../../../models/desafios/quiz/quiz";
import { Pergunta } from "../../../../../models/desafios/quiz/pergunta";
import { Resposta } from "../../../../../models/desafios/quiz/resposta";
import { Dificuldade } from "../../../../../models/desafios/dificuldade";
import { TipoDesafio } from "../../../../../models/desafios/tipo-desafio";

export const DESAFIO_QUIZ_SINGLETON_002 = new Quiz({
    id: "quiz-singleton-002",
    dificuldade: Dificuldade.Dificil,
    padrao: "Singleton",
    grupo: "Criacionais",
    nivel: 3,
    tipo: TipoDesafio.PerguntasRespostas,
    perguntas: [
        new Pergunta({
            id: "p1",
            texto: "O que diferencia o Multiton do Singleton clássico?",
            repostas: [
                new Resposta({ id: "p1r1", texto: "O Multiton não tem construtor privado." }),
                new Resposta({ id: "p1r2", texto: "O Multiton guarda um registro de instâncias por chave, em vez de uma única instância global.", correta: true }),
                new Resposta({ id: "p1r3", texto: "O Multiton permite instâncias ilimitadas para a mesma chave." }),
                new Resposta({ id: "p1r4", texto: "O Multiton não pode ser implementado em Java." }),
            ]
        }),
        new Pergunta({
            id: "p2",
            texto: "Por que uma classe usada como chave num registro Multiton precisa sobrescrever equals() e hashCode()?",
            repostas: [
                new Resposta({ id: "p2r1", texto: "Para que o Map consiga reconhecer duas chaves com o mesmo conteúdo como a mesma chave, evitando instâncias duplicadas.", correta: true }),
                new Resposta({ id: "p2r2", texto: "Para tornar a classe imutável." }),
                new Resposta({ id: "p2r3", texto: "Porque toda classe em Java é obrigada a sobrescrever esses métodos." }),
                new Resposta({ id: "p2r4", texto: "Para permitir que a chave seja usada como chave primária em um banco de dados." }),
            ]
        }),
        new Pergunta({
            id: "p3",
            texto: "No Singleton Escopado, o que define quando uma instância deixa de ser \"a mesma\" para todo mundo?",
            repostas: [
                new Resposta({ id: "p3r1", texto: "O tamanho do objeto em memória." }),
                new Resposta({ id: "p3r2", texto: "A mudança de escopo — uma nova requisição, componente ou módulo passa a ter sua própria instância.", correta: true }),
                new Resposta({ id: "p3r3", texto: "O número de vezes que getInstance() foi chamado." }),
                new Resposta({ id: "p3r4", texto: "Nada muda; o Singleton Escopado sempre devolve a mesma instância pro programa inteiro." }),
            ]
        }),
        new Pergunta({
            id: "p4",
            texto: "O que as três variações — Singleton simples, Multiton e Singleton Escopado — têm em comum?",
            repostas: [
                new Resposta({ id: "p4r1", texto: "Todas escondem o construtor e garantem que quem pede a instância nunca cria uma nova sem passar por um ponto de acesso único.", correta: true }),
                new Resposta({ id: "p4r2", texto: "Todas exigem múltiplas instâncias simultâneas por padrão." }),
                new Resposta({ id: "p4r3", texto: "Todas dependem obrigatoriamente de um framework externo." }),
                new Resposta({ id: "p4r4", texto: "Todas armazenam a instância numa lista, não num campo ou mapa." }),
            ]
        }),
    ]
});
