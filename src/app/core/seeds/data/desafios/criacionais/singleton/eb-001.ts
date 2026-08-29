import { EncontreBug } from "../../../../../models/desafios/encontre-bug/encontre-bug";
import { PerguntaBug } from "../../../../../models/desafios/encontre-bug/pergunta-bug";
import { RespostaBug } from "../../../../../models/desafios/encontre-bug/resposta-bug";
import { Arquivo } from "../../../../../models/desafios/encontre-bug/arquivo";
import { Dificuldade } from "../../../../../models/desafios/dificuldade";

export const DESAFIO_EB_SINGLETON_001 = new EncontreBug({
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
            enunciado: "Qual das alternativas descreve corretamente o problema deste código?",
            explicacao: "getInstance() não verifica se a instância já existe antes de criar uma nova — falta o \"if (instancia == null)\". Por isso, cada chamada cria um objeto novo, e \"a == b\" retorna false em App.java, quebrando a garantia do Singleton.",
            respostas: [
                new RespostaBug({ id: "pb2-r1", texto: "Não há problema, o código implementa o Singleton corretamente." }),
                new RespostaBug({ id: "pb2-r2", texto: "getInstance() cria uma nova instância a cada chamada, pois não verifica se \"instancia\" já existe.", correta: true }),
                new RespostaBug({ id: "pb2-r3", texto: "O construtor deveria ser público para simplificar o uso." }),
                new RespostaBug({ id: "pb2-r4", texto: "A classe deveria ter dois campos static em vez de um." }),
            ],
            arquivos: [
                new Arquivo({
                    id: "pb2-a1",
                    nome: "Contador.java",
                    linguagem: "java",
                    codigo:
`public class Contador {
    private static Contador instancia;

    private Contador() {}

    public static Contador getInstance() {
        instancia = new Contador();
        return instancia;
    }
}`
                }),
                new Arquivo({
                    id: "pb2-a2",
                    nome: "App.java",
                    linguagem: "java",
                    codigo:
`public class App {
    public static void main(String[] args) {
        Contador a = Contador.getInstance();
        Contador b = Contador.getInstance();

        System.out.println(a == b);
    }
}`
                }),
                new Arquivo({
                    id: "pb2-a3",
                    nome: "ContadorTest.java",
                    linguagem: "java",
                    codigo:
`public class ContadorTest {
    public static void main(String[] args) {
        Contador a = Contador.getInstance();
        Contador b = Contador.getInstance();

        assert a == b : "Deveria ser a mesma instância";
    }
}`
                }),
            ]
        }),
    ]
});
