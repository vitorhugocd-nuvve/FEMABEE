import { Quiz } from "../../../../../models/desafios/quiz/quiz";
import { Pergunta } from "../../../../../models/desafios/quiz/pergunta";
import { Resposta } from "../../../../../models/desafios/quiz/resposta";
import { Dificuldade } from "../../../../../models/desafios/dificuldade";
import { TipoDesafio } from "../../../../../models/desafios/tipo-desafio";

export const DESAFIO_QUIZ_OBSERVER_001 = new Quiz({
    id: "quiz-observer-001",
    dificuldade: Dificuldade.Facil,
    padrao: "Observer",
    grupo: "Comportamentais",
    nivel: 1,
    tipo: TipoDesafio.PerguntasRespostas,
    perguntas: [
        new Pergunta({
            id: "p1",
            texto: "Qual das afirmações abaixo descreve melhor o padrão Observer?",
            repostas: [
                new Resposta({ id: "p1r1", texto: "Garante que uma classe tenha apenas uma instância." }),
                new Resposta({ id: "p1r2", texto: "Define uma dependência um-para-muitos: quando o Subject muda de estado, todos os observadores inscritos são avisados automaticamente.", correta: true }),
                new Resposta({ id: "p1r3", texto: "Separa a construção de um objeto complexo de sua representação." }),
                new Resposta({ id: "p1r4", texto: "Converte a interface de uma classe em outra interface esperada pelo cliente." }),
            ]
        }),
        new Pergunta({
            id: "p2",
            texto: "No exemplo do Carteiro da Colmeia, quem chama o método receberEdicao() de cada assinante?",
            repostas: [
                new Resposta({ id: "p2r1", texto: "Cada assinante, verificando periodicamente se saiu uma edição nova." }),
                new Resposta({ id: "p2r2", texto: "O CarteiroDaColmeia (o Subject), ao distribuir a edição nova pra todos os inscritos.", correta: true }),
                new Resposta({ id: "p2r3", texto: "Uma classe fábrica externa que cria os assinantes." }),
                new Resposta({ id: "p2r4", texto: "O sistema operacional, via interrupção de hardware." }),
            ]
        }),
        new Pergunta({
            id: "p3",
            texto: "Qual a vantagem de usar inscrever(assinante) em vez do carteiro conhecer cada abelha assinante pelo nome, direto no código?",
            repostas: [
                new Resposta({ id: "p3r1", texto: "O código fica mais rápido em tempo de execução." }),
                new Resposta({ id: "p3r2", texto: "Uma abelha nova pode assinar sem exigir nenhuma mudança no código do CarteiroDaColmeia — só implementar a interface e chamar inscrever().", correta: true }),
                new Resposta({ id: "p3r3", texto: "Elimina a necessidade de qualquer tipo de interface." }),
                new Resposta({ id: "p3r4", texto: "Garante que as abelhas recebam a edição em ordem alfabética de nome." }),
            ]
        }),
        new Pergunta({
            id: "p4",
            texto: "O que acontece se o CarteiroDaColmeia publicar uma edição nova, mas esquecer de chamar distribuirParaTodos()?",
            repostas: [
                new Resposta({ id: "p4r1", texto: "Todos os assinantes são removidos da lista automaticamente." }),
                new Resposta({ id: "p4r2", texto: "Os assinantes continuam inscritos normalmente, mas nenhum deles recebe a edição nova.", correta: true }),
                new Resposta({ id: "p4r3", texto: "O programa lança uma exceção imediatamente." }),
                new Resposta({ id: "p4r4", texto: "A edição é entregue em dobro na próxima publicação." }),
            ]
        }),
    ]
});
