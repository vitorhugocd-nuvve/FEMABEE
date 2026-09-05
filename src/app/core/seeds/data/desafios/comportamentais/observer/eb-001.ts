import { EncontreBug } from "../../../../../models/desafios/encontre-bug/encontre-bug";
import { PerguntaBug } from "../../../../../models/desafios/encontre-bug/pergunta-bug";
import { RespostaBug } from "../../../../../models/desafios/encontre-bug/resposta-bug";
import { Arquivo } from "../../../../../models/desafios/encontre-bug/arquivo";
import { Dificuldade } from "../../../../../models/desafios/dificuldade";

export const DESAFIO_EB_OBSERVER_001 = new EncontreBug({
    id: "eb-observer-001",
    dificuldade: Dificuldade.Medio,
    grupo: "Comportamentais",
    nivel: 2,
    padrao: "Observer",
    perguntas: [
        new PerguntaBug({
            id: "pb1",
            enunciado: "A AbelhaOperaria nunca recebe a Gazeta, mesmo depois de publicada uma edição nova. Qual é o problema neste código?",
            explicacao: "publicarNovaEdicao() atualiza o campo \"edicaoAtual\" mas nunca chama distribuirParaTodos() — os assinantes continuam inscritos corretamente, mas simplesmente nunca são avisados da edição nova.",
            respostas: [
                new RespostaBug({ id: "pb1-r1", texto: "A AbelhaOperaria não implementa a interface Assinante corretamente." }),
                new RespostaBug({ id: "pb1-r2", texto: "publicarNovaEdicao() nunca chama distribuirParaTodos() após atualizar o estado.", correta: true }),
                new RespostaBug({ id: "pb1-r3", texto: "A lista de assinantes foi declarada como Set em vez de List." }),
                new RespostaBug({ id: "pb1-r4", texto: "O método inscrever() está sendo chamado antes de instanciar o CarteiroDaColmeia." }),
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

    public void publicarNovaEdicao(String edicao) {
        this.edicaoAtual = edicao;
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
                    nome: "AbelhaOperaria.java",
                    linguagem: "java",
                    codigo:
                        `public class AbelhaOperaria implements Assinante {
    @Override
    public void receberEdicao(String edicao) {
        System.out.println("Operária leu a edição: " + edicao);
    }
}`
                }),
                new Arquivo({
                    id: "pb1-a3",
                    nome: "App.java",
                    linguagem: "java",
                    codigo:
                        `public class App {
    public static void main(String[] args) {
        CarteiroDaColmeia carteiro = new CarteiroDaColmeia();
        carteiro.inscrever(new AbelhaOperaria());
        carteiro.publicarNovaEdicao("Edição 1");
    }
}`
                }),
            ]
        }),
        new PerguntaBug({
            id: "pb2",
            enunciado: "Uma abelha nova nunca recebe a Gazeta, mesmo tendo assinado. Qual é o problema neste código?",
            explicacao: "inscrever() recebe o assinante mas nunca o adiciona à lista \"assinantes\" — ele nunca entra na lista que distribuirParaTodos() percorre, então jamais será avisado de nenhuma edição.",
            respostas: [
                new RespostaBug({ id: "pb2-r1", texto: "inscrever() não adiciona o assinante recebido à lista assinantes.", correta: true }),
                new RespostaBug({ id: "pb2-r2", texto: "publicarNovaEdicao() deveria chamar inscrever() internamente." }),
                new RespostaBug({ id: "pb2-r3", texto: "A interface Assinante está definida com o método errado." }),
                new RespostaBug({ id: "pb2-r4", texto: "distribuirParaTodos() deveria ser chamado antes de definir edicaoAtual." }),
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
        carteiro.inscrever(new AbelhaOperaria());
        carteiro.publicarNovaEdicao("Edição 1");
        // Nada é impresso — a AbelhaOperaria nunca recebe a edição
    }
}`
                }),
            ]
        }),
    ]
});
