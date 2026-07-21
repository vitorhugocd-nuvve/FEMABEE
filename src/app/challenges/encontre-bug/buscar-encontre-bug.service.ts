import { Injectable, signal } from "@angular/core";
import { EncontreBug } from "../../core/models/desafios/encontre-bug/encontre-bug";
import { Dificuldade } from "../../core/models/desafios/dificuldade";
import { PerguntaBug } from "../../core/models/desafios/encontre-bug/pergunta-bug";
import { Arquivo } from "../../core/models/desafios/encontre-bug/arquivo";
import { RespostaBug } from "../../core/models/desafios/encontre-bug/resposta-bug";

/** Serviço de busca do EncontreBug — substitua o signal por uma chamada HTTP real */
@Injectable()
export class BuscarEncontreBugService {
    public data = signal<EncontreBug | undefined>(new EncontreBug({
        id: "eb-singleton-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 1,
        padrao: "Singleton",
        perguntas: [
            new PerguntaBug({
                id: "pb1",
                enunciado: "Qual das alternativas descreve corretamente o problema deste código?",
                explicacao: "O construtor de Singleton é público. Isso permite criar novas instâncias com \"new Singleton()\", quebrando a garantia de uma única instância — como mostrado em App.java, \"a == b\" retorna false.",
                respostas: [
                    new RespostaBug({ id: "pb1-r1", texto: "Não há problema, o código implementa o Singleton corretamente." }),
                    new RespostaBug({ id: "pb1-r2", texto: "O construtor é público, permitindo criar múltiplas instâncias com \"new Singleton()\".", correta: true }),
                    new RespostaBug({ id: "pb1-r3", texto: "O método getInstance() não é thread-safe." }),
                    new RespostaBug({ id: "pb1-r4", texto: "A classe deveria implementar uma interface Cloneable." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb1-a1",
                        nome: "Singleton.java",
                        linguagem: "java",
                        codigo:
`public class Singleton {
    private static Singleton instancia;

    public Singleton() {
    }

    public static Singleton getInstance() {
        if (instancia == null) {
            instancia = new Singleton();
        }
        return instancia;
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a2",
                        nome: "App.java",
                        linguagem: "java",
                        codigo:
`public class App {
    public static void main(String[] args) {
        Singleton a = Singleton.getInstance();
        Singleton b = new Singleton();

        System.out.println(a == b);
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a3",
                        nome: "SingletonTest.java",
                        linguagem: "java",
                        codigo:
`public class SingletonTest {
    public static void main(String[] args) {
        Singleton a = Singleton.getInstance();
        Singleton b = Singleton.getInstance();

        assert a == b : "Deveria ser a mesma instância";
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a4",
                        nome: "Config.java",
                        linguagem: "java",
                        codigo:
`public class Config {
    private String ambiente = "producao";

    public String getAmbiente() {
        return ambiente;
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a5",
                        nome: "Main.java",
                        linguagem: "java",
                        codigo:
`public class Main {
    public static void main(String[] args) {
        App.main(args);
    }
}`
                    }),
                ]
            }),
            new PerguntaBug({
                id: "pb2",
                enunciado: "O que acontece quando esse código recebe um valor negativo?",
                explicacao: "Para valores negativos de n, o laço \"for\" nunca executa (pois \"1 <= -5\" é falso), então o método retorna 1 incorretamente em vez de tratar o caso inválido.",
                respostas: [
                    new RespostaBug({ id: "pb2-r1", texto: "O código lança uma exceção informando entrada inválida." }),
                    new RespostaBug({ id: "pb2-r2", texto: "O código entra em loop infinito." }),
                    new RespostaBug({ id: "pb2-r3", texto: "O laço nunca executa e o método retorna 1 incorretamente.", correta: true }),
                    new RespostaBug({ id: "pb2-r4", texto: "O código calcula o fatorial do valor absoluto de n." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb2-a1",
                        nome: "Fatorial.java",
                        linguagem: "java",
                        codigo:
`public class Fatorial {
    public static int calcular(int n) {
        int resultado = 1;
        for (int i = 1; i <= n; i++) {
            resultado *= i;
        }
        return resultado;
    }

    public static void main(String[] args) {
        System.out.println(calcular(-5));
    }
}`
                    }),
                ]
            }),
        ]
    }));
}
