import { Desafio } from "../../../models/desafios/desafio";
import { Dificuldade } from "../../../models/desafios/dificuldade";
import { TipoDesafio } from "../../../models/desafios/tipo-desafio";

import { Quiz } from "../../../models/desafios/quiz/quiz";
import { Pergunta } from "../../../models/desafios/quiz/pergunta";
import { Resposta } from "../../../models/desafios/quiz/resposta";

import { EncontreBug } from "../../../models/desafios/encontre-bug/encontre-bug";
import { PerguntaBug } from "../../../models/desafios/encontre-bug/pergunta-bug";
import { Arquivo } from "../../../models/desafios/encontre-bug/arquivo";
import { RespostaBug } from "../../../models/desafios/encontre-bug/resposta-bug";

import { CompleteTexto } from "../../../models/desafios/complete-texto/complete-texto";
import { Texto } from "../../../models/desafios/complete-texto/texto";

import { CompleteCodigo } from "../../../models/desafios/complete-codigo/complete-codigo";
import { CodigoIncompleto } from "../../../models/desafios/complete-codigo/codigo-incompleto";
import { Trecho } from "../../../models/desafios/complete-codigo/trecho";

import { EncontrePares } from "../../../models/desafios/encontre-pares/encontre-pares";
import { Rodada } from "../../../models/desafios/encontre-pares/rodada";
import { Par } from "../../../models/desafios/encontre-pares/par";

import { Licao } from "../../../models/desafios/licao/licao";

const CONTEUDO_LICAO_SINGLETON = [
    '# O padrão Singleton 🐝',
    '',
    'Imagina que a colmeia inteira só tem **um único controle remoto da TV**. Não importa quantas abelhas queiram assistir alguma coisa: sempre vai ser o mesmo controle, na mesma gaveta, que todo mundo usa.',
    '',
    'Se uma abelha perde o controle e resolve "criar" outro do zero, agora tem dois controles diferentes, cada um controlando coisas separadas — e a bagunça está feita.',
    '',
    'O padrão **Singleton** existe pra evitar exatamente esse tipo de bagunça no código: ele garante que uma classe tenha **apenas uma instância** (um "objeto só") em toda a aplicação, e oferece um jeito único de todo mundo pegar esse mesmo objeto.',
    '',
    '## Por que isso importa?',
    '',
    'Tem coisas no seu programa que só fazem sentido existir **uma vez só**. Por exemplo:',
    '',
    '- A conexão com o banco de dados.',
    '- As configurações gerais do sistema.',
    '- O "controle remoto" que guarda o estado de um jogo.',
    '',
    'Se cada parte do código pudesse criar sua própria cópia dessas coisas, elas ficariam **fora de sincronia** — uma abelha veria uma informação, outra veria outra completamente diferente, mesmo estando "no mesmo lugar".',
    '',
    '![Ilustração (mock)](/icons/livro.png)',
    '',
    '## Como funciona, passo a passo',
    '',
    '1. A classe **esconde** seu próprio construtor (ninguém de fora pode usar `new` nela).',
    '2. A classe guarda, dentro de si mesma, a **única instância** que existe.',
    '3. Ela oferece um método (geralmente chamado `getInstance()`) que qualquer parte do código pode chamar.',
    '4. Na **primeira vez** que alguém chama esse método, a instância é criada e guardada.',
    '5. Em **todas as próximas vezes**, o método devolve a instância que já existia — nunca cria uma nova.',
    '',
    '## O fluxo, de um jeito simples',
    '',
    '```mermaid',
    'flowchart LR',
    '    A[1ª chamada] --> B[Cria e guarda a instância]',
    '    B --> C[Próximas chamadas]',
    '    C --> D[Devolvem sempre a mesma instância]',
    '```',
    '',
    '## Como fica em código',
    '',
    '```java',
    'public class Singleton {',
    '    private static Singleton instancia;',
    '',
    '    // Construtor privado: ninguém de fora pode fazer "new Singleton()"',
    '    private Singleton() {}',
    '',
    '    public static Singleton getInstance() {',
    '        if (instancia == null) {',
    '            instancia = new Singleton();',
    '        }',
    '        return instancia;',
    '    }',
    '}',
    '```',
    '',
    'Repara nos dois detalhes que fazem tudo funcionar:',
    '',
    '- O construtor é **privado** (`private Singleton()`), então só a própria classe pode criar uma instância dela.',
    '- O `if (instancia == null)` garante que a criação só acontece **uma vez**.',
    '',
    '## Cuidado!',
    '',
    'Usar Singleton pra tudo pode virar um problema: como o objeto é único e global, fica mais difícil testar o código e mais fácil esconder dependências escondidas entre partes do sistema que, na teoria, nem deveriam se conhecer.',
    '',
    'Use quando fizer sentido ter **uma coisa só** — não porque é "mais fácil" de acessar de qualquer lugar.',
    '',
    '## Resumindo',
    '',
    '- Singleton = **uma única instância**, acessível de um jeito global.',
    '- O construtor fica **privado**.',
    '- Um método estático (`getInstance()`) cria a instância na primeira chamada e reaproveita ela depois.',
    '- Ótimo pra recursos únicos de verdade (ex.: conexão de banco). Perigoso quando vira desculpa pra estado global.',
].join('\n');

export const DesafiosSeeds: Desafio[] = [
    new Licao({
        id: "licao-singleton-001",
        dificuldade: Dificuldade.Facil,
        grupo: "Criacionais",
        nivel: 1,
        padrao: "Singleton",
        conteudoMarkdown: CONTEUDO_LICAO_SINGLETON
    }),

    new Quiz({
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
    }),

    new EncontreBug({
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
    }),

    new CompleteTexto({
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
                texto: "Em ambientes {{1}}, a criação do Singleton deve ser {{2}} para evitar que múltiplas threads criem instâncias simultâneas, o que quebraria a garantia do padrão.",
                opcoes: ["multithread", "monothread", "sincronizada", "assíncrona", "paralela", "sequencial"],
                respostas: ["multithread", "sincronizada"]
            }),
        ]
    }),

    new CompleteCodigo({
        id: "cc-padroes-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 1,
        padrao: "Singleton & Builder",
        codigos: [
            new CodigoIncompleto({
                id: "cc1",
                arquivo: "Singleton.java",
                linguagem: "java",
                respostaCorretaId: "cc1-t1",
                explicacao: "getInstance() precisa checar se a instância ainda não existe antes de criá-la. Sem o \"if (instancia == null)\", cada chamada criaria uma instância nova, quebrando a garantia do Singleton.",
                template:
`public class Singleton {
    private static Singleton instancia;

    private Singleton() {}

    public static Singleton getInstance() {
{{1}}
        return instancia;
    }
}`,
                opcoes: [
                    new Trecho({ id: "cc1-t1", codigo: `        if (instancia == null) {\n            instancia = new Singleton();\n        }` }),
                    new Trecho({ id: "cc1-t2", codigo: `        instancia = new Singleton();` }),
                    new Trecho({ id: "cc1-t3", codigo: `        if (instancia != null) {\n            instancia = new Singleton();\n        }` }),
                    new Trecho({ id: "cc1-t4", codigo: `        instancia = getInstance();` }),
                ]
            }),
            new CodigoIncompleto({
                id: "cc2",
                arquivo: "PizzaBuilder.java",
                linguagem: "java",
                respostaCorretaId: "cc2-t1",
                explicacao: "Métodos fluentes de um Builder precisam retornar \"this\" para permitir encadear chamadas (ex.: builder.comTamanho(\"G\").comQueijoExtra()). Sem isso, a cadeia de chamadas quebra.",
                template:
`public class PizzaBuilder {
    private String tamanho;
    private boolean queijoExtra;

    public PizzaBuilder comTamanho(String tamanho) {
        this.tamanho = tamanho;
{{1}}
    }

    public Pizza build() {
        return new Pizza(tamanho, queijoExtra);
    }
}`,
                opcoes: [
                    new Trecho({ id: "cc2-t1", codigo: `        return this;` }),
                    new Trecho({ id: "cc2-t2", codigo: `        return null;` }),
                    new Trecho({ id: "cc2-t3", codigo: `        return new PizzaBuilder();` }),
                    new Trecho({ id: "cc2-t4", codigo: `        // nada a retornar` }),
                ]
            }),
        ]
    }),

    new EncontrePares({
        id: "ep-padroes-001",
        dificuldade: Dificuldade.Facil,
        grupo: "Padrões de Projeto",
        nivel: 1,
        padrao: "GoF",
        rodadas: [
            new Rodada({
                id: "r1",
                pares: [
                    new Par({ id: "r1p1", afirmacao: "Singleton", correspondencia: "Garante uma única instância e um ponto global de acesso." }),
                    new Par({ id: "r1p2", afirmacao: "Factory Method", correspondencia: "Delega a criação de objetos para subclasses." }),
                    new Par({ id: "r1p3", afirmacao: "Builder", correspondencia: "Constrói objetos complexos passo a passo." }),
                    new Par({ id: "r1p4", afirmacao: "Prototype", correspondencia: "Cria novos objetos clonando uma instância existente." }),
                ]
            }),
            new Rodada({
                id: "r2",
                pares: [
                    new Par({ id: "r2p1", afirmacao: "Adapter", correspondencia: "Converte a interface de uma classe na interface esperada pelo cliente." }),
                    new Par({ id: "r2p2", afirmacao: "Decorator", correspondencia: "Adiciona responsabilidades a um objeto dinamicamente." }),
                    new Par({ id: "r2p3", afirmacao: "Facade", correspondencia: "Fornece uma interface simplificada para um subsistema complexo." }),
                    new Par({ id: "r2p4", afirmacao: "Proxy", correspondencia: "Controla o acesso a outro objeto, podendo adicionar lógica extra." }),
                ]
            }),
        ]
    }),
];
