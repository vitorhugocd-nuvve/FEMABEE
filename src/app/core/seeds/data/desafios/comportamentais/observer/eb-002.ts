import { EncontreBug } from "../../../../../models/desafios/encontre-bug/encontre-bug";
import { PerguntaBug } from "../../../../../models/desafios/encontre-bug/pergunta-bug";
import { RespostaBug } from "../../../../../models/desafios/encontre-bug/resposta-bug";
import { Arquivo } from "../../../../../models/desafios/encontre-bug/arquivo";
import { Dificuldade } from "../../../../../models/desafios/dificuldade";

export const DESAFIO_EB_OBSERVER_002 = new EncontreBug({
    id: "eb-observer-002",
    dificuldade: Dificuldade.Dificil,
    grupo: "Comportamentais",
    nivel: 3,
    padrao: "Observer",
    perguntas: [
        new PerguntaBug({
            id: "pb1",
            enunciado: "Esse código lança ConcurrentModificationException quando um assinante se desinscreve durante a distribuição. Qual é o problema?",
            explicacao: "desinscrever() remove um item da mesma lista \"assinantes\" que distribuirParaTodos() está percorrendo com um for-each — modificar uma lista enquanto ela é iterada lança ConcurrentModificationException. A correção comum é iterar sobre uma cópia da lista (ex.: \"new ArrayList<>(assinantes)\") ou usar um iterator explícito com remove().",
            respostas: [
                new RespostaBug({ id: "pb1-r1", texto: "A interface Assinante está mal definida." }),
                new RespostaBug({ id: "pb1-r2", texto: "distribuirParaTodos() está percorrendo a mesma lista que um assinante pode modificar (via desinscrever) durante a própria distribuição.", correta: true }),
                new RespostaBug({ id: "pb1-r3", texto: "O método receberEdicao() deveria ser \"static\"." }),
                new RespostaBug({ id: "pb1-r4", texto: "A lista de assinantes deveria ser um array de tamanho fixo." }),
            ],
            arquivos: [
                new Arquivo({
                    id: "pb1-a1",
                    nome: "CarteiroDaColmeia.java",
                    linguagem: "java",
                    codigo:
`public class CarteiroDaColmeia {
    private final List<Assinante> assinantes = new ArrayList<>();
    private String edicaoAtual;

    public void inscrever(Assinante assinante) {
        assinantes.add(assinante);
    }

    public void desinscrever(Assinante assinante) {
        assinantes.remove(assinante);
    }

    public void publicarNovaEdicao(String edicao) {
        this.edicaoAtual = edicao;
        distribuirParaTodos();
    }

    private void distribuirParaTodos() {
        for (Assinante a : assinantes) {
            a.receberEdicao(edicaoAtual);
        }
    }
}`
                }),
                new Arquivo({
                    id: "pb1-a2",
                    nome: "AssinanteTemporario.java",
                    linguagem: "java",
                    codigo:
`public class AssinanteTemporario implements Assinante {
    private final CarteiroDaColmeia carteiro;

    public AssinanteTemporario(CarteiroDaColmeia carteiro) {
        this.carteiro = carteiro;
    }

    @Override
    public void receberEdicao(String edicao) {
        System.out.println("Recebi uma edição só pra experimentar: " + edicao);
        carteiro.desinscrever(this);
    }
}`
                }),
            ]
        }),
        new PerguntaBug({
            id: "pb2",
            enunciado: "Uma abelha está recebendo cada edição da Gazeta duas vezes. Qual é o problema neste código?",
            explicacao: "inscrever() adiciona o assinante na lista sem checar se ele já estava lá. O código de App.java chama inscrever() duas vezes pra mesma AbelhaOperaria (por engano, ex.: um clique duplo no botão de assinar), então ela entra duas vezes na lista — e distribuirParaTodos() chama receberEdicao() nela duas vezes por edição.",
            respostas: [
                new RespostaBug({ id: "pb2-r1", texto: "inscrever() adiciona o assinante sem verificar se ele já está na lista, e App.java chama inscrever() duas vezes pro mesmo assinante.", correta: true }),
                new RespostaBug({ id: "pb2-r2", texto: "distribuirParaTodos() está chamando receberEdicao() duas vezes por iteração." }),
                new RespostaBug({ id: "pb2-r3", texto: "A lista assinantes deveria ser reiniciada a cada publicarNovaEdicao()." }),
                new RespostaBug({ id: "pb2-r4", texto: "A interface Assinante deveria ter dois métodos de recebimento." }),
            ],
            arquivos: [
                new Arquivo({
                    id: "pb2-a1",
                    nome: "CarteiroDaColmeia.java",
                    linguagem: "java",
                    codigo:
`public class CarteiroDaColmeia {
    private final List<Assinante> assinantes = new ArrayList<>();
    private String edicaoAtual;

    public void inscrever(Assinante assinante) {
        assinantes.add(assinante);
    }

    public void publicarNovaEdicao(String edicao) {
        this.edicaoAtual = edicao;
        distribuirParaTodos();
    }

    private void distribuirParaTodos() {
        for (Assinante a : assinantes) {
            a.receberEdicao(edicaoAtual);
        }
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
        CarteiroDaColmeia carteiro = new CarteiroDaColmeia();
        AbelhaOperaria operaria = new AbelhaOperaria();

        carteiro.inscrever(operaria);
        carteiro.inscrever(operaria); // clique duplo no botão "Assinar"

        carteiro.publicarNovaEdicao("Edição 1");
        // "Operária leu a edição: Edição 1" é impresso DUAS vezes
    }
}`
                }),
            ]
        }),
    ]
});
