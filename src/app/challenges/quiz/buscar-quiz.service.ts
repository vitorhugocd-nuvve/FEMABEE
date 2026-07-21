import { Injectable, signal } from "@angular/core";
import { Quiz } from "../../core/models/desafios/quiz/quiz";
import { Dificuldade } from "../../core/models/desafios/dificuldade";
import { TipoDesafio } from "../../core/models/desafios/tipo-desafio";
import { Pergunta } from "../../core/models/desafios/quiz/pergunta";
import { Resposta } from "../../core/models/desafios/quiz/resposta";

/** Serviço de busca do Quiz — substitua o signal por uma chamada HTTP real */
@Injectable()
export class BuscarQuizService {
    public data = signal<Quiz | undefined>(new Quiz({
        id: "quiz-singleton-001",
        dificuldade: Dificuldade.Medio,
        padrao: "Singleton",
        grupo: "Criacionais",
        nivel: 1,
        tipo: TipoDesafio.PerguntasRespostas,
        perguntas: [
            new Pergunta({
                id: "p1",
                texto: "Qual das afirmações abaixo descreve melhor o padrão Singleton?",
                repostas: [
                    new Resposta({ id: "p1r1", texto: "Permite que múltiplas instâncias de uma classe coexistam, sincronizando seu estado." }),
                    new Resposta({ id: "p1r2", texto: "Garante que uma classe tenha apenas uma instância e fornece um ponto global de acesso.", correta: true }),
                    new Resposta({ id: "p1r3", texto: "Separa a construção de um objeto complexo de sua representação." }),
                    new Resposta({ id: "p1r4", texto: "Define uma interface para criar objetos sem especificar a classe concreta." }),
                ]
            }),
            new Pergunta({
                id: "p2",
                texto: "Em qual situação o uso do Singleton é mais adequado?",
                repostas: [
                    new Resposta({ id: "p2r1", texto: "Quando você precisa criar muitos objetos do mesmo tipo rapidamente." }),
                    new Resposta({ id: "p2r2", texto: "Quando a ordem de criação dos objetos importa." }),
                    new Resposta({ id: "p2r3", texto: "Quando um recurso compartilhado (ex.: conexão com banco) deve ter apenas um ponto de acesso.", correta: true }),
                    new Resposta({ id: "p2r4", texto: "Quando você deseja desacoplar a criação de um objeto de sua utilização." }),
                ]
            }),
            new Pergunta({
                id: "p3",
                texto: "Qual é o maior risco de usar o Singleton de forma indiscriminada?",
                repostas: [
                    new Resposta({ id: "p3r1", texto: "Aumentar desnecessariamente o número de classes no projeto." }),
                    new Resposta({ id: "p3r2", texto: "Dificultar a serialização de objetos." }),
                    new Resposta({ id: "p3r3", texto: "Introduzir estado global, tornando o código difícil de testar e manter.", correta: true }),
                    new Resposta({ id: "p3r4", texto: "Tornar a interface de criação de objetos mais complexa." }),
                ]
            }),
            new Pergunta({
                id: "p4",
                texto: "Como o Singleton garante que apenas uma instância seja criada em ambientes multithread?",
                repostas: [
                    new Resposta({ id: "p4r1", texto: "Usando herança para restringir subclasses." }),
                    new Resposta({ id: "p4r2", texto: "Com double-checked locking ou inicialização por eager loading.", correta: true }),
                    new Resposta({ id: "p4r3", texto: "Criando uma interface pública para o construtor." }),
                    new Resposta({ id: "p4r4", texto: "Definindo o construtor como público e final." }),
                ]
            }),
        ]
    }));
}
