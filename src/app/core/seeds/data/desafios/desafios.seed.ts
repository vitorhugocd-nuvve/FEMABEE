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

const CONTEUDO_LICAO_FACTORY_001 = [
    '# O padrão Factory Method 🐝',
    '',
    'Imagina a Cooperativa de Entregas da colmeia. Toda abelha que pega um pacote pra entregar precisa decidir, na hora, qual "veículo" usar pra chegar até o destino. Se cada abelha decidir sozinha, no meio da correria, e ainda instanciar esse veículo na mão, o código de despacho vira uma bagunça de `if`s espalhados por todo canto.',
    '',
    'O padrão **Factory Method** resolve isso tirando a decisão de "qual objeto criar" de dentro de quem usa o objeto, e colocando essa decisão dentro de um método que pode ser sobrescrito por subclasses especializadas.',
    '',
    '## Por que isso importa?',
    '',
    'Quando um trecho de código precisa criar objetos, mas não sabe de antemão qual variação exata vai precisar, ele acaba cheio de decisões assim:',
    '',
    '```java',
    'if (tipoEntrega.equals("RODOVIARIA")) {',
    '    transporte = new Caminhao();',
    '} else if (tipoEntrega.equals("MARITIMA")) {',
    '    transporte = new Navio();',
    '}',
    '```',
    '',
    'Toda vez que surge um novo tipo de entrega, alguém precisa voltar nesse `if/else` — e esse mesmo bloco provavelmente está copiado em vários lugares diferentes do sistema.',
    '',
    '## Como funciona, passo a passo',
    '',
    '1. Define-se uma interface (ou classe abstrata) para o produto que será criado — ex.: `Transporte`.',
    '2. Cria-se uma classe **Creator** com um método fábrica, ex.: `criarTransporte()`.',
    '3. Cada **subclasse concreta** do Creator sobrescreve esse método e decide *qual* produto concreto instanciar.',
    '4. O restante do código do Creator chama sempre `criarTransporte()` — nunca `new` diretamente — e por isso funciona igual pra qualquer subclasse.',
    '',
    '## O fluxo, de um jeito simples',
    '',
    '```mermaid',
    'flowchart LR',
    '    A[Código cliente pede um transporte] --> B[Creator.criarTransporte]',
    '    B --> C{Qual subclasse?}',
    '    C -->|TransportadoraRodoviaria| D[Caminhao]',
    '    C -->|TransportadoraMaritima| E[Navio]',
    '```',
    '',
    '## Como fica em código',
    '',
    '```java',
    'public abstract class Transportadora {',
    '    // Método fábrica: cada subclasse decide o que devolver aqui',
    '    public abstract Transporte criarTransporte();',
    '',
    '    public void despachar(String pacote) {',
    '        Transporte transporte = criarTransporte();',
    '        transporte.entregar(pacote);',
    '    }',
    '}',
    '',
    'public class TransportadoraRodoviaria extends Transportadora {',
    '    public Transporte criarTransporte() {',
    '        return new Caminhao();',
    '    }',
    '}',
    '',
    'public class TransportadoraMaritima extends Transportadora {',
    '    public Transporte criarTransporte() {',
    '        return new Navio();',
    '    }',
    '}',
    '```',
    '',
    'Repara que `despachar()` nunca sabe se está lidando com um `Caminhao` ou um `Navio` — ele só confia que `criarTransporte()` vai devolver *algum* `Transporte` válido.',
    '',
    '## Cuidado!',
    '',
    'Criar uma hierarquia de Creators pra um único tipo de produto que nunca varia é over-engineering. O Factory Method vale a pena quando a criação do objeto **realmente muda** de acordo com o contexto — não pra "deixar preparado pro futuro".',
    '',
    '## Resumindo',
    '',
    '- Factory Method = delega a decisão de **qual classe instanciar** para subclasses.',
    '- O código cliente conhece só a interface do produto (`Transporte`), nunca a classe concreta.',
    '- Evita `if/else` espalhados e facilita adicionar novos tipos de produto sem alterar código existente.',
].join('\n');

const CONTEUDO_LICAO_FACTORY_002 = [
    '# Factory Method: a estrutura completa 🐝',
    '',
    'Na lição anterior vimos a ideia central: cada subclasse do Creator decide qual produto criar. Agora vamos ver as **quatro peças** que formam o padrão por completo — os nomes que aparecem em praticamente todo material sobre Factory Method (inclusive no GoF, o livro que catalogou esses padrões).',
    '',
    '## As quatro peças',
    '',
    '| Papel | No nosso exemplo | O que faz |',
    '|---|---|---|',
    '| **Product** | `Transporte` | Interface comum a todos os produtos. |',
    '| **ConcreteProduct** | `Caminhao`, `Navio` | Implementações concretas do produto. |',
    '| **Creator** | `Transportadora` | Declara o método fábrica e o usa internamente. |',
    '| **ConcreteCreator** | `TransportadoraRodoviaria`, `TransportadoraMaritima` | Sobrescreve o método fábrica pra devolver um `ConcreteProduct` específico. |',
    '',
    '## O diagrama completo',
    '',
    '```mermaid',
    'classDiagram',
    '    class Transporte {',
    '        <<interface>>',
    '        +entregar(pacote)',
    '    }',
    '    class Caminhao {',
    '        +entregar(pacote)',
    '    }',
    '    class Navio {',
    '        +entregar(pacote)',
    '    }',
    '    class Transportadora {',
    '        <<abstract>>',
    '        +criarTransporte() Transporte',
    '        +despachar(pacote)',
    '    }',
    '    class TransportadoraRodoviaria {',
    '        +criarTransporte() Transporte',
    '    }',
    '    class TransportadoraMaritima {',
    '        +criarTransporte() Transporte',
    '    }',
    '',
    '    Transporte <|.. Caminhao',
    '    Transporte <|.. Navio',
    '    Transportadora <|-- TransportadoraRodoviaria',
    '    Transportadora <|-- TransportadoraMaritima',
    '    Transportadora ..> Transporte : cria',
    '```',
    '',
    '## Código completo',
    '',
    '```java',
    'public interface Transporte {',
    '    void entregar(String pacote);',
    '}',
    '',
    'public class Caminhao implements Transporte {',
    '    public void entregar(String pacote) {',
    '        System.out.println("Entregando " + pacote + " de caminhão.");',
    '    }',
    '}',
    '',
    'public class Navio implements Transporte {',
    '    public void entregar(String pacote) {',
    '        System.out.println("Entregando " + pacote + " de navio.");',
    '    }',
    '}',
    '',
    'public abstract class Transportadora {',
    '    public abstract Transporte criarTransporte();',
    '',
    '    public void despachar(String pacote) {',
    '        Transporte transporte = criarTransporte();',
    '        transporte.entregar(pacote);',
    '    }',
    '}',
    '',
    'public class TransportadoraRodoviaria extends Transportadora {',
    '    public Transporte criarTransporte() {',
    '        return new Caminhao();',
    '    }',
    '}',
    '',
    'public class TransportadoraMaritima extends Transportadora {',
    '    public Transporte criarTransporte() {',
    '        return new Navio();',
    '    }',
    '}',
    '```',
    '',
    '## Por que separar em quatro peças?',
    '',
    'Porque cada uma tem uma responsabilidade isolada:',
    '',
    '- Quer adicionar um novo tipo de transporte (ex.: `Aviao`)? Cria um `ConcreteProduct` novo e um `ConcreteCreator` novo — **nada do código existente muda**.',
    '- Quer trocar como um transporte específico entrega o pacote? Mexe só no `ConcreteProduct` correspondente.',
    '',
    'Esse é o Princípio Aberto/Fechado (Open/Closed): aberto para extensão (novos transportes), fechado para modificação (o código de `despachar()` nunca precisa mudar).',
    '',
    '## Resumindo',
    '',
    '- **Product** (`Transporte`): interface do que será criado.',
    '- **ConcreteProduct** (`Caminhao`, `Navio`): implementações concretas.',
    '- **Creator** (`Transportadora`): dono do método fábrica.',
    '- **ConcreteCreator** (`TransportadoraRodoviaria`, `TransportadoraMaritima`): decide qual `ConcreteProduct` criar.',
].join('\n');

const CONTEUDO_LICAO_FACTORY_003 = [
    '# Indo além do básico: variações e quando (não) usar 🐝',
    '',
    'Depois de dominar a estrutura clássica — Creator, ConcreteCreator, Product, ConcreteProduct — vale conhecer algumas variações que aparecem bastante no dia a dia.',
    '',
    '## Método fábrica parametrizado',
    '',
    'Às vezes não vale a pena criar uma subclasse de Creator pra cada variação de produto. Uma alternativa comum (às vezes chamada de "Simple Factory", uma prima simplificada do Factory Method) é ter **um único método** que recebe um parâmetro e decide internamente:',
    '',
    '```java',
    'public class TransportadoraFactory {',
    '    public static Transporte criar(String tipo) {',
    '        if (tipo.equals("RODOVIARIA")) return new Caminhao();',
    '        if (tipo.equals("MARITIMA")) return new Navio();',
    '        throw new IllegalArgumentException("Tipo desconhecido: " + tipo);',
    '    }',
    '}',
    '```',
    '',
    'Repara que isso **não é** o Factory Method "de verdade" do GoF — não tem subclasses sobrescrevendo nada, é só um método centralizando `new`s que antes estavam espalhados. Na prática, muita gente chama isso de "Factory Method" também, e não tem problema, contanto que você saiba que existe essa diferença quando ler material mais formal.',
    '',
    '## Factory Method x Abstract Factory x Builder',
    '',
    'Os três aparecem juntos com frequência, então vale a comparação direta:',
    '',
    '- **Factory Method** — cria **um** produto, e a variação vem de **subclasses** do Creator.',
    '- **Abstract Factory** — cria **famílias inteiras** de produtos relacionados (ex.: uma fábrica que cria `Caminhao` + `MotoristaDeCaminhao` + `NotaFiscalRodoviaria`, todos combinando entre si), geralmente **usando Factory Methods internamente** para cada produto da família.',
    '- **Builder** — foca em montar **um objeto complexo passo a passo** (várias configurações opcionais), não em decidir qual classe instanciar.',
    '',
    '```mermaid',
    'flowchart TD',
    '    A[Preciso criar objetos] --> B{Um produto ou uma família?}',
    '    B -->|Um produto, varia por subclasse| C[Factory Method]',
    '    B -->|Família inteira e consistente| D[Abstract Factory]',
    '    A --> E{Objeto complexo, montado em etapas?}',
    '    E -->|Sim| F[Builder]',
    '```',
    '',
    '## Quando NÃO usar',
    '',
    'Se só existe **um tipo** de produto e ele nunca varia, criar uma hierarquia de Creators é complexidade de graça. Um `new Caminhao()` direto, sem cerimônia, é a solução certa até que apareça uma **razão real** pra variar.',
    '',
    'Sinal de que vale a pena introduzir o Factory Method: você percebe o mesmo `if/else` decidindo "qual classe instanciar" repetido em vários lugares do código, ou sabe que vai precisar suportar novos tipos de produto no futuro próximo.',
    '',
    '## Resumindo',
    '',
    '- Método fábrica **parametrizado** ("Simple Factory") é uma variação prática, mas tecnicamente diferente do Factory Method do GoF.',
    '- **Abstract Factory** cria famílias de produtos relacionados; **Builder** monta um objeto complexo em etapas — parecidos, mas resolvem problemas diferentes.',
    '- Não introduza o padrão antes de sentir a dor de `new`s espalhados e repetidos — YAGNI vale pra padrões de projeto também.',
].join('\n');

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

const CONTEUDO_LICAO_PROTOTYPE_001 = [
    '# O padrão Prototype 🐝',
    '',
    'Imagina a Oficina de Clonagem da colmeia. Toda vez que a Cooperativa de Entregas precisa de mais um caminhão "modelo executivo" — motor tal, capacidade tal, pintura tal — alguém teria que preencher a mesma ficha de configuração de novo, com as mesmas dezenas de detalhes, começando do zero.',
    '',
    'O padrão **Prototype** resolve isso de um jeito direto: em vez de **construir** um objeto do zero toda vez, você **clona** um objeto já configurado (o "protótipo") e só ajusta o que precisa ser diferente.',
    '',
    '## Por que isso importa?',
    '',
    'Tem objetos cuja configuração é cara ou trabalhosa de montar — muitos parâmetros, valores calculados, ou dependências complexas. Reconstruir tudo isso do zero toda vez que você precisa de "mais um parecido com esse" é:',
    '',
    '- **Repetitivo** — os mesmos parâmetros, escritos de novo em cada lugar que cria o objeto.',
    '- **Arriscado** — é fácil esquecer de preencher um campo e criar um objeto configurado errado.',
    '',
    'Clonar um objeto que já existe e está correto evita os dois problemas: você começa de um estado conhecido e bom.',
    '',
    '## Como funciona, passo a passo',
    '',
    '1. A classe que pode ser clonada implementa um método (geralmente chamado `clonar()` ou `clone()`) que devolve **uma cópia de si mesma**.',
    '2. Esse método cria uma nova instância e copia os valores dos campos da instância atual para ela.',
    '3. Quem precisa de "mais um objeto parecido" chama `clonar()` em cima de um protótipo já configurado, em vez de montar tudo com `new` e uma lista enorme de parâmetros.',
    '4. Depois de clonar, é só ajustar os campos específicos que precisam mudar na cópia.',
    '',
    '## O fluxo, de um jeito simples',
    '',
    '```mermaid',
    'flowchart LR',
    '    A[Caminhão-modelo já configurado] -->|clonar| B[Cópia nova, idêntica]',
    '    B -->|ajusta só a cor| C[Cópia personalizada]',
    '```',
    '',
    '## Como fica em código',
    '',
    '```java',
    'public class Caminhao {',
    '    private String cor;',
    '    private int capacidadeToneladas;',
    '    private String motorizacao;',
    '',
    '    public Caminhao(String cor, int capacidadeToneladas, String motorizacao) {',
    '        this.cor = cor;',
    '        this.capacidadeToneladas = capacidadeToneladas;',
    '        this.motorizacao = motorizacao;',
    '    }',
    '',
    '    // Método de clonagem: cria uma cópia com os mesmos valores',
    '    public Caminhao clonar() {',
    '        return new Caminhao(this.cor, this.capacidadeToneladas, this.motorizacao);',
    '    }',
    '',
    '    public void pintar(String novaCor) {',
    '        this.cor = novaCor;',
    '    }',
    '}',
    '```',
    '',
    'Uso:',
    '',
    '```java',
    'Caminhao modeloExecutivo = new Caminhao("Prata", 12, "Diesel V8");',
    '',
    '// Em vez de "new Caminhao(...)" com todos os parâmetros de novo:',
    'Caminhao pedido1 = modeloExecutivo.clonar();',
    'pedido1.pintar("Vermelho");',
    '',
    'Caminhao pedido2 = modeloExecutivo.clonar();',
    'pedido2.pintar("Azul");',
    '```',
    '',
    '## Cuidado!',
    '',
    'Se o objeto tem poucos campos e é barato de montar, criar um sistema de clonagem só complica as coisas à toa. Prototype vale a pena quando montar o objeto do zero é caro, repetitivo ou propenso a erro.',
    '',
    '## Resumindo',
    '',
    '- Prototype = criar objetos **clonando** um protótipo existente, em vez de montar do zero.',
    '- O método de clonagem (`clonar()`/`clone()`) devolve uma cópia com os mesmos valores.',
    '- Ótimo quando configurar um objeto do zero é caro ou repetitivo. Desnecessário para objetos simples.',
].join('\n');

const CONTEUDO_LICAO_PROTOTYPE_002 = [
    '# Prototype: a estrutura completa 🐝',
    '',
    'Na lição anterior vimos a ideia central: clonar em vez de construir do zero. Agora vamos ver a peça que falta — a diferença entre clonar **rasa** e clonar **profunda**, que é onde a maioria dos bugs desse padrão mora.',
    '',
    '## Cópia rasa (shallow copy)',
    '',
    'Uma cópia rasa copia os valores dos campos **simples** (números, texto, booleanos) diretamente. Mas quando um campo é uma **referência** para outro objeto (uma lista, por exemplo), a cópia rasa copia só a referência — o clone e o original passam a **apontar pro mesmo objeto interno**.',
    '',
    '```mermaid',
    'flowchart LR',
    '    subgraph Original',
    '    A[Caminhao original] -->|rotas| L[List de rotas]',
    '    end',
    '    subgraph Clone',
    '    B[Caminhao clonado] -->|rotas| L',
    '    end',
    '```',
    '',
    'Se alguém adicionar uma rota na lista do clone, a lista do original muda **junto** — mesmo eles sendo "objetos diferentes". Isso normalmente não é o que você quer.',
    '',
    '## Cópia profunda (deep copy)',
    '',
    'Uma cópia profunda clona também os objetos internos, não só a referência pra eles — o clone fica **completamente independente** do original.',
    '',
    '```java',
    'public class Caminhao {',
    '    private String cor;',
    '    private List<String> rotasAtendidas;',
    '',
    '    public Caminhao(String cor, List<String> rotasAtendidas) {',
    '        this.cor = cor;',
    '        this.rotasAtendidas = rotasAtendidas;',
    '    }',
    '',
    '    // Cópia PROFUNDA: cria uma nova List, não reaproveita a mesma referência',
    '    public Caminhao clonar() {',
    '        List<String> novaLista = new ArrayList<>(this.rotasAtendidas);',
    '        return new Caminhao(this.cor, novaLista);',
    '    }',
    '}',
    '```',
    '',
    'O `new ArrayList<>(this.rotasAtendidas)` cria uma lista **nova**, com os mesmos elementos — não a mesma lista. Agora o clone pode ganhar rotas próprias sem afetar o original.',
    '',
    '## Registro de protótipos (Prototype Registry)',
    '',
    'Em sistemas maiores, é comum guardar vários protótipos prontos num "catálogo" (um `Map<String, Caminhao>`, por exemplo) e clonar a partir dali pelo nome:',
    '',
    '```java',
    'Map<String, Caminhao> catalogo = new HashMap<>();',
    'catalogo.put("executivo", new Caminhao("Prata", 12, "Diesel V8"));',
    'catalogo.put("compacto", new Caminhao("Branco", 4, "Flex"));',
    '',
    'Caminhao pedido = catalogo.get("executivo").clonar();',
    '```',
    '',
    'Isso evita que quem pede um clone precise saber os detalhes de construção — só o **nome** do protótipo desejado.',
    '',
    '## Resumindo',
    '',
    '- **Cópia rasa**: copia campos simples, mas reaproveita a mesma referência pra objetos internos — cuidado com efeitos colaterais.',
    '- **Cópia profunda**: clona também os objetos internos — clone e original ficam totalmente independentes.',
    '- **Prototype Registry**: um catálogo de protótipos prontos, clonados pelo nome.',
].join('\n');

const CONTEUDO_LICAO_PROTOTYPE_003 = [
    '# Indo além do básico: quando usar (e quando não) 🐝',
    '',
    'Com a estrutura completa em mãos, vale comparar o Prototype com os outros padrões criacionais que você já viu, e entender os limites reais dele.',
    '',
    '## Prototype x Factory Method x Builder',
    '',
    '- **Factory Method** — a variação do objeto criado vem de **qual subclasse do Creator** é usada. Você decide o tipo antes de criar.',
    '- **Builder** — monta um objeto complexo **passo a passo**, escolhendo cada configuração conforme constrói.',
    '- **Prototype** — parte de um objeto **já pronto e configurado**, e cria variações clonando e ajustando. Você decide a partir de um exemplo existente, não de regras de construção.',
    '',
    '```mermaid',
    'flowchart TD',
    '    A[Preciso de um novo objeto] --> B{Tenho um exemplo parecido já pronto?}',
    '    B -->|Sim, só preciso de uma variação| C[Prototype]',
    '    B -->|Não, mas sei qual subclasse usar| D[Factory Method]',
    '    B -->|Não, e a montagem tem várias etapas opcionais| E[Builder]',
    '```',
    '',
    'Os três não são mutuamente exclusivos: é comum um `Factory Method` devolver um clone de um protótipo interno, por exemplo, combinando os dois.',
    '',
    '## Clonagem tem limites',
    '',
    'Prototype não resolve tudo:',
    '',
    '- Se o objeto guarda uma conexão externa (um socket de rede, um arquivo aberto), **clonar** essa conexão não faz sentido — normalmente você clona os dados e recria a conexão à parte.',
    '- Clonar objetos com referências circulares (A aponta pra B, que aponta de volta pra A) exige cuidado extra pra não entrar em loop infinito ao clonar profundamente.',
    '',
    '## Quando NÃO usar',
    '',
    'Se seus objetos são baratos de construir e não têm muita configuração, um `new` direto é mais simples de ler do que introduzir um método de clonagem. Prototype ganha valor quando reconstruir do zero é **caro, repetitivo ou arriscado de errar** — não como regra geral pra qualquer classe.',
    '',
    '## Resumindo',
    '',
    '- Prototype clona um objeto **existente**; Factory Method escolhe uma **subclasse**; Builder monta **passo a passo**.',
    '- Nem tudo é clonável com segurança — conexões externas e referências circulares merecem atenção especial.',
    '- Vale a pena quando construir do zero é caro ou repetitivo — não é a escolha padrão pra qualquer objeto.',
].join('\n');

const CONTEUDO_LICAO_BUILDER_001 = [
    '# O padrão Builder 🐝',
    '',
    'Imagina a Oficina de Montagem da colmeia, montando caminhões sob encomenda. Cada cliente pode escolher motor, capacidade, se quer reboque, se quer rastreador... um monte de opções, a maioria delas opcional. Se você tentar resolver isso com **um construtor só**, ele vira um pesadelo:',
    '',
    '```java',
    '// O "construtor telescópico": um parâmetro pra cada combinação possível',
    'new Caminhao("Diesel V8", 12, true, true, false, null, "Prata");',
    '```',
    '',
    'Quem lê essa linha não faz ideia do que cada `true`/`false`/`null` significa sem ficar contando parâmetros e olhando a assinatura do construtor. E se aparecer mais uma opção no futuro, o construtor cresce (de novo).',
    '',
    'O padrão **Builder** resolve isso construindo o objeto **passo a passo**, com um método nomeado pra cada configuração — só chamando os que realmente importam pro caso atual.',
    '',
    '## Por que isso importa?',
    '',
    'Quando um objeto tem muitos parâmetros **opcionais** e combináveis entre si, um construtor tradicional força você a decidir a ordem de tudo, e geralmente empurra valores irrelevantes (`null`, `false`, valores padrão) só pra "encaixar" na assinatura. Isso deixa o código:',
    '',
    '- **Difícil de ler** — `new Caminhao("Diesel V8", 12, true, true, false, null, "Prata")` não diz nada sobre o que cada valor representa.',
    '- **Frágil** — trocar a ordem de dois parâmetros do mesmo tipo (dois `boolean`, por exemplo) não dá erro de compilação, só bug silencioso.',
    '',
    '## Como funciona, passo a passo',
    '',
    '1. Uma classe **Builder** tem um método nomeado pra cada configuração possível (ex.: `comMotor(...)`, `comCapacidade(...)`).',
    '2. Cada um desses métodos guarda o valor recebido e devolve **o próprio builder** (`return this;`), permitindo **encadear** chamadas — um estilo chamado de *fluent interface*.',
    '3. Um método final (geralmente `construir()` ou `build()`) monta o objeto de verdade, usando só os valores que foram configurados.',
    '',
    '## O fluxo, de um jeito simples',
    '',
    '```mermaid',
    'flowchart LR',
    '    A[new CaminhaoBuilder] --> B[.comMotor]',
    '    B --> C[.comCapacidade]',
    '    C --> D[.comReboque]',
    '    D --> E[.construir]',
    '    E --> F[Caminhao pronto]',
    '```',
    '',
    '## Como fica em código',
    '',
    '```java',
    'public class CaminhaoBuilder {',
    '    private String motor = "Diesel";',
    '    private int capacidadeToneladas = 4;',
    '    private boolean temReboque = false;',
    '',
    '    public CaminhaoBuilder comMotor(String motor) {',
    '        this.motor = motor;',
    '        return this;',
    '    }',
    '',
    '    public CaminhaoBuilder comCapacidade(int toneladas) {',
    '        this.capacidadeToneladas = toneladas;',
    '        return this;',
    '    }',
    '',
    '    public CaminhaoBuilder comReboque() {',
    '        this.temReboque = true;',
    '        return this;',
    '    }',
    '',
    '    public Caminhao construir() {',
    '        return new Caminhao(motor, capacidadeToneladas, temReboque);',
    '    }',
    '}',
    '```',
    '',
    'Uso:',
    '',
    '```java',
    'Caminhao caminhao = new CaminhaoBuilder()',
    '    .comMotor("Diesel V8")',
    '    .comCapacidade(12)',
    '    .comReboque()',
    '    .construir();',
    '```',
    '',
    'Agora dá pra ler exatamente o que está sendo configurado, e quem só precisa de um caminhão básico nem chama `.comReboque()`.',
    '',
    '## Cuidado!',
    '',
    'Se o objeto tem poucos parâmetros (dois ou três, todos obrigatórios), um construtor normal já resolve bem — Builder é mais código pra escrever e manter, e só compensa quando a configuração é realmente extensa e opcional.',
    '',
    '## Resumindo',
    '',
    '- Builder = monta um objeto complexo **passo a passo**, um método por configuração.',
    '- Cada método retorna `this`, permitindo **encadear** chamadas (fluent interface).',
    '- Um método final (`construir()`/`build()`) devolve o objeto pronto.',
    '- Resolve o problema do "construtor telescópico" — muitos parâmetros opcionais numa assinatura só.',
].join('\n');

const CONTEUDO_LICAO_BUILDER_002 = [
    '# Builder: a estrutura completa 🐝',
    '',
    'Na lição anterior vimos a ideia central: configurar passo a passo, encadeando chamadas que retornam `this`. Agora vamos ver a estrutura completa, incluindo uma peça opcional que costuma gerar dúvida: o **Director**.',
    '',
    '## As peças',
    '',
    '| Papel | No nosso exemplo | O que faz |',
    '|---|---|---|',
    '| **Product** | `Caminhao` | O objeto final, complexo, que está sendo montado. |',
    '| **Builder** | `CaminhaoBuilder` | Guarda a configuração em andamento e monta o `Product` no final. |',
    '| **Director** *(opcional)* | `CaminhaoDirector` | Conhece "receitas" prontas — sequências comuns de chamadas do Builder. |',
    '',
    '## Product guardando o Builder',
    '',
    'Um jeito comum de implementar em Java: o construtor do `Product` é **privado** e recebe o próprio builder, copiando os valores de dentro dele. Isso garante que só o Builder consegue criar um `Caminhao`.',
    '',
    '```mermaid',
    'classDiagram',
    '    class Caminhao {',
    '        -motor',
    '        -capacidadeToneladas',
    '        -temReboque',
    '        -Caminhao(CaminhaoBuilder)',
    '    }',
    '    class CaminhaoBuilder {',
    '        +comMotor(motor) CaminhaoBuilder',
    '        +comCapacidade(toneladas) CaminhaoBuilder',
    '        +comReboque() CaminhaoBuilder',
    '        +construir() Caminhao',
    '    }',
    '    class CaminhaoDirector {',
    '        +criarCaminhaoDeLongaDistancia() Caminhao',
    '    }',
    '',
    '    CaminhaoBuilder ..> Caminhao : constrói',
    '    CaminhaoDirector ..> CaminhaoBuilder : usa',
    '```',
    '',
    '## Código completo',
    '',
    '```java',
    'public class Caminhao {',
    '    private final String motor;',
    '    private final int capacidadeToneladas;',
    '    private final boolean temReboque;',
    '',
    '    // Construtor privado: só o Builder pode criar um Caminhao',
    '    private Caminhao(CaminhaoBuilder builder) {',
    '        this.motor = builder.motor;',
    '        this.capacidadeToneladas = builder.capacidadeToneladas;',
    '        this.temReboque = builder.temReboque;',
    '    }',
    '',
    '    public static class CaminhaoBuilder {',
    '        private String motor = "Diesel";',
    '        private int capacidadeToneladas = 4;',
    '        private boolean temReboque = false;',
    '',
    '        public CaminhaoBuilder comMotor(String motor) {',
    '            this.motor = motor;',
    '            return this;',
    '        }',
    '',
    '        public CaminhaoBuilder comCapacidade(int toneladas) {',
    '            this.capacidadeToneladas = toneladas;',
    '            return this;',
    '        }',
    '',
    '        public CaminhaoBuilder comReboque() {',
    '            this.temReboque = true;',
    '            return this;',
    '        }',
    '',
    '        public Caminhao construir() {',
    '            return new Caminhao(this);',
    '        }',
    '    }',
    '}',
    '```',
    '',
    '## O Director: receitas prontas',
    '',
    'Quando certas combinações de configuração se repetem bastante (ex.: "o caminhão padrão de longa distância"), um **Director** encapsula essa receita, pra quem usa não precisar lembrar de todos os passos:',
    '',
    '```java',
    'public class CaminhaoDirector {',
    '    public static Caminhao criarCaminhaoDeLongaDistancia() {',
    '        return new Caminhao.CaminhaoBuilder()',
    '            .comMotor("Diesel V8")',
    '            .comCapacidade(12)',
    '            .comReboque()',
    '            .construir();',
    '    }',
    '}',
    '```',
    '',
    'O Director **não substitui** o Builder — ele só chama o Builder por você, seguindo uma receita fixa. Sem Director, quem monta o caminhão continua livre pra combinar os métodos do jeito que quiser.',
    '',
    '## Resumindo',
    '',
    '- **Product** (`Caminhao`): o objeto complexo final.',
    '- **Builder** (`CaminhaoBuilder`): monta o `Product` passo a passo, method a method.',
    '- **Director** (`CaminhaoDirector`, opcional): guarda receitas prontas de construção, usando o Builder por baixo.',
].join('\n');

const CONTEUDO_LICAO_BUILDER_003 = [
    '# Indo além do básico: Director, comparações e cuidado com estado compartilhado 🐝',
    '',
    'Com a estrutura completa em mãos, vale afinar quando usar o Director, comparar o Builder com os outros padrões criacionais, e conhecer uma pegadinha comum.',
    '',
    '## Quando vale a pena um Director?',
    '',
    'Se as combinações de configuração são sempre diferentes, um Director só adiciona uma camada extra sem ajudar muito — é melhor deixar quem usa o Builder combinar os métodos livremente. O Director compensa quando existem **combinações padronizadas e repetidas** que merecem um nome (`criarCaminhaoDeLongaDistancia()`, `criarCaminhaoUrbano()`...).',
    '',
    '## Builder x Factory Method x Prototype',
    '',
    '- **Builder** — monta um objeto **complexo, passo a passo**, com várias configurações opcionais.',
    '- **Factory Method** — cria **um** produto, variando por **qual subclasse** do Creator é usada.',
    '- **Prototype** — parte de um objeto **já pronto**, criando variações por **clonagem**.',
    '',
    '```mermaid',
    'flowchart TD',
    '    A[Preciso criar um objeto] --> B{Tem muitas configurações opcionais combináveis?}',
    '    B -->|Sim| C[Builder]',
    '    B -->|Não| D{A variação depende de qual subclasse eu uso?}',
    '    D -->|Sim| E[Factory Method]',
    '    D -->|Não, tenho um exemplo pronto pra clonar| F[Prototype]',
    '```',
    '',
    '## Cuidado com estado compartilhado',
    '',
    'Se o `Builder` guarda um campo **mutável** (uma `List`, por exemplo) e o `Product` reaproveita a **mesma referência** em vez de copiar, reusar o builder pra montar um segundo objeto pode alterar por baixo dos panos o primeiro objeto que você já achava "pronto":',
    '',
    '```java',
    '// Perigoso: Caminhao guarda a MESMA List que está dentro do builder',
    'private Caminhao(CaminhaoBuilder builder) {',
    '    this.opcionais = builder.opcionais;',
    '}',
    '',
    '// Seguro: copia os elementos pra uma List nova e independente',
    'private Caminhao(CaminhaoBuilder builder) {',
    '    this.opcionais = new ArrayList<>(builder.opcionais);',
    '}',
    '```',
    '',
    'É o mesmo cuidado de cópia rasa x profunda que aparece no Prototype — vale a pena lembrar sempre que um campo mutável atravessa a fronteira entre duas classes.',
    '',
    '## Resumindo',
    '',
    '- Use um Director só quando existem receitas de construção **repetidas e nomeáveis** — não é obrigatório.',
    '- Builder monta passo a passo; Factory Method escolhe uma subclasse; Prototype clona um exemplo pronto.',
    '- Campos mutáveis do Builder devem ser **copiados**, não só referenciados, ao montar o `Product` — senão o objeto "pronto" pode mudar sozinho depois.',
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

    new Licao({
        id: "licao-factory-001",
        dificuldade: Dificuldade.Facil,
        grupo: "Criacionais",
        nivel: 1,
        padrao: "Factory Method",
        conteudoMarkdown: CONTEUDO_LICAO_FACTORY_001
    }),

    new Quiz({
        id: "quiz-factory-001",
        dificuldade: Dificuldade.Facil,
        padrao: "Factory Method",
        grupo: "Criacionais",
        nivel: 1,
        tipo: TipoDesafio.PerguntasRespostas,
        perguntas: [
            new Pergunta({
                id: "p1",
                texto: "Qual das afirmações abaixo descreve melhor o padrão Factory Method?",
                repostas: [
                    new Resposta({ id: "p1r1", texto: "Garante que uma classe tenha apenas uma instância e fornece um ponto global de acesso." }),
                    new Resposta({ id: "p1r2", texto: "Delega para subclasses a decisão de qual classe concreta instanciar.", correta: true }),
                    new Resposta({ id: "p1r3", texto: "Constrói um objeto complexo passo a passo." }),
                    new Resposta({ id: "p1r4", texto: "Clona um objeto existente para criar novos objetos." }),
                ]
            }),
            new Pergunta({
                id: "p2",
                texto: "No exemplo da Transportadora, quem decide se o transporte será um Caminhao ou um Navio?",
                repostas: [
                    new Resposta({ id: "p2r1", texto: "O código cliente que chama despachar()." }),
                    new Resposta({ id: "p2r2", texto: "A subclasse concreta, ao sobrescrever criarTransporte().", correta: true }),
                    new Resposta({ id: "p2r3", texto: "A interface Transporte." }),
                    new Resposta({ id: "p2r4", texto: "Um if/else dentro do método despachar()." }),
                ]
            }),
            new Pergunta({
                id: "p3",
                texto: "Por que o método despachar() não precisa saber se está usando Caminhao ou Navio?",
                repostas: [
                    new Resposta({ id: "p3r1", texto: "Porque ele usa reflection para descobrir o tipo em tempo de execução." }),
                    new Resposta({ id: "p3r2", texto: "Porque ele só depende da interface Transporte, devolvida por criarTransporte().", correta: true }),
                    new Resposta({ id: "p3r3", texto: "Porque Caminhao e Navio têm o mesmo nome de classe." }),
                    new Resposta({ id: "p3r4", texto: "Porque ele recebe o tipo do transporte como parâmetro de texto." }),
                ]
            }),
            new Pergunta({
                id: "p4",
                texto: "Qual problema o Factory Method evita?",
                repostas: [
                    new Resposta({ id: "p4r1", texto: "Duplicação de blocos if/else que decidem qual classe instanciar, espalhados pelo código.", correta: true }),
                    new Resposta({ id: "p4r2", texto: "Excesso de métodos privados em uma classe." }),
                    new Resposta({ id: "p4r3", texto: "Vazamento de memória ao criar muitos objetos." }),
                    new Resposta({ id: "p4r4", texto: "Conflito de nomes entre atributos de subclasses." }),
                ]
            }),
        ]
    }),

    new CompleteTexto({
        id: "ct-factory-001",
        dificuldade: Dificuldade.Normal,
        grupo: "Criacionais",
        nivel: 1,
        padrao: "Factory Method",
        textos: [
            new Texto({
                id: "t1",
                texto: "O padrão {{1}} delega a {{2}} de qual classe concreta instanciar para {{3}}.",
                opcoes: ["Factory Method", "decisão", "subclasses", "Singleton", "execução", "interfaces"],
                respostas: ["Factory Method", "decisão", "subclasses"]
            }),
            new Texto({
                id: "t2",
                texto: "No Factory Method, a classe {{1}} define um método fábrica {{2}}, que cada subclasse concreta deve {{3}}.",
                opcoes: ["Creator", "abstrato", "sobrescrever", "Product", "privado", "herdar"],
                respostas: ["Creator", "abstrato", "sobrescrever"]
            }),
            new Texto({
                id: "t3",
                texto: "O código que usa o Creator conhece apenas a {{1}} do produto (ex.: Transporte), nunca a {{2}} concreta que foi {{3}}.",
                opcoes: ["interface", "classe", "instanciada", "implementação", "fábrica", "clonada"],
                respostas: ["interface", "classe", "instanciada"]
            }),
        ]
    }),

    new EncontreBug({
        id: "eb-factory-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Factory Method",
        perguntas: [
            new PerguntaBug({
                id: "pb1",
                enunciado: "Qual das alternativas descreve corretamente o problema deste código?",
                explicacao: "TransportadoraMaritima não sobrescreve criarTransporte(), então despachar() sempre cria um Caminhao — mesmo para uma entrega marítima. Como o método não é abstrato, o compilador não avisa que faltou sobrescrever.",
                respostas: [
                    new RespostaBug({ id: "pb1-r1", texto: "Não há problema, TransportadoraMaritima despacha corretamente por Navio." }),
                    new RespostaBug({ id: "pb1-r2", texto: "TransportadoraMaritima não sobrescreve criarTransporte(), então despachar() sempre cria um Caminhao, mesmo para entregas marítimas.", correta: true }),
                    new RespostaBug({ id: "pb1-r3", texto: "O método despachar() deveria ser estático." }),
                    new RespostaBug({ id: "pb1-r4", texto: "Transporte deveria ser uma classe abstrata, não uma interface." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb1-a1",
                        nome: "Transportadora.java",
                        linguagem: "java",
                        codigo:
`public class Transportadora {
    public Transporte criarTransporte() {
        return new Caminhao();
    }

    public void despachar(String pacote) {
        Transporte transporte = criarTransporte();
        transporte.entregar(pacote);
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a2",
                        nome: "TransportadoraMaritima.java",
                        linguagem: "java",
                        codigo:
`public class TransportadoraMaritima extends Transportadora {
    // ainda não sobrescreveu criarTransporte()
}`
                    }),
                    new Arquivo({
                        id: "pb1-a3",
                        nome: "App.java",
                        linguagem: "java",
                        codigo:
`public class App {
    public static void main(String[] args) {
        Transportadora transportadora = new TransportadoraMaritima();
        transportadora.despachar("Mel");
    }
}`
                    }),
                ]
            }),
        ]
    }),

    new EncontrePares({
        id: "ep-factory-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Factory Method",
        rodadas: [
            new Rodada({
                id: "r1",
                pares: [
                    new Par({ id: "r1p1", afirmacao: "Creator (Transportadora)", correspondencia: "Classe que declara o método fábrica e o usa internamente." }),
                    new Par({ id: "r1p2", afirmacao: "Método fábrica (criarTransporte)", correspondencia: "Método sobrescrito pelas subclasses para decidir qual produto concreto criar." }),
                    new Par({ id: "r1p3", afirmacao: "Product (Transporte)", correspondencia: "Interface comum que todos os produtos concretos implementam." }),
                    new Par({ id: "r1p4", afirmacao: "ConcreteCreator (TransportadoraRodoviaria)", correspondencia: "Subclasse do Creator que sobrescreve o método fábrica para devolver um produto específico." }),
                    new Par({ id: "r1p5", afirmacao: "ConcreteProduct (Caminhao)", correspondencia: "Implementação concreta do produto, devolvida por um ConcreteCreator específico." }),
                ]
            }),
        ]
    }),

    new Licao({
        id: "licao-factory-002",
        dificuldade: Dificuldade.Normal,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Factory Method",
        conteudoMarkdown: CONTEUDO_LICAO_FACTORY_002
    }),

    new CompleteCodigo({
        id: "cc-factory-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Factory Method",
        codigos: [
            new CodigoIncompleto({
                id: "cc1",
                arquivo: "TransportadoraMaritima.java",
                linguagem: "java",
                respostaCorretaId: "cc1-t1",
                explicacao: "TransportadoraMaritima precisa sobrescrever criarTransporte() devolvendo um Navio. Sobrescrever despachar() direto quebra o Factory Method (o Creator deixaria de decidir o produto através do método fábrica), e reduzir a visibilidade para private nem compila — Java não permite reduzir a visibilidade de um método ao sobrescrevê-lo.",
                template:
`public class TransportadoraMaritima extends Transportadora {
{{1}}
}`,
                opcoes: [
                    new Trecho({ id: "cc1-t1", codigo: `    public Transporte criarTransporte() {\n        return new Navio();\n    }` }),
                    new Trecho({ id: "cc1-t2", codigo: `    public Transporte criarTransporte() {\n        return new Caminhao();\n    }` }),
                    new Trecho({ id: "cc1-t3", codigo: `    public void despachar(String pacote) {\n        new Navio().entregar(pacote);\n    }` }),
                    new Trecho({ id: "cc1-t4", codigo: `    private Transporte criarTransporte() {\n        return new Navio();\n    }` }),
                ]
            }),
        ]
    }),

    new EncontreBug({
        id: "eb-factory-002",
        dificuldade: Dificuldade.Dificil,
        grupo: "Criacionais",
        nivel: 3,
        padrao: "Factory Method",
        perguntas: [
            new PerguntaBug({
                id: "pb1",
                enunciado: "Qual é o problema deste painel de controle, mesmo ele \"funcionando\" pra caminhão e navio?",
                explicacao: "O Factory Method existe justamente pra centralizar \"qual produto criar\" dentro do Creator (via criarTransporte()). Esse painel ignora isso e refaz a decisão na mão com instanceof — se amanhã surgir TransportadoraAerea, esse método vai continuar caindo no else e criando um Caminhao errado, sem nenhum erro de compilação avisando. O jeito certo seria chamar transportadora.despachar(pacote).",
                respostas: [
                    new RespostaBug({ id: "pb1-r1", texto: "Nenhum problema, esse é só outro jeito válido de usar o Factory Method." }),
                    new RespostaBug({ id: "pb1-r2", texto: "processarEntrega reimplementa com instanceof a decisão que já existe em cada ConcreteCreator, e quebra silenciosamente ao surgir um novo tipo de transportadora.", correta: true }),
                    new RespostaBug({ id: "pb1-r3", texto: "O método processarEntrega deveria ser estático." }),
                    new RespostaBug({ id: "pb1-r4", texto: "Transportadora deveria implementar Transporte diretamente." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb1-a1",
                        nome: "Transportadora.java",
                        linguagem: "java",
                        codigo:
`public abstract class Transportadora {
    public abstract Transporte criarTransporte();

    public void despachar(String pacote) {
        Transporte transporte = criarTransporte();
        transporte.entregar(pacote);
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a2",
                        nome: "TransportadoraMaritima.java",
                        linguagem: "java",
                        codigo:
`public class TransportadoraMaritima extends Transportadora {
    public Transporte criarTransporte() {
        return new Navio();
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a3",
                        nome: "PainelDeControle.java",
                        linguagem: "java",
                        codigo:
`public class PainelDeControle {
    public void processarEntrega(Transportadora transportadora, String pacote) {
        Transporte transporte;

        if (transportadora instanceof TransportadoraMaritima) {
            transporte = new Navio();
        } else {
            transporte = new Caminhao();
        }

        transporte.entregar(pacote);
    }
}`
                    }),
                ]
            }),
        ]
    }),

    new Licao({
        id: "licao-factory-003",
        dificuldade: Dificuldade.Dificil,
        grupo: "Criacionais",
        nivel: 3,
        padrao: "Factory Method",
        conteudoMarkdown: CONTEUDO_LICAO_FACTORY_003
    }),

    new Licao({
        id: "licao-prototype-001",
        dificuldade: Dificuldade.Facil,
        grupo: "Criacionais",
        nivel: 1,
        padrao: "Prototype",
        conteudoMarkdown: CONTEUDO_LICAO_PROTOTYPE_001
    }),

    new Quiz({
        id: "quiz-prototype-001",
        dificuldade: Dificuldade.Facil,
        padrao: "Prototype",
        grupo: "Criacionais",
        nivel: 1,
        tipo: TipoDesafio.PerguntasRespostas,
        perguntas: [
            new Pergunta({
                id: "p1",
                texto: "Qual das afirmações abaixo descreve melhor o padrão Prototype?",
                repostas: [
                    new Resposta({ id: "p1r1", texto: "Garante que uma classe tenha apenas uma instância e fornece um ponto global de acesso." }),
                    new Resposta({ id: "p1r2", texto: "Cria novos objetos clonando uma instância existente, em vez de construir do zero.", correta: true }),
                    new Resposta({ id: "p1r3", texto: "Delega para subclasses a decisão de qual classe concreta instanciar." }),
                    new Resposta({ id: "p1r4", texto: "Constrói um objeto complexo passo a passo." }),
                ]
            }),
            new Pergunta({
                id: "p2",
                texto: "No exemplo do caminhão-modelo, o que o método clonar() faz?",
                repostas: [
                    new Resposta({ id: "p2r1", texto: "Cria uma instância nova, copiando os valores do caminhão atual.", correta: true }),
                    new Resposta({ id: "p2r2", texto: "Retorna a própria instância do caminhão original." }),
                    new Resposta({ id: "p2r3", texto: "Cria um caminhão vazio, sem nenhum valor configurado." }),
                    new Resposta({ id: "p2r4", texto: "Apaga o caminhão original e cria outro no lugar." }),
                ]
            }),
            new Pergunta({
                id: "p3",
                texto: "Por que o Prototype é útil quando um objeto é caro ou trabalhoso de configurar?",
                repostas: [
                    new Resposta({ id: "p3r1", texto: "Porque clonar evita repetir a mesma configuração trabalhosa toda vez.", correta: true }),
                    new Resposta({ id: "p3r2", texto: "Porque clonar é sempre mais rápido do que qualquer construtor, em qualquer caso." }),
                    new Resposta({ id: "p3r3", texto: "Porque clonar remove a necessidade de testar o objeto." }),
                    new Resposta({ id: "p3r4", texto: "Porque objetos clonados não ocupam memória adicional." }),
                ]
            }),
            new Pergunta({
                id: "p4",
                texto: "O que diferencia uma clonagem rasa de uma clonagem profunda?",
                repostas: [
                    new Resposta({ id: "p4r1", texto: "Clonagem rasa é sempre mais lenta que a profunda." }),
                    new Resposta({ id: "p4r2", texto: "Clonagem profunda também clona os objetos internos referenciados; a rasa só copia a referência.", correta: true }),
                    new Resposta({ id: "p4r3", texto: "Clonagem rasa só existe em Java; a profunda funciona em qualquer linguagem." }),
                    new Resposta({ id: "p4r4", texto: "Não há diferença prática entre as duas." }),
                ]
            }),
        ]
    }),

    new CompleteTexto({
        id: "ct-prototype-001",
        dificuldade: Dificuldade.Normal,
        grupo: "Criacionais",
        nivel: 1,
        padrao: "Prototype",
        textos: [
            new Texto({
                id: "t1",
                texto: "O padrão {{1}} cria novos objetos {{2}} uma instância existente, em vez de {{3}} do zero.",
                opcoes: ["Prototype", "clonando", "construir", "Builder", "herdando", "destruir"],
                respostas: ["Prototype", "clonando", "construir"]
            }),
            new Texto({
                id: "t2",
                texto: "Uma cópia {{1}} copia apenas a referência de objetos internos, enquanto uma cópia {{2}} clona também esses objetos, tornando o clone totalmente {{3}} do original.",
                opcoes: ["rasa", "profunda", "independente", "estática", "privada", "acoplado"],
                respostas: ["rasa", "profunda", "independente"]
            }),
            new Texto({
                id: "t3",
                texto: "Um {{1}} de protótipos guarda objetos pré-configurados num catálogo, permitindo {{2}} um deles pelo {{3}} em vez de reconstruir os detalhes de configuração.",
                opcoes: ["registro", "clonar", "nome", "construtor", "apagar", "índice"],
                respostas: ["registro", "clonar", "nome"]
            }),
        ]
    }),

    new EncontreBug({
        id: "eb-prototype-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Prototype",
        perguntas: [
            new PerguntaBug({
                id: "pb1",
                enunciado: "Qual das alternativas descreve corretamente o problema deste código?",
                explicacao: "clonar() deveria copiar os valores de this (cor, capacidadeToneladas, motorizacao) pro novo objeto, mas devolve valores fixos (\"Branco\", 4, \"Flex\") que ignoram a configuração do caminhão original. Por isso pedido.getCor() imprime \"Branco\" mesmo clonando um caminhão \"Prata\" — o clone não é de fato uma cópia do original.",
                respostas: [
                    new RespostaBug({ id: "pb1-r1", texto: "Não há problema, clonar() está implementado corretamente." }),
                    new RespostaBug({ id: "pb1-r2", texto: "clonar() ignora os valores do caminhão atual e devolve sempre um caminhão com valores fixos (\"Branco\", 4, \"Flex\").", correta: true }),
                    new RespostaBug({ id: "pb1-r3", texto: "O construtor de Caminhao deveria ser privado." }),
                    new RespostaBug({ id: "pb1-r4", texto: "getCor() deveria ser um método estático." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb1-a1",
                        nome: "Caminhao.java",
                        linguagem: "java",
                        codigo:
`public class Caminhao {
    private String cor;
    private int capacidadeToneladas;
    private String motorizacao;

    public Caminhao(String cor, int capacidadeToneladas, String motorizacao) {
        this.cor = cor;
        this.capacidadeToneladas = capacidadeToneladas;
        this.motorizacao = motorizacao;
    }

    public Caminhao clonar() {
        return new Caminhao("Branco", 4, "Flex");
    }

    public String getCor() {
        return cor;
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
        Caminhao modeloExecutivo = new Caminhao("Prata", 12, "Diesel V8");
        Caminhao pedido = modeloExecutivo.clonar();

        System.out.println(pedido.getCor());
    }
}`
                    }),
                ]
            }),
        ]
    }),

    new EncontrePares({
        id: "ep-prototype-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Prototype",
        rodadas: [
            new Rodada({
                id: "r1",
                pares: [
                    new Par({ id: "r1p1", afirmacao: "Prototype", correspondencia: "Cria novos objetos clonando uma instância existente." }),
                    new Par({ id: "r1p2", afirmacao: "clonar() / clone()", correspondencia: "Método que devolve uma cópia do objeto atual." }),
                    new Par({ id: "r1p3", afirmacao: "Cópia rasa", correspondencia: "Copia campos simples, mas reaproveita a referência de objetos internos." }),
                    new Par({ id: "r1p4", afirmacao: "Cópia profunda", correspondencia: "Clona também os objetos internos, tornando o clone independente do original." }),
                    new Par({ id: "r1p5", afirmacao: "Prototype Registry", correspondencia: "Catálogo de protótipos prontos, clonados a partir de um nome." }),
                ]
            }),
        ]
    }),

    new Licao({
        id: "licao-prototype-002",
        dificuldade: Dificuldade.Normal,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Prototype",
        conteudoMarkdown: CONTEUDO_LICAO_PROTOTYPE_002
    }),

    new CompleteCodigo({
        id: "cc-prototype-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Prototype",
        codigos: [
            new CodigoIncompleto({
                id: "cc1",
                arquivo: "Caminhao.java",
                linguagem: "java",
                respostaCorretaId: "cc1-t1",
                explicacao: "clonar() precisa criar uma NOVA instância copiando os valores atuais (this.cor, this.capacidadeToneladas, this.motorizacao). Devolver \"this\" não cria cópia nenhuma — qualquer mudança no \"clone\" afetaria o original também, já que seriam o mesmo objeto. E marcar o método como private impede que qualquer código fora da classe consiga clonar o caminhão.",
                template:
`public class Caminhao {
    private String cor;
    private int capacidadeToneladas;
    private String motorizacao;

    public Caminhao(String cor, int capacidadeToneladas, String motorizacao) {
        this.cor = cor;
        this.capacidadeToneladas = capacidadeToneladas;
        this.motorizacao = motorizacao;
    }

{{1}}
}`,
                opcoes: [
                    new Trecho({ id: "cc1-t1", codigo: `    public Caminhao clonar() {\n        return new Caminhao(this.cor, this.capacidadeToneladas, this.motorizacao);\n    }` }),
                    new Trecho({ id: "cc1-t2", codigo: `    public Caminhao clonar() {\n        return new Caminhao("Branco", 4, "Flex");\n    }` }),
                    new Trecho({ id: "cc1-t3", codigo: `    public Caminhao clonar() {\n        return this;\n    }` }),
                    new Trecho({ id: "cc1-t4", codigo: `    private Caminhao clonar() {\n        return new Caminhao(this.cor, this.capacidadeToneladas, this.motorizacao);\n    }` }),
                ]
            }),
        ]
    }),

    new EncontreBug({
        id: "eb-prototype-002",
        dificuldade: Dificuldade.Dificil,
        grupo: "Criacionais",
        nivel: 3,
        padrao: "Prototype",
        perguntas: [
            new PerguntaBug({
                id: "pb1",
                enunciado: "O que esse código imprime, e por quê?",
                explicacao: "clonar() faz uma cópia RASA: ele passa this.rotasAtendidas direto pro novo Caminhao, então original e clone acabam apontando pra MESMA List. Quando \"Zona Sul\" é adicionada pela referência do clone, o original enxerga essa mudança também — o tamanho da lista do original passa a ser 2. Pra evitar isso, clonar() precisaria criar uma nova List (cópia profunda): new ArrayList<>(this.rotasAtendidas).",
                respostas: [
                    new RespostaBug({ id: "pb1-r1", texto: "1, porque o clone e o original têm listas de rotas independentes." }),
                    new RespostaBug({ id: "pb1-r2", texto: "2, porque clonar() copia a referência da mesma List, então adicionar uma rota pelo clone também afeta o original (cópia rasa).", correta: true }),
                    new RespostaBug({ id: "pb1-r3", texto: "0, porque clonar() reseta a lista de rotas do clone." }),
                    new RespostaBug({ id: "pb1-r4", texto: "O código não compila." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb1-a1",
                        nome: "Caminhao.java",
                        linguagem: "java",
                        codigo:
`import java.util.List;

public class Caminhao {
    private String cor;
    private List<String> rotasAtendidas;

    public Caminhao(String cor, List<String> rotasAtendidas) {
        this.cor = cor;
        this.rotasAtendidas = rotasAtendidas;
    }

    public Caminhao clonar() {
        return new Caminhao(this.cor, this.rotasAtendidas);
    }

    public List<String> getRotasAtendidas() {
        return rotasAtendidas;
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a2",
                        nome: "App.java",
                        linguagem: "java",
                        codigo:
`import java.util.ArrayList;
import java.util.List;

public class App {
    public static void main(String[] args) {
        List<String> rotas = new ArrayList<>();
        rotas.add("Centro");

        Caminhao original = new Caminhao("Prata", rotas);
        Caminhao clone = original.clonar();

        clone.getRotasAtendidas().add("Zona Sul");

        System.out.println(original.getRotasAtendidas().size());
    }
}`
                    }),
                ]
            }),
        ]
    }),

    new Licao({
        id: "licao-prototype-003",
        dificuldade: Dificuldade.Dificil,
        grupo: "Criacionais",
        nivel: 3,
        padrao: "Prototype",
        conteudoMarkdown: CONTEUDO_LICAO_PROTOTYPE_003
    }),

    new Licao({
        id: "licao-builder-001",
        dificuldade: Dificuldade.Facil,
        grupo: "Criacionais",
        nivel: 1,
        padrao: "Builder",
        conteudoMarkdown: CONTEUDO_LICAO_BUILDER_001
    }),

    new Quiz({
        id: "quiz-builder-001",
        dificuldade: Dificuldade.Facil,
        padrao: "Builder",
        grupo: "Criacionais",
        nivel: 1,
        tipo: TipoDesafio.PerguntasRespostas,
        perguntas: [
            new Pergunta({
                id: "p1",
                texto: "Qual das afirmações abaixo descreve melhor o padrão Builder?",
                repostas: [
                    new Resposta({ id: "p1r1", texto: "Garante que uma classe tenha apenas uma instância." }),
                    new Resposta({ id: "p1r2", texto: "Constrói um objeto complexo passo a passo, permitindo configurar só o que for necessário.", correta: true }),
                    new Resposta({ id: "p1r3", texto: "Cria novos objetos clonando uma instância existente." }),
                    new Resposta({ id: "p1r4", texto: "Delega para subclasses a decisão de qual classe concreta instanciar." }),
                ]
            }),
            new Pergunta({
                id: "p2",
                texto: "Por que os métodos de um Builder normalmente retornam this?",
                repostas: [
                    new Resposta({ id: "p2r1", texto: "Pra permitir encadear várias chamadas seguidas, tipo .comMotor(...).comCapacidade(...).", correta: true }),
                    new Resposta({ id: "p2r2", texto: "Porque Java exige que todo método retorne algum valor." }),
                    new Resposta({ id: "p2r3", texto: "Pra evitar que o Builder seja usado mais de uma vez." }),
                    new Resposta({ id: "p2r4", texto: "Pra impedir que o objeto final seja modificado depois." }),
                ]
            }),
            new Pergunta({
                id: "p3",
                texto: "Qual problema o Builder resolve em relação a um construtor com muitos parâmetros opcionais (o \"construtor telescópico\")?",
                repostas: [
                    new Resposta({ id: "p3r1", texto: "Evita ter que passar todos os parâmetros de uma vez, inclusive os que não importam pro caso atual.", correta: true }),
                    new Resposta({ id: "p3r2", texto: "Torna o objeto final imutável automaticamente." }),
                    new Resposta({ id: "p3r3", texto: "Elimina a necessidade de um construtor na classe." }),
                    new Resposta({ id: "p3r4", texto: "Garante que o objeto seja criado numa única thread." }),
                ]
            }),
            new Pergunta({
                id: "p4",
                texto: "O que o método final do Builder (geralmente construir()/build()) faz?",
                repostas: [
                    new Resposta({ id: "p4r1", texto: "Monta e devolve o objeto final, já com todas as configurações escolhidas.", correta: true }),
                    new Resposta({ id: "p4r2", texto: "Reseta o builder para os valores padrão." }),
                    new Resposta({ id: "p4r3", texto: "Apaga os métodos fluentes já chamados." }),
                    new Resposta({ id: "p4r4", texto: "Clona o builder atual em um novo builder." }),
                ]
            }),
        ]
    }),

    new CompleteTexto({
        id: "ct-builder-001",
        dificuldade: Dificuldade.Normal,
        grupo: "Criacionais",
        nivel: 1,
        padrao: "Builder",
        textos: [
            new Texto({
                id: "t1",
                texto: "O padrão {{1}} constrói um objeto complexo {{2}} a passo, permitindo configurar apenas o que for {{3}}.",
                opcoes: ["Builder", "passo", "necessário", "Prototype", "tudo", "opcional"],
                respostas: ["Builder", "passo", "necessário"]
            }),
            new Texto({
                id: "t2",
                texto: "Cada método fluente do Builder retorna {{1}}, permitindo {{2}} várias chamadas seguidas, um estilo conhecido como {{3}} interface.",
                opcoes: ["this", "encadear", "fluent", "null", "interromper", "abstract"],
                respostas: ["this", "encadear", "fluent"]
            }),
            new Texto({
                id: "t3",
                texto: "O método final do Builder, geralmente chamado {{1}}, monta e devolve o {{2}} pronto, já com todas as {{3}} escolhidas.",
                opcoes: ["construir()", "objeto", "configurações", "clonar()", "protótipo", "instâncias"],
                respostas: ["construir()", "objeto", "configurações"]
            }),
        ]
    }),

    new EncontreBug({
        id: "eb-builder-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Builder",
        perguntas: [
            new PerguntaBug({
                id: "pb1",
                enunciado: "Qual das alternativas descreve corretamente o problema deste código?",
                explicacao: "comCapacidade() retorna this (então o encadeamento não quebra), mas nunca atribui o valor recebido ao campo capacidadeToneladas. Por isso o caminhão sempre sai com a capacidade padrão (4), mesmo pedindo 12 explicitamente.",
                respostas: [
                    new RespostaBug({ id: "pb1-r1", texto: "Não há problema, o Builder está implementado corretamente." }),
                    new RespostaBug({ id: "pb1-r2", texto: "comCapacidade() retorna this mas nunca atribui o valor recebido a capacidadeToneladas, então o caminhão sempre sai com a capacidade padrão.", correta: true }),
                    new RespostaBug({ id: "pb1-r3", texto: "O construtor de Caminhao deveria ser público." }),
                    new RespostaBug({ id: "pb1-r4", texto: "comMotor() deveria retornar void." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb1-a1",
                        nome: "CaminhaoBuilder.java",
                        linguagem: "java",
                        codigo:
`public class CaminhaoBuilder {
    private String motor = "Diesel";
    private int capacidadeToneladas = 4;

    public CaminhaoBuilder comMotor(String motor) {
        this.motor = motor;
        return this;
    }

    public CaminhaoBuilder comCapacidade(int toneladas) {
        return this;
    }

    public Caminhao construir() {
        return new Caminhao(motor, capacidadeToneladas);
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a2",
                        nome: "Caminhao.java",
                        linguagem: "java",
                        codigo:
`public class Caminhao {
    private final String motor;
    private final int capacidadeToneladas;

    public Caminhao(String motor, int capacidadeToneladas) {
        this.motor = motor;
        this.capacidadeToneladas = capacidadeToneladas;
    }

    public int getCapacidadeToneladas() {
        return capacidadeToneladas;
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
        Caminhao caminhao = new CaminhaoBuilder()
            .comMotor("Diesel V8")
            .comCapacidade(12)
            .construir();

        System.out.println(caminhao.getCapacidadeToneladas());
    }
}`
                    }),
                ]
            }),
        ]
    }),

    new EncontrePares({
        id: "ep-builder-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Builder",
        rodadas: [
            new Rodada({
                id: "r1",
                pares: [
                    new Par({ id: "r1p1", afirmacao: "Builder", correspondencia: "Constrói um objeto complexo passo a passo." }),
                    new Par({ id: "r1p2", afirmacao: "Fluent interface", correspondencia: "Estilo de encadear chamadas de método, cada uma retornando this." }),
                    new Par({ id: "r1p3", afirmacao: "Director", correspondencia: "Classe opcional que conhece receitas prontas de construção usando o Builder." }),
                    new Par({ id: "r1p4", afirmacao: "construir() / build()", correspondencia: "Método final que monta e devolve o objeto pronto." }),
                    new Par({ id: "r1p5", afirmacao: "Construtor telescópico", correspondencia: "Problema de ter um construtor com muitos parâmetros opcionais combináveis, difícil de ler." }),
                ]
            }),
        ]
    }),

    new Licao({
        id: "licao-builder-002",
        dificuldade: Dificuldade.Normal,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Builder",
        conteudoMarkdown: CONTEUDO_LICAO_BUILDER_002
    }),

    new CompleteCodigo({
        id: "cc-builder-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Builder",
        codigos: [
            new CodigoIncompleto({
                id: "cc1",
                arquivo: "CaminhaoBuilder.java",
                linguagem: "java",
                respostaCorretaId: "cc1-t1",
                explicacao: "Métodos fluentes de um Builder precisam retornar this pra permitir encadear chamadas (ex.: builder.comMotor(\"Diesel V8\").comReboque()). Retornar null ou uma instância nova quebra a cadeia — a nova instância não teria o motor já configurado, e null faria a próxima chamada lançar NullPointerException.",
                template:
`public class CaminhaoBuilder {
    private String motor = "Diesel";
    private boolean temReboque = false;

    public CaminhaoBuilder comMotor(String motor) {
        this.motor = motor;
        return this;
    }

    public CaminhaoBuilder comReboque() {
        this.temReboque = true;
{{1}}
    }
}`,
                opcoes: [
                    new Trecho({ id: "cc1-t1", codigo: `        return this;` }),
                    new Trecho({ id: "cc1-t2", codigo: `        return null;` }),
                    new Trecho({ id: "cc1-t3", codigo: `        return new CaminhaoBuilder();` }),
                    new Trecho({ id: "cc1-t4", codigo: `        // nada a retornar` }),
                ]
            }),
        ]
    }),

    new EncontreBug({
        id: "eb-builder-002",
        dificuldade: Dificuldade.Dificil,
        grupo: "Criacionais",
        nivel: 3,
        padrao: "Builder",
        perguntas: [
            new PerguntaBug({
                id: "pb1",
                enunciado: "O que acontece com caminhao1.getOpcionais() depois que o código monta o segundo caminhão?",
                explicacao: "construir() passa builder.opcionais direto pro Caminhao, sem copiar — então caminhao1 e caminhao2 acabam compartilhando a MESMA List (a que está dentro do builder reutilizado). Quando \"Gancho reforçado\" é adicionado depois de montar o primeiro caminhão, ele aparece também na lista de caminhao1, mesmo esse já estando \"pronto\". O jeito seguro é copiar a lista no construtor: new ArrayList<>(builder.opcionais).",
                respostas: [
                    new RespostaBug({ id: "pb1-r1", texto: "Nada muda, caminhao1 e caminhao2 têm listas de opcionais independentes." }),
                    new RespostaBug({ id: "pb1-r2", texto: "O tamanho da lista de caminhao1 também aumenta — os dois caminhões compartilham a mesma List de opcionais.", correta: true }),
                    new RespostaBug({ id: "pb1-r3", texto: "O código lança uma exceção ao montar o segundo caminhão." }),
                    new RespostaBug({ id: "pb1-r4", texto: "A lista de opcionais de caminhao1 é esvaziada." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb1-a1",
                        nome: "CaminhaoBuilder.java",
                        linguagem: "java",
                        codigo:
`import java.util.ArrayList;
import java.util.List;

public class CaminhaoBuilder {
    private List<String> opcionais = new ArrayList<>();

    public CaminhaoBuilder comOpcional(String item) {
        this.opcionais.add(item);
        return this;
    }

    public Caminhao construir() {
        return new Caminhao(this.opcionais);
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a2",
                        nome: "Caminhao.java",
                        linguagem: "java",
                        codigo:
`import java.util.List;

public class Caminhao {
    private final List<String> opcionais;

    public Caminhao(List<String> opcionais) {
        this.opcionais = opcionais;
    }

    public List<String> getOpcionais() {
        return opcionais;
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
        CaminhaoBuilder builder = new CaminhaoBuilder();

        Caminhao caminhao1 = builder.comOpcional("Ar-condicionado").construir();

        builder.comOpcional("Gancho reforçado");
        Caminhao caminhao2 = builder.construir();

        System.out.println(caminhao1.getOpcionais().size());
    }
}`
                    }),
                ]
            }),
        ]
    }),

    new Licao({
        id: "licao-builder-003",
        dificuldade: Dificuldade.Dificil,
        grupo: "Criacionais",
        nivel: 3,
        padrao: "Builder",
        conteudoMarkdown: CONTEUDO_LICAO_BUILDER_003
    }),
];
