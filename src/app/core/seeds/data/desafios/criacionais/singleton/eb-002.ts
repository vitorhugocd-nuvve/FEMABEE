import { EncontreBug } from "../../../../../models/desafios/encontre-bug/encontre-bug";
import { PerguntaBug } from "../../../../../models/desafios/encontre-bug/pergunta-bug";
import { RespostaBug } from "../../../../../models/desafios/encontre-bug/resposta-bug";
import { Arquivo } from "../../../../../models/desafios/encontre-bug/arquivo";
import { Dificuldade } from "../../../../../models/desafios/dificuldade";

export const DESAFIO_EB_SINGLETON_002 = new EncontreBug({
    id: "eb-singleton-002",
    dificuldade: Dificuldade.Dificil,
    grupo: "Criacionais",
    nivel: 3,
    padrao: "Singleton",
    perguntas: [
        new PerguntaBug({
            id: "pb1",
            enunciado: "Esse registro de instâncias por chave tem um bug. Qual é o problema?",
            explicacao: "getInstance(chave) cria uma nova CentralDeRadio e faz put() incondicionalmente, sem checar antes se o registro já tinha uma instância pra aquela chave. Por isso, cada chamada substitui a instância anterior — \"a == b\" retorna false em App.java, quebrando a garantia de uma instância por chave.",
            respostas: [
                new RespostaBug({ id: "pb1-r1", texto: "Não há problema, cada chave sempre aponta pra própria instância." }),
                new RespostaBug({ id: "pb1-r2", texto: "getInstance() cria e substitui a instância da chave a cada chamada, em vez de reaproveitar a que já existe no registro.", correta: true }),
                new RespostaBug({ id: "pb1-r3", texto: "O Map deveria ser uma List para permitir múltiplas instâncias por chave." }),
                new RespostaBug({ id: "pb1-r4", texto: "O construtor deveria ser público para permitir criar instâncias fora da classe." }),
            ],
            arquivos: [
                new Arquivo({
                    id: "pb1-a1",
                    nome: "CentralDeRadio.java",
                    linguagem: "java",
                    codigo:
`public class CentralDeRadio {
    private static final Map<String, CentralDeRadio> registro = new HashMap<>();

    private CentralDeRadio() {}

    public static CentralDeRadio getInstance(String chave) {
        CentralDeRadio nova = new CentralDeRadio();
        registro.put(chave, nova);
        return registro.get(chave);
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
        CentralDeRadio a = CentralDeRadio.getInstance("colmeia-norte");
        CentralDeRadio b = CentralDeRadio.getInstance("colmeia-norte");

        System.out.println(a == b);
    }
}`
                }),
            ]
        }),
        new PerguntaBug({
            id: "pb2",
            enunciado: "Esse registro usa uma classe própria como chave. Qual o problema ao buscar a mesma colmeia duas vezes?",
            explicacao: "Sem equals()/hashCode() sobrescritos, o HashMap usa a identidade padrão de objeto pra comparar chaves — cada \"new ChaveColmeia(\"norte\")\" é considerado diferente do outro, mesmo tendo o mesmo \"nome\" por dentro. Por isso o registro nunca encontra a chave já existente e cria uma nova instância a cada chamada.",
            respostas: [
                new RespostaBug({ id: "pb2-r1", texto: "Não há problema, o Map sempre compara o conteúdo das chaves." }),
                new RespostaBug({ id: "pb2-r2", texto: "ChaveColmeia não sobrescreve equals()/hashCode(), então o Map trata as duas instâncias de \"norte\" como chaves diferentes e cria duas instâncias de CentralDeRadio.", correta: true }),
                new RespostaBug({ id: "pb2-r3", texto: "O construtor de ChaveColmeia deveria ser privado." }),
                new RespostaBug({ id: "pb2-r4", texto: "CentralDeRadio deveria implementar Comparable." }),
            ],
            arquivos: [
                new Arquivo({
                    id: "pb2-a1",
                    nome: "ChaveColmeia.java",
                    linguagem: "java",
                    codigo:
`public class ChaveColmeia {
    private final String nome;

    public ChaveColmeia(String nome) {
        this.nome = nome;
    }
    // equals() e hashCode() não foram sobrescritos
}`
                }),
                new Arquivo({
                    id: "pb2-a2",
                    nome: "CentralDeRadio.java",
                    linguagem: "java",
                    codigo:
`public class CentralDeRadio {
    private static final Map<ChaveColmeia, CentralDeRadio> registro = new HashMap<>();

    private CentralDeRadio() {}

    public static CentralDeRadio getInstance(ChaveColmeia chave) {
        if (!registro.containsKey(chave)) {
            registro.put(chave, new CentralDeRadio());
        }
        return registro.get(chave);
    }
}`
                }),
                new Arquivo({
                    id: "pb2-a3",
                    nome: "App.java",
                    linguagem: "java",
                    codigo:
`public class App {
    public static void main(String[] args) {
        CentralDeRadio a = CentralDeRadio.getInstance(new ChaveColmeia("norte"));
        CentralDeRadio b = CentralDeRadio.getInstance(new ChaveColmeia("norte"));

        System.out.println(a == b);
    }
}`
                }),
            ]
        }),
    ]
});
