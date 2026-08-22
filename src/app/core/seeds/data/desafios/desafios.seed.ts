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

    // ═══════════════════════════════════════════════════════════════════════════════════════
    // Singleton — continuação (fases 5-10). As fases 1-4 (licao-singleton-001, quiz-singleton-001,
    // eb-singleton-001, ct-singleton-001) já existem acima, mas não estavam ligadas a nenhuma
    // região — agora fazem parte do arco de 10 fases do padrão junto com estas.
    // ═══════════════════════════════════════════════════════════════════════════════════════

    new EncontrePares({
        id: "ep-singleton-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Singleton",
        rodadas: [
            new Rodada({
                id: "r1",
                pares: [
                    new Par({ id: "r1p1", afirmacao: "Eager Initialization", correspondencia: "Cria a instância assim que a classe é carregada, mesmo que ela nunca chegue a ser usada." }),
                    new Par({ id: "r1p2", afirmacao: "Lazy Initialization", correspondencia: "Só cria a instância na primeira vez que alguém chama getInstance()." }),
                    new Par({ id: "r1p3", afirmacao: "Double-Checked Locking", correspondencia: "Verifica se a instância é nula duas vezes, sincronizando só a primeira criação." }),
                    new Par({ id: "r1p4", afirmacao: "Enum Singleton", correspondencia: "Usa um enum de um único valor pra garantir instância única e serialização segura de graça." }),
                ]
            }),
            new Rodada({
                id: "r2",
                pares: [
                    new Par({ id: "r2p1", afirmacao: "Estado global", correspondencia: "Qualquer parte do sistema pode ler e alterar os mesmos dados, dificultando rastrear bugs." }),
                    new Par({ id: "r2p2", afirmacao: "Testabilidade ruim", correspondencia: "Testes unitários não conseguem isolar ou trocar a instância única por um dublê de teste facilmente." }),
                    new Par({ id: "r2p3", afirmacao: "Quebra por Reflection", correspondencia: "Código externo torna o construtor privado acessível na marra e cria uma segunda instância." }),
                    new Par({ id: "r2p4", afirmacao: "Quebra por Serialização", correspondencia: "Desserializar o objeto sem cuidado gera uma nova instância diferente da original." }),
                ]
            }),
        ]
    }),

    new Licao({
        id: "licao-singleton-002",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Singleton",
        conteudoMarkdown: [
            '# Singleton: a estrutura completa 🐝',
            '',
            'A versão mais simples do Singleton (a que você viu na primeira lição) funciona bem enquanto só existe uma abelha operária mexendo com o `getInstance()` por vez. Mas a colmeia é um lugar concorrido — várias abelhas (threads) podem chamar `getInstance()` ao mesmo tempo, e é aí que a implementação ingênua quebra.',
            '',
            '## Eager vs. Lazy Initialization',
            '',
            'Existem duas estratégias básicas pra decidir *quando* a instância é criada:',
            '',
            '| Estratégia | Quando cria | Vantagem | Desvantagem |',
            '|---|---|---|---|',
            '| **Eager** | Assim que a classe é carregada pela JVM | Simples, thread-safe de graça | Cria o objeto mesmo que ele nunca seja usado |',
            '| **Lazy** | Só na primeira chamada de `getInstance()` | Só gasta recursos se for realmente usada | Precisa de cuidado extra pra ser thread-safe |',
            '',
            '```java',
            '// Eager: a própria JVM garante que só roda uma vez, na carga da classe.',
            'public class ConfigDaColmeia {',
            '    private static final ConfigDaColmeia instancia = new ConfigDaColmeia();',
            '',
            '    private ConfigDaColmeia() {}',
            '',
            '    public static ConfigDaColmeia getInstance() {',
            '        return instancia;',
            '    }',
            '}',
            '```',
            '',
            '## O problema da Lazy Initialization ingênua',
            '',
            'Se duas threads chamarem `getInstance()` ao mesmo tempo e ambas passarem pelo `if (instancia == null)` antes de qualquer uma delas atribuir o valor, as duas vão criar sua própria instância — quebrando a garantia do padrão.',
            '',
            '```mermaid',
            'sequenceDiagram',
            '    participant T1 as Thread 1',
            '    participant T2 as Thread 2',
            '    participant S as Singleton.instancia',
            '    T1->>S: if (instancia == null)? SIM',
            '    T2->>S: if (instancia == null)? SIM',
            '    T1->>S: cria instância A',
            '    T2->>S: cria instância B',
            '    Note over S: Duas instâncias diferentes — o padrão quebrou!',
            '```',
            '',
            '## Double-Checked Locking',
            '',
            'A solução clássica é verificar a condição *duas vezes*: uma vez sem sincronizar (rápido, pro caso comum onde a instância já existe) e outra vez dentro de um bloco sincronizado (só quando a instância ainda não existe):',
            '',
            '```java',
            'public class ConfigDaColmeia {',
            '    private static volatile ConfigDaColmeia instancia;',
            '',
            '    private ConfigDaColmeia() {}',
            '',
            '    public static ConfigDaColmeia getInstance() {',
            '        if (instancia == null) {',
            '            synchronized (ConfigDaColmeia.class) {',
            '                if (instancia == null) {',
            '                    instancia = new ConfigDaColmeia();',
            '                }',
            '            }',
            '        }',
            '        return instancia;',
            '    }',
            '}',
            '```',
            '',
            'O `volatile` aqui não é detalhe: sem ele, o compilador (ou o processador) pode reordenar as instruções de forma que outra thread enxergue uma referência não-nula apontando pra um objeto ainda **não totalmente construído**.',
            '',
            '## Enum Singleton',
            '',
            'Em Java, a forma recomendada por Joshua Bloch (autor de *Effective Java*) é usar um `enum` de um único valor — a própria linguagem garante instância única, thread-safety na inicialização e resistência a ataques por reflection e serialização:',
            '',
            '```java',
            'public enum ConfigDaColmeia {',
            '    INSTANCIA;',
            '',
            '    public void carregarConfiguracoes() {',
            '        // ...',
            '    }',
            '}',
            '',
            '// Uso:',
            'ConfigDaColmeia.INSTANCIA.carregarConfiguracoes();',
            '```',
        ].join('\n')
    }),

    new CompleteCodigo({
        id: "cc-singleton-001",
        dificuldade: Dificuldade.Dificil,
        grupo: "Criacionais",
        nivel: 2,
        padrao: "Singleton",
        codigos: [
            new CodigoIncompleto({
                id: "cc1",
                arquivo: "SingletonThreadSafe.java",
                linguagem: "java",
                respostaCorretaId: "cc1-t1",
                explicacao: "O double-checked locking precisa verificar \"instancia == null\" de novo DENTRO do bloco sincronizado — senão, duas threads que passaram pela primeira checagem ao mesmo tempo ainda criariam duas instâncias assim que entrassem no bloco, uma depois da outra.",
                template:
`public class SingletonThreadSafe {
    private static volatile SingletonThreadSafe instancia;

    private SingletonThreadSafe() {}

    public static SingletonThreadSafe getInstance() {
        if (instancia == null) {
            synchronized (SingletonThreadSafe.class) {
{{1}}
            }
        }
        return instancia;
    }
}`,
                opcoes: [
                    new Trecho({ id: "cc1-t1", codigo: `                if (instancia == null) {\n                    instancia = new SingletonThreadSafe();\n                }` }),
                    new Trecho({ id: "cc1-t2", codigo: `                instancia = new SingletonThreadSafe();` }),
                    new Trecho({ id: "cc1-t3", codigo: `                if (instancia != null) {\n                    instancia = new SingletonThreadSafe();\n                }` }),
                    new Trecho({ id: "cc1-t4", codigo: `                return new SingletonThreadSafe();` }),
                ]
            }),
            new CodigoIncompleto({
                id: "cc2",
                arquivo: "SingletonEnum.java",
                linguagem: "java",
                respostaCorretaId: "cc2-t1",
                explicacao: "Um enum de um único valor já é a instância — não precisa (e não pode) instanciar nada com \"new\" dentro dele. Declarar dois valores (ex.: INSTANCIA, OUTRA) quebraria a garantia de instância única.",
                template:
`public enum SingletonEnum {
{{1}}

    public void executar() {
        System.out.println("Executando...");
    }
}`,
                opcoes: [
                    new Trecho({ id: "cc2-t1", codigo: `    INSTANCIA;` }),
                    new Trecho({ id: "cc2-t2", codigo: `    INSTANCIA, OUTRA;` }),
                    new Trecho({ id: "cc2-t3", codigo: `    private static SingletonEnum instancia = new SingletonEnum();` }),
                    new Trecho({ id: "cc2-t4", codigo: `    INSTANCIA();\n    private SingletonEnum instancia;` }),
                ]
            }),
        ]
    }),

    new EncontreBug({
        id: "eb-singleton-002",
        dificuldade: Dificuldade.Dificil,
        grupo: "Criacionais",
        nivel: 3,
        padrao: "Singleton",
        perguntas: [
            new PerguntaBug({
                id: "pb1",
                enunciado: "Esse Singleton com double-checked locking tem um bug sutil de concorrência. Qual é o problema?",
                explicacao: "O campo \"instancia\" não é \"volatile\". Sem isso, o compilador/processador pode reordenar as instruções de \"new Singleton()\" de forma que outra thread veja uma referência não-nula apontando pra um objeto ainda parcialmente construído — um bug que só aparece em produção, sob concorrência real.",
                respostas: [
                    new RespostaBug({ id: "pb1-r1", texto: "O construtor deveria ser público para permitir testes." }),
                    new RespostaBug({ id: "pb1-r2", texto: "O campo \"instancia\" precisa ser \"volatile\" para impedir reordenação de instruções entre threads.", correta: true }),
                    new RespostaBug({ id: "pb1-r3", texto: "O método getInstance() deveria retornar uma cópia da instância." }),
                    new RespostaBug({ id: "pb1-r4", texto: "O bloco \"synchronized\" deveria envolver a classe inteira, não só o método." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb1-a1",
                        nome: "Singleton.java",
                        linguagem: "java",
                        codigo:
`public class Singleton {
    private static Singleton instancia;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instancia == null) {
            synchronized (Singleton.class) {
                if (instancia == null) {
                    instancia = new Singleton();
                }
            }
        }
        return instancia;
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a2",
                        nome: "ServidorApp.java",
                        linguagem: "java",
                        codigo:
`public class ServidorApp {
    public static void main(String[] args) {
        Runnable tarefa = () -> {
            Singleton s = Singleton.getInstance();
            s.processar();
        };

        new Thread(tarefa).start();
        new Thread(tarefa).start();
        new Thread(tarefa).start();
    }
}`
                    }),
                ]
            }),
            new PerguntaBug({
                id: "pb2",
                enunciado: "Essa classe implementa Cloneable sem cuidado especial. Qual consequência isso tem para o Singleton?",
                explicacao: "Como Singleton implementa Cloneable e não sobrescreve clone(), chamar \"getInstance().clone()\" cria uma SEGUNDA instância independente da original — quebrando a garantia de instância única, mesmo com o construtor privado intacto.",
                respostas: [
                    new RespostaBug({ id: "pb2-r1", texto: "Nenhuma — Cloneable não afeta o Singleton de forma alguma." }),
                    new RespostaBug({ id: "pb2-r2", texto: "clone() lança uma exceção automaticamente para qualquer Singleton." }),
                    new RespostaBug({ id: "pb2-r3", texto: "clone() cria uma segunda instância independente, quebrando a garantia de instância única.", correta: true }),
                    new RespostaBug({ id: "pb2-r4", texto: "clone() sempre retorna a mesma referência da instância original, então não há problema." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb2-a1",
                        nome: "Singleton.java",
                        linguagem: "java",
                        codigo:
`public class Singleton implements Cloneable {
    private static Singleton instancia;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instancia == null) {
            instancia = new Singleton();
        }
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
    public static void main(String[] args) throws CloneNotSupportedException {
        Singleton a = Singleton.getInstance();
        Singleton b = (Singleton) a.clone();

        System.out.println(a == b);
    }
}`
                    }),
                ]
            }),
        ]
    }),

    new Licao({
        id: "licao-singleton-003",
        dificuldade: Dificuldade.Dificil,
        grupo: "Criacionais",
        nivel: 3,
        padrao: "Singleton",
        conteudoMarkdown: [
            '# Singleton: variações e quando (não) usar 🐝',
            '',
            'O Singleton é, ao mesmo tempo, um dos padrões mais conhecidos e um dos mais criticados do GoF. Vale entender por quê antes de espalhar `getInstance()` pelo projeto inteiro.',
            '',
            '## Por que tanta crítica?',
            '',
            '- **Estado global disfarçado.** Um Singleton é, na prática, uma variável global — qualquer código pode lê-lo e alterá-lo, de qualquer lugar, sem passar por nenhuma interface explícita.',
            '- **Dependências escondidas.** Um método que chama `Config.getInstance()` no meio do corpo não deixa claro, na sua assinatura, que depende de configuração global — dificultando entender o código só de olhar pra fora.',
            '- **Testabilidade ruim.** Como a instância é única e fixa, é difícil substituí-la por um dublê de teste (mock/stub) sem recorrer a truques (reflection, frameworks especiais).',
            '- **Acoplamento entre testes.** Se o Singleton guarda estado mutável, um teste pode "vazar" efeitos colaterais para o próximo teste que rodar depois, quebrando o isolamento que os testes deveriam ter.',
            '',
            '## A alternativa mais comum: Injeção de Dependência',
            '',
            'Em vez de a classe pedir a instância global sozinha (`Config.getInstance()`), ela recebe a dependência de fora, no construtor:',
            '',
            '```java',
            '// Em vez disso:',
            'public class ServicoDeEntrega {',
            '    public void processar() {',
            '        Config config = Config.getInstance();',
            '        // ...',
            '    }',
            '}',
            '',
            '// Prefira isso:',
            'public class ServicoDeEntrega {',
            '    private final Config config;',
            '',
            '    public ServicoDeEntrega(Config config) {',
            '        this.config = config;',
            '    }',
            '}',
            '```',
            '',
            'O framework de injeção de dependência (Spring, por exemplo) ainda pode garantir que só existe **uma** instância de `Config` circulando pela aplicação — só que agora essa garantia é uma escolha de configuração externa, não uma regra hard-coded dentro da própria classe. Isso resolve boa parte das críticas: os testes podem injetar um `Config` de mentira, e a dependência fica visível na assinatura do construtor.',
            '',
            '## Quando o Singleton ainda faz sentido',
            '',
            '- **Loggers.** Não faz sentido ter várias instâncias competindo pelo mesmo arquivo de log.',
            '- **Pools de conexão.** Gerenciar um conjunto compartilhado de conexões de banco de dados por um único ponto evita esgotar recursos.',
            '- **Caches em memória compartilhados** dentro de um único processo.',
            '',
            '## Quando evitar',
            '',
            '- Em **regras de negócio** — qualquer coisa que possa precisar de mais de uma configuração ao mesmo tempo (ex.: multi-tenant, testes paralelos) não deveria ser um Singleton clássico.',
            '- Quando **testabilidade** importa mais do que a conveniência de não passar a dependência explicitamente.',
            '',
            '## Variações',
            '',
            '- **Multiton**: como o Singleton, mas mantém um `Map<Chave, Instancia>` em vez de uma única instância — garante uma instância por chave (ex.: uma conexão por banco de dados diferente).',
            '- **Thread-local Singleton**: uma instância por thread, útil quando o estado não pode ser compartilhado entre threads mas ainda faz sentido ser único *dentro* de cada uma.',
        ].join('\n')
    }),

    new Quiz({
        id: "quiz-singleton-002",
        dificuldade: Dificuldade.Dificil,
        padrao: "Singleton",
        grupo: "Criacionais",
        nivel: 3,
        tipo: TipoDesafio.PerguntasRespostas,
        perguntas: [
            new Pergunta({
                id: "p1",
                texto: "Por que o campo da instância precisa ser \"volatile\" numa implementação com double-checked locking?",
                repostas: [
                    new Resposta({ id: "p1r1", texto: "Para o Java aceitar o modificador \"static\" no mesmo campo." }),
                    new Resposta({ id: "p1r2", texto: "Para impedir que instruções sejam reordenadas, evitando que outra thread veja um objeto parcialmente construído.", correta: true }),
                    new Resposta({ id: "p1r3", texto: "Para tornar o campo acessível fora da classe." }),
                    new Resposta({ id: "p1r4", texto: "\"volatile\" só afeta desempenho, não corretude." }),
                ]
            }),
            new Pergunta({
                id: "p2",
                texto: "Por que a abordagem de Enum Singleton é considerada a mais segura em Java?",
                repostas: [
                    new Resposta({ id: "p2r1", texto: "Porque enums são compilados em bytecode mais rápido que classes comuns." }),
                    new Resposta({ id: "p2r2", texto: "Porque a própria linguagem garante instância única e resistência a ataques por reflection e serialização.", correta: true }),
                    new Resposta({ id: "p2r3", texto: "Porque enums não podem ter métodos, então não há como quebrar o encapsulamento." }),
                    new Resposta({ id: "p2r4", texto: "Porque enums são sempre carregados de forma lazy (preguiçosa)." }),
                ]
            }),
            new Pergunta({
                id: "p3",
                texto: "Qual é o principal argumento a favor de substituir um Singleton por Injeção de Dependência?",
                repostas: [
                    new Resposta({ id: "p3r1", texto: "Injeção de Dependência é sempre mais rápida em tempo de execução." }),
                    new Resposta({ id: "p3r2", texto: "Torna a dependência explícita na assinatura e facilita substituí-la por um mock nos testes.", correta: true }),
                    new Resposta({ id: "p3r3", texto: "Elimina completamente a necessidade de qualquer configuração compartilhada." }),
                    new Resposta({ id: "p3r4", texto: "Impede que a classe tenha qualquer tipo de estado." }),
                ]
            }),
            new Pergunta({
                id: "p4",
                texto: "Um Singleton comum (não-enum), com construtor privado, ainda pode ter sua garantia de instância única quebrada por qual mecanismo?",
                repostas: [
                    new Resposta({ id: "p4r1", texto: "Reflection, tornando o construtor privado acessível, ou clone()/serialização mal implementados.", correta: true }),
                    new Resposta({ id: "p4r2", texto: "Não existe forma de quebrar um Singleton com construtor privado." }),
                    new Resposta({ id: "p4r3", texto: "Só reiniciando a aplicação inteira." }),
                    new Resposta({ id: "p4r4", texto: "Alterando o valor de retorno de getInstance() diretamente pelo código cliente." }),
                ]
            }),
        ]
    }),

    // ═══════════════════════════════════════════════════════════════════════════════════════
    // Observer — arco completo de 10 fases (nenhuma existia antes).
    // ═══════════════════════════════════════════════════════════════════════════════════════

    new Licao({
        id: "licao-observer-001",
        dificuldade: Dificuldade.Facil,
        grupo: "Comportamentais",
        nivel: 1,
        padrao: "Observer",
        conteudoMarkdown: [
            '# O padrão Observer 🐝',
            '',
            'Imagina o painel de controle do apiário: toda vez que o **estoque de mel** muda, várias telas diferentes precisam saber — o painel do apicultor, o alarme de estoque baixo, o app no celular. Se o código que atualiza o estoque tiver que chamar cada uma dessas telas manualmente, toda vez que surgir uma tela nova, alguém vai precisar lembrar de ir lá e adicionar mais uma chamada.',
            '',
            'O padrão **Observer** resolve isso definindo uma relação **um-para-muitos**: quando um objeto (o *Subject*, ou "sujeito") muda de estado, todos os objetos inscritos nele (os *Observers*) são notificados automaticamente — sem que o Subject precise saber quem são eles em detalhe, só que implementam uma interface em comum.',
            '',
            '## Por que isso importa?',
            '',
            'Sem o padrão, o código de quem gerencia o estoque ficaria assim:',
            '',
            '```java',
            'void atualizarEstoque(int novaQuantidade) {',
            '    quantidade = novaQuantidade;',
            '    painelApicultor.atualizar(quantidade);',
            '    alarmeEstoqueBaixo.atualizar(quantidade);',
            '    appMobileApicultor.atualizar(quantidade);',
            '    // toda tela nova = mais uma linha aqui, e alguém tem que lembrar de adicionar',
            '}',
            '```',
            '',
            '## Como funciona, passo a passo',
            '',
            '1. Define-se uma interface **Observador** com um método, ex.: `atualizar(int quantidade)`.',
            '2. O **Subject** (`EstoqueDeMel`) guarda uma lista de observadores inscritos.',
            '3. Métodos `inscrever(observador)` e `desinscrever(observador)` adicionam/removem da lista.',
            '4. Quando o estado do Subject muda, ele chama `notificarTodos()`, que percorre a lista chamando `atualizar()` em cada observador.',
            '5. Cada **Observador concreto** decide o que fazer com a notificação — o Subject não sabe nem se importa.',
            '',
            '## O fluxo, de um jeito simples',
            '',
            '```mermaid',
            'flowchart LR',
            '    A[EstoqueDeMel muda de quantidade] --> B[notificarTodos]',
            '    B --> C[PainelApicultor.atualizar]',
            '    B --> D[AlarmeEstoqueBaixo.atualizar]',
            '    B --> E[AppMobileApicultor.atualizar]',
            '```',
            '',
            '## Um exemplo mínimo',
            '',
            '```java',
            'public interface Observador {',
            '    void atualizar(int quantidade);',
            '}',
            '',
            'public class EstoqueDeMel {',
            '    private final List<Observador> observadores = new ArrayList<>();',
            '    private int quantidade;',
            '',
            '    public void inscrever(Observador observador) {',
            '        observadores.add(observador);',
            '    }',
            '',
            '    public void definirQuantidade(int novaQuantidade) {',
            '        this.quantidade = novaQuantidade;',
            '        notificarTodos();',
            '    }',
            '',
            '    private void notificarTodos() {',
            '        for (Observador o : observadores) {',
            '            o.atualizar(quantidade);',
            '        }',
            '    }',
            '}',
            '```',
            '',
            'Agora, adicionar uma tela nova é só criar uma classe que implementa `Observador` e chamar `inscrever(...)` — o `EstoqueDeMel` não muda nem uma linha.',
        ].join('\n')
    }),

    new Quiz({
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
                    new Resposta({ id: "p1r2", texto: "Define uma dependência um-para-muitos: quando um objeto muda de estado, todos os seus dependentes são notificados automaticamente.", correta: true }),
                    new Resposta({ id: "p1r3", texto: "Separa a construção de um objeto complexo de sua representação." }),
                    new Resposta({ id: "p1r4", texto: "Converte a interface de uma classe em outra interface esperada pelo cliente." }),
                ]
            }),
            new Pergunta({
                id: "p2",
                texto: "No padrão Observer, quem chama o método atualizar() de cada observador?",
                repostas: [
                    new Resposta({ id: "p2r1", texto: "O próprio observador, periodicamente, verificando se algo mudou." }),
                    new Resposta({ id: "p2r2", texto: "O Subject, ao notificar todos os observadores inscritos.", correta: true }),
                    new Resposta({ id: "p2r3", texto: "Uma classe fábrica externa que cria os observadores." }),
                    new Resposta({ id: "p2r4", texto: "O sistema operacional, via interrupção de hardware." }),
                ]
            }),
            new Pergunta({
                id: "p3",
                texto: "Qual é a principal vantagem de usar o Observer em vez de chamar cada dependente manualmente?",
                repostas: [
                    new Resposta({ id: "p3r1", texto: "O código fica mais rápido em tempo de execução." }),
                    new Resposta({ id: "p3r2", texto: "O Subject não precisa conhecer os detalhes de cada observador — só a interface em comum, tornando fácil adicionar novos sem alterar o Subject.", correta: true }),
                    new Resposta({ id: "p3r3", texto: "Elimina a necessidade de qualquer tipo de interface." }),
                    new Resposta({ id: "p3r4", texto: "Garante que os observadores sejam notificados em ordem alfabética." }),
                ]
            }),
            new Pergunta({
                id: "p4",
                texto: "O que um método \"inscrever(observador)\" faz tipicamente num Subject?",
                repostas: [
                    new Resposta({ id: "p4r1", texto: "Remove o observador da lista de notificação." }),
                    new Resposta({ id: "p4r2", texto: "Cria uma nova instância do Subject." }),
                    new Resposta({ id: "p4r3", texto: "Adiciona o observador a uma lista interna, para que passe a receber notificações futuras.", correta: true }),
                    new Resposta({ id: "p4r4", texto: "Executa imediatamente o método atualizar() do observador, uma única vez." }),
                ]
            }),
        ]
    }),

    new CompleteTexto({
        id: "ct-observer-001",
        dificuldade: Dificuldade.Facil,
        grupo: "Comportamentais",
        nivel: 1,
        padrao: "Observer",
        textos: [
            new Texto({
                id: "t1",
                texto: "O padrão {{1}} define uma dependência {{2}}: quando o {{3}} muda de estado, todos os observadores inscritos são notificados.",
                opcoes: ["Observer", "um-para-muitos", "Subject", "Singleton", "um-para-um", "Cliente"],
                respostas: ["Observer", "um-para-muitos", "Subject"]
            }),
            new Texto({
                id: "t2",
                texto: "Cada observador implementa uma {{1}} em comum, geralmente com um método chamado {{2}}, que o Subject chama pra avisar sobre a mudança.",
                opcoes: ["interface", "classe final", "atualizar", "construir", "anotação", "destruir"],
                respostas: ["interface", "atualizar"]
            }),
            new Texto({
                id: "t3",
                texto: "Os métodos {{1}} e {{2}} permitem que um observador entre ou saia da lista de notificação do Subject a qualquer momento.",
                opcoes: ["inscrever", "desinscrever", "notificar", "clonar", "construir", "serializar"],
                respostas: ["inscrever", "desinscrever"]
            }),
        ]
    }),

    new EncontreBug({
        id: "eb-observer-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Comportamentais",
        nivel: 2,
        padrao: "Observer",
        perguntas: [
            new PerguntaBug({
                id: "pb1",
                enunciado: "O painel do apicultor nunca é atualizado quando o estoque muda. Qual é o problema neste código?",
                explicacao: "O método definirQuantidade() atualiza o campo \"quantidade\" mas nunca chama notificarTodos() — os observadores continuam inscritos corretamente, mas simplesmente nunca são avisados da mudança.",
                respostas: [
                    new RespostaBug({ id: "pb1-r1", texto: "O PainelApicultor não implementa a interface Observador corretamente." }),
                    new RespostaBug({ id: "pb1-r2", texto: "definirQuantidade() nunca chama notificarTodos() após alterar o estado.", correta: true }),
                    new RespostaBug({ id: "pb1-r3", texto: "A lista de observadores foi declarada como Set em vez de List." }),
                    new RespostaBug({ id: "pb1-r4", texto: "O método inscrever() está sendo chamado antes de instanciar o EstoqueDeMel." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb1-a1",
                        nome: "EstoqueDeMel.java",
                        linguagem: "java",
                        codigo:
`public class EstoqueDeMel {
    private final List<Observador> observadores = new ArrayList<>();
    private int quantidade;

    public void inscrever(Observador observador) {
        observadores.add(observador);
    }

    public void definirQuantidade(int novaQuantidade) {
        this.quantidade = novaQuantidade;
    }

    private void notificarTodos() {
        for (Observador o : observadores) {
            o.atualizar(quantidade);
        }
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a2",
                        nome: "PainelApicultor.java",
                        linguagem: "java",
                        codigo:
`public class PainelApicultor implements Observador {
    @Override
    public void atualizar(int quantidade) {
        System.out.println("Painel: estoque agora é " + quantidade);
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
        EstoqueDeMel estoque = new EstoqueDeMel();
        estoque.inscrever(new PainelApicultor());
        estoque.definirQuantidade(50);
    }
}`
                    }),
                ]
            }),
            new PerguntaBug({
                id: "pb2",
                enunciado: "Esse loop de busca lançou ArrayIndexOutOfBoundsException. Qual é o erro?",
                explicacao: "A condição do laço usa \"<=\" em vez de \"<\", então tenta acessar \"itens[itens.length]\" — um índice que não existe (o último índice válido é \"itens.length - 1\").",
                respostas: [
                    new RespostaBug({ id: "pb2-r1", texto: "A condição do laço deveria usar \"<\" em vez de \"<=\".", correta: true }),
                    new RespostaBug({ id: "pb2-r2", texto: "O array deveria ser inicializado com um elemento a mais." }),
                    new RespostaBug({ id: "pb2-r3", texto: "O índice \"i\" deveria começar em 1, não em 0." }),
                    new RespostaBug({ id: "pb2-r4", texto: "O método deveria usar um ArrayList em vez de um array." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb2-a1",
                        nome: "Busca.java",
                        linguagem: "java",
                        codigo:
`public class Busca {
    public static int somar(int[] itens) {
        int total = 0;
        for (int i = 0; i <= itens.length; i++) {
            total += itens[i];
        }
        return total;
    }
}`
                    }),
                ]
            }),
        ]
    }),

    new EncontrePares({
        id: "ep-observer-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Comportamentais",
        nivel: 2,
        padrao: "Observer",
        rodadas: [
            new Rodada({
                id: "r1",
                pares: [
                    new Par({ id: "r1p1", afirmacao: "Subject (Observable)", correspondencia: "Mantém o estado e a lista de observadores; notifica todos quando o estado muda." }),
                    new Par({ id: "r1p2", afirmacao: "Observer", correspondencia: "Interface comum implementada por quem quer ser notificado das mudanças." }),
                    new Par({ id: "r1p3", afirmacao: "inscrever() / desinscrever()", correspondencia: "Adicionam ou removem um observador da lista de notificação do Subject." }),
                    new Par({ id: "r1p4", afirmacao: "notificarTodos()", correspondencia: "Percorre a lista de observadores chamando o método de atualização de cada um." }),
                ]
            }),
            new Rodada({
                id: "r2",
                pares: [
                    new Par({ id: "r2p1", afirmacao: "Modelo Push", correspondencia: "O Subject envia os dados atualizados diretamente como parâmetro do método de notificação." }),
                    new Par({ id: "r2p2", afirmacao: "Modelo Pull", correspondencia: "O Subject só avisa que algo mudou; o observador busca os dados que precisa de volta no Subject." }),
                    new Par({ id: "r2p3", afirmacao: "Lapsed listener problem", correspondencia: "Observadores que nunca se desinscrevem continuam na memória, causando vazamento de memória." }),
                    new Par({ id: "r2p4", afirmacao: "Event Bus / Pub-Sub", correspondencia: "Uma variação do Observer onde um canal central desacopla totalmente quem publica de quem assina." }),
                ]
            }),
        ]
    }),

    new Licao({
        id: "licao-observer-002",
        dificuldade: Dificuldade.Medio,
        grupo: "Comportamentais",
        nivel: 2,
        padrao: "Observer",
        conteudoMarkdown: [
            '# Observer: a estrutura completa 🐝',
            '',
            'Vamos formalizar as peças do padrão e ver as duas formas mais comuns de passar os dados na notificação.',
            '',
            '## As quatro peças',
            '',
            '| Papel | No nosso exemplo | O que faz |',
            '|---|---|---|',
            '| **Subject** | `EstoqueDeMel` | Guarda o estado e a lista de observadores; dispara as notificações. |',
            '| **Observer** | `Observador` (interface) | Declara o método de atualização que todo observador precisa implementar. |',
            '| **ConcreteSubject** | `EstoqueDeMel` (mesmo, quando não há interface separada) | Implementação concreta do estado observado. |',
            '| **ConcreteObserver** | `PainelApicultor`, `AlarmeEstoqueBaixo` | Reage à notificação do jeito que faz sentido para aquela tela/funcionalidade. |',
            '',
            '## O diagrama de classes',
            '',
            '```mermaid',
            'classDiagram',
            '    class Subject {',
            '        -List~Observador~ observadores',
            '        +inscrever(Observador)',
            '        +desinscrever(Observador)',
            '        -notificarTodos()',
            '    }',
            '    class Observador {',
            '        <<interface>>',
            '        +atualizar(int)',
            '    }',
            '    class EstoqueDeMel {',
            '        -int quantidade',
            '        +definirQuantidade(int)',
            '    }',
            '    class PainelApicultor {',
            '        +atualizar(int)',
            '    }',
            '    class AlarmeEstoqueBaixo {',
            '        +atualizar(int)',
            '    }',
            '    Subject <|-- EstoqueDeMel',
            '    Observador <|.. PainelApicultor',
            '    Observador <|.. AlarmeEstoqueBaixo',
            '    Subject o-- Observador',
            '```',
            '',
            '## Modelo Push vs. Modelo Pull',
            '',
            'Existem duas formas de o Subject entregar informação na notificação:',
            '',
            '**Push** — o Subject já manda os dados relevantes como parâmetro do próprio método de atualização (foi o que fizemos até agora, com `atualizar(int quantidade)`). É simples, mas acopla a assinatura do método aos dados exatos que o Subject decidiu enviar.',
            '',
            '```java',
            'void atualizar(int quantidade) {',
            '    // já recebeu o dado pronto',
            '}',
            '```',
            '',
            '**Pull** — o Subject só avisa "algo mudou", e o próprio observador consulta o Subject de volta pra buscar exatamente o que precisa:',
            '',
            '```java',
            'void atualizar(EstoqueDeMel subject) {',
            '    int quantidade = subject.getQuantidade();',
            '    // busca só o que interessa, quando precisar',
            '}',
            '```',
            '',
            'O modelo Pull é mais flexível quando o Subject tem muitos campos e observadores diferentes só precisam de partes específicas do estado — evita passar um parâmetro gigante "com tudo" pra todo mundo.',
            '',
            '## Múltiplos tipos de evento',
            '',
            'Em sistemas reais, é comum um Subject emitir *tipos* diferentes de evento (ex.: "estoque baixo" vs "estoque reabastecido"). Uma forma comum de organizar isso é passar um objeto de evento em vez de um valor solto:',
            '',
            '```java',
            'public class EventoEstoque {',
            '    public final int quantidadeAtual;',
            '    public final boolean estoqueBaixo;',
            '',
            '    public EventoEstoque(int quantidadeAtual, boolean estoqueBaixo) {',
            '        this.quantidadeAtual = quantidadeAtual;',
            '        this.estoqueBaixo = estoqueBaixo;',
            '    }',
            '}',
            '```',
        ].join('\n')
    }),

    new CompleteCodigo({
        id: "cc-observer-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Comportamentais",
        nivel: 2,
        padrao: "Observer",
        codigos: [
            new CodigoIncompleto({
                id: "cc1",
                arquivo: "EstoqueDeMel.java",
                linguagem: "java",
                respostaCorretaId: "cc1-t1",
                explicacao: "definirQuantidade() precisa chamar notificarTodos() depois de atualizar o campo \"quantidade\" — senão os observadores inscritos nunca ficam sabendo que o estado mudou.",
                template:
`public class EstoqueDeMel {
    private final List<Observador> observadores = new ArrayList<>();
    private int quantidade;

    public void inscrever(Observador observador) {
        observadores.add(observador);
    }

    public void definirQuantidade(int novaQuantidade) {
        this.quantidade = novaQuantidade;
{{1}}
    }

    private void notificarTodos() {
        for (Observador o : observadores) {
            o.atualizar(quantidade);
        }
    }
}`,
                opcoes: [
                    new Trecho({ id: "cc1-t1", codigo: `        notificarTodos();` }),
                    new Trecho({ id: "cc1-t2", codigo: `        // nada a fazer` }),
                    new Trecho({ id: "cc1-t3", codigo: `        observadores.clear();` }),
                    new Trecho({ id: "cc1-t4", codigo: `        return;` }),
                ]
            }),
            new CodigoIncompleto({
                id: "cc2",
                arquivo: "AlarmeEstoqueBaixo.java",
                linguagem: "java",
                respostaCorretaId: "cc2-t1",
                explicacao: "Pra implementar a interface Observador, a classe precisa declarar o método atualizar(int) com a mesma assinatura — é isso que permite que o EstoqueDeMel chame esse método de forma polimórfica, sem saber o tipo concreto de cada observador.",
                template:
`public class AlarmeEstoqueBaixo implements Observador {
    private static final int LIMITE = 10;

{{1}}
        if (quantidade < LIMITE) {
            System.out.println("Alerta: estoque baixo!");
        }
    }
}`,
                opcoes: [
                    new Trecho({ id: "cc2-t1", codigo: `    @Override\n    public void atualizar(int quantidade) {` }),
                    new Trecho({ id: "cc2-t2", codigo: `    public void notificar(int quantidade) {` }),
                    new Trecho({ id: "cc2-t3", codigo: `    private void atualizar(int quantidade) {` }),
                    new Trecho({ id: "cc2-t4", codigo: `    @Override\n    public int atualizar() {` }),
                ]
            }),
        ]
    }),

    new EncontreBug({
        id: "eb-observer-002",
        dificuldade: Dificuldade.Dificil,
        grupo: "Comportamentais",
        nivel: 3,
        padrao: "Observer",
        perguntas: [
            new PerguntaBug({
                id: "pb1",
                enunciado: "Esse código lança ConcurrentModificationException quando um observador se desinscreve durante a notificação. Qual é o problema?",
                explicacao: "desinscrever() remove um item da mesma lista \"observadores\" que notificarTodos() está percorrendo com um for-each — modificar uma lista enquanto ela é iterada lança ConcurrentModificationException. A correção comum é iterar sobre uma cópia da lista (ex.: \"new ArrayList<>(observadores)\") ou usar um iterator explícito com remove().",
                respostas: [
                    new RespostaBug({ id: "pb1-r1", texto: "A interface Observador está mal definida." }),
                    new RespostaBug({ id: "pb1-r2", texto: "notificarTodos() está percorrendo a mesma lista que um observador pode modificar (via desinscrever) durante a própria notificação.", correta: true }),
                    new RespostaBug({ id: "pb1-r3", texto: "O método atualizar() deveria ser \"static\"." }),
                    new RespostaBug({ id: "pb1-r4", texto: "A lista de observadores deveria ser um array de tamanho fixo." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb1-a1",
                        nome: "EstoqueDeMel.java",
                        linguagem: "java",
                        codigo:
`public class EstoqueDeMel {
    private final List<Observador> observadores = new ArrayList<>();
    private int quantidade;

    public void inscrever(Observador observador) {
        observadores.add(observador);
    }

    public void desinscrever(Observador observador) {
        observadores.remove(observador);
    }

    public void definirQuantidade(int novaQuantidade) {
        this.quantidade = novaQuantidade;
        notificarTodos();
    }

    private void notificarTodos() {
        for (Observador o : observadores) {
            o.atualizar(quantidade);
        }
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a2",
                        nome: "AppMobileApicultor.java",
                        linguagem: "java",
                        codigo:
`public class AppMobileApicultor implements Observador {
    private final EstoqueDeMel estoque;

    public AppMobileApicultor(EstoqueDeMel estoque) {
        this.estoque = estoque;
    }

    @Override
    public void atualizar(int quantidade) {
        if (quantidade == 0) {
            estoque.desinscrever(this);
        }
    }
}`
                    }),
                ]
            }),
            new PerguntaBug({
                id: "pb2",
                enunciado: "Esse validador de senha aceita senhas vazias como válidas. Qual é o erro?",
                explicacao: "A checagem \"senha.length() > 0\" é verdadeira mesmo para uma senha de 1 caractere, e o método retorna \"true\" nesse caso — a verificação deveria exigir um tamanho mínimo maior (ex.: 8), não apenas \"maior que zero\".",
                respostas: [
                    new RespostaBug({ id: "pb2-r1", texto: "A verificação usa \"length() > 0\" em vez de um tamanho mínimo real (ex.: 8 caracteres).", correta: true }),
                    new RespostaBug({ id: "pb2-r2", texto: "O método deveria ser \"static\"." }),
                    new RespostaBug({ id: "pb2-r3", texto: "A senha deveria ser comparada com \"==\" em vez de \".length()\"." }),
                    new RespostaBug({ id: "pb2-r4", texto: "O tipo de retorno deveria ser \"String\", não \"boolean\"." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb2-a1",
                        nome: "ValidadorSenha.java",
                        linguagem: "java",
                        codigo:
`public class ValidadorSenha {
    public static boolean ehValida(String senha) {
        return senha != null && senha.length() > 0;
    }
}`
                    }),
                ]
            }),
        ]
    }),

    new Licao({
        id: "licao-observer-003",
        dificuldade: Dificuldade.Dificil,
        grupo: "Comportamentais",
        nivel: 3,
        padrao: "Observer",
        conteudoMarkdown: [
            '# Observer: variações e quando (não) usar 🐝',
            '',
            'O Observer é um dos padrões mais usados no dia a dia — muitas vezes sem que a gente perceba (event listeners de UI, streams reativos, sistemas de eventos). Mas ele tem pegadinhas conhecidas.',
            '',
            '## O problema do "lapsed listener"',
            '',
            'Se um observador se inscreve e nunca se desinscreve, o Subject continua segurando uma referência pra ele pra sempre — mesmo que ninguém mais use aquele observador em nenhum outro lugar do código. Isso é um vazamento de memória clássico, especialmente comum em interfaces gráficas: uma tela é fechada, mas continua "viva" na memória porque ainda está inscrita em algum Subject de longa duração.',
            '',
            '**Mitigações comuns:**',
            '- Sempre desinscrever explicitamente quando o observador não for mais necessário (ex.: ao fechar uma tela).',
            '- Usar referências fracas (`WeakReference`) na lista de observadores, permitindo que o coletor de lixo remova observadores que não têm mais nenhuma outra referência viva.',
            '',
            '## Ordem de notificação não é garantida',
            '',
            'A maioria das implementações de Observer notifica na ordem em que os observadores foram inscritos — mas isso não deveria ser uma regra que o seu código depende. Se a ordem importa (ex.: "o alarme precisa disparar antes do log"), isso deveria ser modelado explicitamente, não deduzido pela ordem de `inscrever()`.',
            '',
            '## Notificações em cascata',
            '',
            'Cuidado com um observador que, ao ser notificado, altera o próprio Subject de novo — isso pode gerar uma cadeia de notificações recursivas difícil de rastrear (A notifica B, B muda o estado de A, A notifica de novo, ...). Prefira que o observador reaja *fora* do fluxo de notificação (ex.: enfileirando uma ação) quando precisar alterar o Subject observado.',
            '',
            '## Variações',
            '',
            '- **Event Bus / Pub-Sub**: em vez de o observador se inscrever diretamente no Subject, ele se inscreve num canal central (o "bus"). Quem publica um evento não precisa conhecer os assinantes, e quem assina não precisa conhecer quem publica — desacoplamento total entre as duas pontas.',
            '- **Streams reativos** (RxJava, Observables do Angular): generalizam o Observer para permitir compor, filtrar e transformar sequências de eventos ao longo do tempo, em vez de só notificar "algo mudou".',
            '',
            '## Quando o Observer faz sentido',
            '',
            '- Múltiplas partes do sistema precisam **reagir** à mesma mudança de estado, sem ficar checando (polling) o tempo todo.',
            '- Você quer desacoplar quem gera um evento de quem reage a ele.',
            '',
            '## Quando evitar',
            '',
            '- Quando há **poucos** dependentes e a relação é sempre a mesma — nesse caso, uma chamada direta de método é mais simples de seguir do que uma cadeia de notificações.',
            '- Quando a **ordem** de execução entre os reatores é crítica e precisa ser garantida — o Observer não foi desenhado pra isso.',
        ].join('\n')
    }),

    new Quiz({
        id: "quiz-observer-002",
        dificuldade: Dificuldade.Dificil,
        padrao: "Observer",
        grupo: "Comportamentais",
        nivel: 3,
        tipo: TipoDesafio.PerguntasRespostas,
        perguntas: [
            new Pergunta({
                id: "p1",
                texto: "O que é o \"lapsed listener problem\"?",
                repostas: [
                    new Resposta({ id: "p1r1", texto: "Um observador que nunca implementou a interface corretamente." }),
                    new Resposta({ id: "p1r2", texto: "Observadores que nunca se desinscrevem e continuam referenciados pelo Subject, causando vazamento de memória.", correta: true }),
                    new Resposta({ id: "p1r3", texto: "Um Subject que notifica os observadores fora de ordem." }),
                    new Resposta({ id: "p1r4", texto: "Uma falha de compilação ao declarar múltiplos observadores." }),
                ]
            }),
            new Pergunta({
                id: "p2",
                texto: "Qual a diferença entre o modelo Push e o modelo Pull na notificação do Observer?",
                repostas: [
                    new Resposta({ id: "p2r1", texto: "Push é mais lento; Pull é sempre mais rápido." }),
                    new Resposta({ id: "p2r2", texto: "No Push o Subject envia os dados prontos na notificação; no Pull o observador busca de volta só o que precisa.", correta: true }),
                    new Resposta({ id: "p2r3", texto: "Push só funciona com um observador por vez; Pull permite vários." }),
                    new Resposta({ id: "p2r4", texto: "Não há diferença prática entre os dois modelos." }),
                ]
            }),
            new Pergunta({
                id: "p3",
                texto: "Por que modificar a lista de observadores durante a própria notificação (ex.: desinscrever dentro de atualizar()) é arriscado?",
                repostas: [
                    new Resposta({ id: "p3r1", texto: "Não é arriscado, é a forma recomendada de desinscrever." }),
                    new Resposta({ id: "p3r2", texto: "Pode lançar ConcurrentModificationException ao iterar e modificar a mesma lista simultaneamente.", correta: true }),
                    new Resposta({ id: "p3r3", texto: "Só é arriscado em linguagens sem coletor de lixo." }),
                    new Resposta({ id: "p3r4", texto: "Isso trava a thread principal indefinidamente." }),
                ]
            }),
            new Pergunta({
                id: "p4",
                texto: "O que um Event Bus / Pub-Sub adiciona em relação ao Observer clássico?",
                repostas: [
                    new Resposta({ id: "p4r1", texto: "Um canal central que desacopla totalmente quem publica de quem assina, sem inscrição direta no Subject.", correta: true }),
                    new Resposta({ id: "p4r2", texto: "Elimina a necessidade de qualquer interface em comum." }),
                    new Resposta({ id: "p4r3", texto: "Garante que só existe um único assinante por evento." }),
                    new Resposta({ id: "p4r4", texto: "Torna as notificações síncronas obrigatoriamente." }),
                ]
            }),
        ]
    }),

    // ═══════════════════════════════════════════════════════════════════════════════════════
    // Bridge — arco completo de 10 fases (nenhuma existia antes).
    // ═══════════════════════════════════════════════════════════════════════════════════════

    new Licao({
        id: "licao-bridge-001",
        dificuldade: Dificuldade.Facil,
        grupo: "Estruturais",
        nivel: 1,
        padrao: "Bridge",
        conteudoMarkdown: [
            '# O padrão Bridge 🐝',
            '',
            'O apiário tem vários **dispositivos** (luz, ventilador) e vários tipos de **controle remoto** (básico, avançado). Se você criar uma classe para cada combinação — `ControleBasicoLuz`, `ControleAvancadoLuz`, `ControleBasicoVentilador`, `ControleAvancadoVentilador`... — toda vez que surgir um dispositivo novo ou um controle novo, o número de classes **multiplica**, não soma.',
            '',
            '```mermaid',
            'flowchart TB',
            '    subgraph "Sem Bridge: explosão de classes"',
            '    A1[ControleBasicoLuz]',
            '    A2[ControleAvancadoLuz]',
            '    A3[ControleBasicoVentilador]',
            '    A4[ControleAvancadoVentilador]',
            '    end',
            '```',
            '',
            'O padrão **Bridge** resolve isso separando duas hierarquias que estavam misturadas em uma só:',
            '',
            '- A hierarquia de **Abstração** (os tipos de controle: básico, avançado).',
            '- A hierarquia de **Implementação** (os tipos de dispositivo: luz, ventilador).',
            '',
            'Em vez de o controle *herdar* de uma combinação fixa, ele **guarda uma referência** para um dispositivo e delega as chamadas pra ele. Isso é a "ponte" (bridge) entre as duas hierarquias — e ela é feita por **composição**, não herança.',
            '',
            '## Como funciona, passo a passo',
            '',
            '1. Define-se uma interface **Implementor** (`Dispositivo`) com as operações básicas: `ligar()`, `desligar()`.',
            '2. Cada dispositivo concreto (`LuzApiario`, `VentiladorApiario`) implementa essa interface do seu próprio jeito.',
            '3. Define-se uma classe **Abstraction** (`ControleRemoto`) que guarda uma referência a um `Dispositivo` e delega as chamadas pra ele.',
            '4. Subclasses da Abstraction (`ControleRemotoAvancado`) podem adicionar funcionalidades extras, sem precisar saber qual dispositivo concreto está por trás.',
            '',
            '```java',
            'public interface Dispositivo {',
            '    void ligar();',
            '    void desligar();',
            '}',
            '',
            'public class LuzApiario implements Dispositivo {',
            '    public void ligar() { System.out.println("Luz acesa"); }',
            '    public void desligar() { System.out.println("Luz apagada"); }',
            '}',
            '',
            'public class ControleRemoto {',
            '    protected final Dispositivo dispositivo;',
            '',
            '    public ControleRemoto(Dispositivo dispositivo) {',
            '        this.dispositivo = dispositivo;',
            '    }',
            '',
            '    public void alternar(boolean ligado) {',
            '        if (ligado) dispositivo.ligar(); else dispositivo.desligar();',
            '    }',
            '}',
            '```',
            '',
            'Agora, `ControleRemoto` funciona com **qualquer** `Dispositivo` — luz, ventilador, ou um dispositivo novo que ainda nem existe — sem precisar de uma classe nova pra cada combinação.',
        ].join('\n')
    }),

    new Quiz({
        id: "quiz-bridge-001",
        dificuldade: Dificuldade.Facil,
        padrao: "Bridge",
        grupo: "Estruturais",
        nivel: 1,
        tipo: TipoDesafio.PerguntasRespostas,
        perguntas: [
            new Pergunta({
                id: "p1",
                texto: "Qual das afirmações abaixo descreve melhor o padrão Bridge?",
                repostas: [
                    new Resposta({ id: "p1r1", texto: "Converte a interface de uma classe existente na interface esperada pelo cliente." }),
                    new Resposta({ id: "p1r2", texto: "Separa uma abstração da sua implementação, para que as duas possam variar de forma independente.", correta: true }),
                    new Resposta({ id: "p1r3", texto: "Garante que uma classe tenha apenas uma instância." }),
                    new Resposta({ id: "p1r4", texto: "Define uma sequência de passos para construir um objeto complexo." }),
                ]
            }),
            new Pergunta({
                id: "p2",
                texto: "Qual problema o Bridge evita ao separar as duas hierarquias?",
                repostas: [
                    new Resposta({ id: "p2r1", texto: "A explosão combinatória de classes (uma classe para cada combinação de abstração × implementação).", correta: true }),
                    new Resposta({ id: "p2r2", texto: "A necessidade de usar interfaces em qualquer parte do código." }),
                    new Resposta({ id: "p2r3", texto: "O uso de herança em qualquer situação." }),
                    new Resposta({ id: "p2r4", texto: "A necessidade de testar o código." }),
                ]
            }),
            new Pergunta({
                id: "p3",
                texto: "Como a Abstraction se conecta ao Implementor no padrão Bridge?",
                repostas: [
                    new Resposta({ id: "p3r1", texto: "Por herança múltipla das duas classes." }),
                    new Resposta({ id: "p3r2", texto: "Por composição: a Abstraction guarda uma referência ao Implementor e delega chamadas para ele.", correta: true }),
                    new Resposta({ id: "p3r3", texto: "Por meio de um método estático compartilhado." }),
                    new Resposta({ id: "p3r4", texto: "Elas não se conectam — são totalmente independentes." }),
                ]
            }),
            new Pergunta({
                id: "p4",
                texto: "No exemplo do controle remoto e dos dispositivos do apiário, o que representa o \"Implementor\"?",
                repostas: [
                    new Resposta({ id: "p4r1", texto: "A interface Dispositivo e suas implementações concretas (LuzApiario, VentiladorApiario).", correta: true }),
                    new Resposta({ id: "p4r2", texto: "A classe ControleRemoto." }),
                    new Resposta({ id: "p4r3", texto: "O método main() da aplicação." }),
                    new Resposta({ id: "p4r4", texto: "A classe ControleRemotoAvancado." }),
                ]
            }),
        ]
    }),

    new CompleteTexto({
        id: "ct-bridge-001",
        dificuldade: Dificuldade.Facil,
        grupo: "Estruturais",
        nivel: 1,
        padrao: "Bridge",
        textos: [
            new Texto({
                id: "t1",
                texto: "O padrão {{1}} separa uma {{2}} da sua {{3}}, permitindo que as duas variem de forma independente.",
                opcoes: ["Bridge", "abstração", "implementação", "Adapter", "instância", "interface gráfica"],
                respostas: ["Bridge", "abstração", "implementação"]
            }),
            new Texto({
                id: "t2",
                texto: "Em vez de usar {{1}}, a Abstraction se conecta ao Implementor por {{2}}, guardando uma referência e delegando chamadas.",
                opcoes: ["herança", "composição", "reflection", "clonagem", "polimorfismo estático", "serialização"],
                respostas: ["herança", "composição"]
            }),
            new Texto({
                id: "t3",
                texto: "Sem o Bridge, criar uma classe para cada combinação de abstração e implementação causa uma {{1}} de {{2}}.",
                opcoes: ["explosão combinatória", "classes", "redução", "métodos", "simplificação", "instâncias"],
                respostas: ["explosão combinatória", "classes"]
            }),
        ]
    }),

    new EncontreBug({
        id: "eb-bridge-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Estruturais",
        nivel: 2,
        padrao: "Bridge",
        perguntas: [
            new PerguntaBug({
                id: "pb1",
                enunciado: "O ControleRemotoAvancado nunca liga o ventilador de verdade, mesmo chamando alternar(true). Qual é o problema?",
                explicacao: "modoEconomico() cria um NOVO objeto Dispositivo (\"new VentiladorApiario()\") em vez de usar o \"dispositivo\" já recebido no construtor — então quando alternar() é chamado depois, ele delega para o dispositivo original (que nunca teve modoEconomico aplicado), não para essa instância nova e descartada.",
                respostas: [
                    new RespostaBug({ id: "pb1-r1", texto: "A interface Dispositivo está incompleta." }),
                    new RespostaBug({ id: "pb1-r2", texto: "modoEconomico() cria uma nova instância de Dispositivo em vez de usar a referência já guardada em \"dispositivo\".", correta: true }),
                    new RespostaBug({ id: "pb1-r3", texto: "ControleRemotoAvancado deveria implementar Dispositivo diretamente." }),
                    new RespostaBug({ id: "pb1-r4", texto: "O construtor de ControleRemoto está com visibilidade errada." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb1-a1",
                        nome: "ControleRemoto.java",
                        linguagem: "java",
                        codigo:
`public class ControleRemoto {
    protected final Dispositivo dispositivo;

    public ControleRemoto(Dispositivo dispositivo) {
        this.dispositivo = dispositivo;
    }

    public void alternar(boolean ligado) {
        if (ligado) dispositivo.ligar(); else dispositivo.desligar();
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a2",
                        nome: "ControleRemotoAvancado.java",
                        linguagem: "java",
                        codigo:
`public class ControleRemotoAvancado extends ControleRemoto {
    public ControleRemotoAvancado(Dispositivo dispositivo) {
        super(dispositivo);
    }

    public void modoEconomico() {
        Dispositivo economico = new VentiladorApiario();
        economico.ligar();
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
        ControleRemotoAvancado controle = new ControleRemotoAvancado(new VentiladorApiario());
        controle.modoEconomico();
        controle.alternar(true);
    }
}`
                    }),
                ]
            }),
            new PerguntaBug({
                id: "pb2",
                enunciado: "Essa conversão de temperatura retorna sempre 32, não importa o valor de entrada. Qual é o erro?",
                explicacao: "A fórmula está com a ordem das operações errada: deveria ser \"(celsius * 9 / 5) + 32\". Como está escrito, \"9 / 5\" já é calculado à parte igual a 32 só quando celsius é 0 por conta da precedência, mas o erro real aqui é que \"celsius\" nunca entra na conta por causa dos parênteses colocados no lugar errado.",
                respostas: [
                    new RespostaBug({ id: "pb2-r1", texto: "A fórmula está com os parênteses no lugar errado, fazendo \"celsius\" não entrar de fato no cálculo.", correta: true }),
                    new RespostaBug({ id: "pb2-r2", texto: "O tipo do parâmetro deveria ser \"double\" em vez de \"int\"." }),
                    new RespostaBug({ id: "pb2-r3", texto: "Falta multiplicar o resultado final por 100." }),
                    new RespostaBug({ id: "pb2-r4", texto: "O método deveria ser \"static\"." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb2-a1",
                        nome: "Temperatura.java",
                        linguagem: "java",
                        codigo:
`public class Temperatura {
    public static int celsiusParaFahrenheit(int celsius) {
        return celsius * (9 / 5 + 32);
    }
}`
                    }),
                ]
            }),
        ]
    }),

    new EncontrePares({
        id: "ep-bridge-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Estruturais",
        nivel: 2,
        padrao: "Bridge",
        rodadas: [
            new Rodada({
                id: "r1",
                pares: [
                    new Par({ id: "r1p1", afirmacao: "Abstraction", correspondencia: "Guarda uma referência ao Implementor e define a interface de alto nível usada pelo cliente." }),
                    new Par({ id: "r1p2", afirmacao: "Implementor", correspondencia: "Interface que declara as operações básicas, implementadas de formas diferentes por cada dispositivo concreto." }),
                    new Par({ id: "r1p3", afirmacao: "RefinedAbstraction", correspondencia: "Subclasse da Abstraction que adiciona funcionalidades extras, sem conhecer o dispositivo concreto por trás." }),
                    new Par({ id: "r1p4", afirmacao: "ConcreteImplementor", correspondencia: "Implementação concreta do Implementor — ex.: LuzApiario, VentiladorApiario." }),
                ]
            }),
            new Rodada({
                id: "r2",
                pares: [
                    new Par({ id: "r2p1", afirmacao: "Bridge", correspondencia: "Planejado desde o início para permitir que duas hierarquias variem juntas, mas de forma independente." }),
                    new Par({ id: "r2p2", afirmacao: "Adapter", correspondencia: "Aplicado depois, para tornar compatível uma interface já existente que não foi feita para se encaixar." }),
                    new Par({ id: "r2p3", afirmacao: "Explosão combinatória de classes", correspondencia: "O problema que o Bridge evita ao não criar uma subclasse para cada combinação possível." }),
                    new Par({ id: "r2p4", afirmacao: "Composição sobre herança", correspondencia: "Princípio de design que o Bridge aplica ao conectar as duas hierarquias por referência, não por extends." }),
                ]
            }),
        ]
    }),

    new Licao({
        id: "licao-bridge-002",
        dificuldade: Dificuldade.Medio,
        grupo: "Estruturais",
        nivel: 2,
        padrao: "Bridge",
        conteudoMarkdown: [
            '# Bridge: a estrutura completa 🐝',
            '',
            '## As quatro peças',
            '',
            '| Papel | No nosso exemplo | O que faz |',
            '|---|---|---|',
            '| **Abstraction** | `ControleRemoto` | Guarda a referência ao Implementor e expõe a interface de alto nível usada pelo cliente. |',
            '| **RefinedAbstraction** | `ControleRemotoAvancado` | Estende a Abstraction com funcionalidades extras, sem saber qual dispositivo concreto está por trás. |',
            '| **Implementor** | `Dispositivo` (interface) | Declara as operações básicas que toda implementação concreta precisa oferecer. |',
            '| **ConcreteImplementor** | `LuzApiario`, `VentiladorApiario` | Implementações concretas e independentes entre si do Implementor. |',
            '',
            '## O diagrama de classes',
            '',
            '```mermaid',
            'classDiagram',
            '    class ControleRemoto {',
            '        #Dispositivo dispositivo',
            '        +alternar(boolean)',
            '    }',
            '    class ControleRemotoAvancado {',
            '        +modoEconomico()',
            '    }',
            '    class Dispositivo {',
            '        <<interface>>',
            '        +ligar()',
            '        +desligar()',
            '    }',
            '    class LuzApiario {',
            '        +ligar()',
            '        +desligar()',
            '    }',
            '    class VentiladorApiario {',
            '        +ligar()',
            '        +desligar()',
            '    }',
            '    ControleRemoto <|-- ControleRemotoAvancado',
            '    ControleRemoto o-- Dispositivo',
            '    Dispositivo <|.. LuzApiario',
            '    Dispositivo <|.. VentiladorApiario',
            '```',
            '',
            'Repare que existem **duas hierarquias de herança separadas** (`ControleRemoto`→`ControleRemotoAvancado` e `Dispositivo`→`LuzApiario`/`VentiladorApiario`), ligadas por uma única seta de **composição** (`o--`) entre elas. É essa composição que é a "ponte": qualquer subclasse de `ControleRemoto` funciona com qualquer implementação de `Dispositivo`, em qualquer combinação, sem precisar de uma classe pra cada par.',
            '',
            '## Sem Bridge vs. com Bridge',
            '',
            '```java',
            '// Sem Bridge: cada combinação é uma classe.',
            'class ControleBasicoLuz { }',
            'class ControleAvancadoLuz { }',
            'class ControleBasicoVentilador { }',
            'class ControleAvancadoVentilador { }',
            '// 2 controles × 2 dispositivos = 4 classes. Um 3º dispositivo = 6 classes.',
            '',
            '// Com Bridge: as hierarquias são independentes.',
            'class ControleRemoto { protected Dispositivo dispositivo; }',
            'class ControleRemotoAvancado extends ControleRemoto { }',
            'interface Dispositivo { }',
            'class LuzApiario implements Dispositivo { }',
            'class VentiladorApiario implements Dispositivo { }',
            '// 2 controles + 2 dispositivos = 4 classes. Um 3º dispositivo = 5 classes, não 6.',
            '```',
            '',
            'Quanto mais variações em cada lado, maior a economia: com *m* abstrações e *n* implementações, sem Bridge você precisaria de até *m × n* classes; com Bridge, precisa de apenas *m + n*.',
        ].join('\n')
    }),

    new CompleteCodigo({
        id: "cc-bridge-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Estruturais",
        nivel: 2,
        padrao: "Bridge",
        codigos: [
            new CodigoIncompleto({
                id: "cc1",
                arquivo: "ControleRemotoAvancado.java",
                linguagem: "java",
                respostaCorretaId: "cc1-t1",
                explicacao: "modoEconomico() deve reutilizar o \"dispositivo\" recebido no construtor (herdado da Abstraction), não criar uma instância nova — é essa referência compartilhada que faz a ponte funcionar de verdade.",
                template:
`public class ControleRemotoAvancado extends ControleRemoto {
    public ControleRemotoAvancado(Dispositivo dispositivo) {
        super(dispositivo);
    }

    public void modoEconomico() {
{{1}}
    }
}`,
                opcoes: [
                    new Trecho({ id: "cc1-t1", codigo: `        dispositivo.desligar();\n        System.out.println("Modo econômico ativado");` }),
                    new Trecho({ id: "cc1-t2", codigo: `        Dispositivo novo = new LuzApiario();\n        novo.desligar();` }),
                    new Trecho({ id: "cc1-t3", codigo: `        this.dispositivo = null;` }),
                    new Trecho({ id: "cc1-t4", codigo: `        // não faz nada com o dispositivo` }),
                ]
            }),
            new CodigoIncompleto({
                id: "cc2",
                arquivo: "VentiladorApiario.java",
                linguagem: "java",
                respostaCorretaId: "cc2-t1",
                explicacao: "Pra ser um ConcreteImplementor válido, a classe precisa implementar a interface Dispositivo por completo, incluindo o método desligar() — sem ele, a classe nem compila, já que a interface exige as duas operações.",
                template:
`public class VentiladorApiario implements Dispositivo {
    private boolean ligado = false;

    @Override
    public void ligar() {
        ligado = true;
        System.out.println("Ventilador ligado");
    }

{{1}}
}`,
                opcoes: [
                    new Trecho({ id: "cc2-t1", codigo: `    @Override\n    public void desligar() {\n        ligado = false;\n        System.out.println("Ventilador desligado");\n    }` }),
                    new Trecho({ id: "cc2-t2", codigo: `    public void desligar(boolean estado) {\n        ligado = estado;\n    }` }),
                    new Trecho({ id: "cc2-t3", codigo: `    private void desligar() {\n        ligado = false;\n    }` }),
                    new Trecho({ id: "cc2-t4", codigo: `    // desligar() não é obrigatório` }),
                ]
            }),
        ]
    }),

    new EncontreBug({
        id: "eb-bridge-002",
        dificuldade: Dificuldade.Dificil,
        grupo: "Estruturais",
        nivel: 3,
        padrao: "Bridge",
        perguntas: [
            new PerguntaBug({
                id: "pb1",
                enunciado: "Ao adicionar um terceiro dispositivo, o time criou uma nova classe pra cada combinação com os controles existentes. O que isso indica sobre o design?",
                explicacao: "Criar ControleBasicoAquecedor e ControleAvancadoAquecedor para o novo dispositivo é sintoma de que a ponte (composição entre ControleRemoto e Dispositivo) foi abandonada em algum lugar — no Bridge corretamente aplicado, um dispositivo novo só precisa implementar a interface Dispositivo; nenhuma classe nova de controle deveria ser necessária.",
                respostas: [
                    new RespostaBug({ id: "pb1-r1", texto: "É o comportamento esperado — cada dispositivo novo sempre exige novas classes de controle." }),
                    new RespostaBug({ id: "pb1-r2", texto: "Indica que a ponte por composição foi abandonada em algum lugar do código — um Bridge correto não precisaria de classes novas de controle para um dispositivo novo.", correta: true }),
                    new RespostaBug({ id: "pb1-r3", texto: "Indica que Dispositivo deveria ser uma classe abstrata em vez de interface." }),
                    new RespostaBug({ id: "pb1-r4", texto: "Indica que ControleRemoto deveria ser \"final\"." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb1-a1",
                        nome: "ControleBasicoAquecedor.java",
                        linguagem: "java",
                        codigo:
`public class ControleBasicoAquecedor {
    private final AquecedorApiario aquecedor = new AquecedorApiario();

    public void ligar() {
        aquecedor.ligar();
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a2",
                        nome: "ControleAvancadoAquecedor.java",
                        linguagem: "java",
                        codigo:
`public class ControleAvancadoAquecedor {
    private final AquecedorApiario aquecedor = new AquecedorApiario();

    public void ligar() {
        aquecedor.ligar();
    }

    public void modoTurbo() {
        System.out.println("Aquecendo no máximo");
    }
}`
                    }),
                    new Arquivo({
                        id: "pb1-a3",
                        nome: "ControleRemoto.java",
                        linguagem: "java",
                        codigo:
`public class ControleRemoto {
    protected final Dispositivo dispositivo;

    public ControleRemoto(Dispositivo dispositivo) {
        this.dispositivo = dispositivo;
    }

    public void alternar(boolean ligado) {
        if (ligado) dispositivo.ligar(); else dispositivo.desligar();
    }
}`
                    }),
                ]
            }),
            new PerguntaBug({
                id: "pb2",
                enunciado: "Esse método de desconto aplica um desconto negativo (aumenta o preço) para valores de porcentagem acima de 100. Qual correção evita isso?",
                explicacao: "O método não valida o intervalo de \"percentual\" — valores acima de 100 fazem \"preco * (1 - percentual/100)\" ficar negativo. É preciso validar (ex.: lançar exceção ou limitar entre 0 e 100) antes de aplicar a fórmula.",
                respostas: [
                    new RespostaBug({ id: "pb2-r1", texto: "Validar que \"percentual\" está entre 0 e 100 antes de aplicar o desconto.", correta: true }),
                    new RespostaBug({ id: "pb2-r2", texto: "Trocar o tipo de \"preco\" de double para int." }),
                    new RespostaBug({ id: "pb2-r3", texto: "Multiplicar o resultado final por -1." }),
                    new RespostaBug({ id: "pb2-r4", texto: "Remover o parâmetro \"percentual\" do método." }),
                ],
                arquivos: [
                    new Arquivo({
                        id: "pb2-a1",
                        nome: "Desconto.java",
                        linguagem: "java",
                        codigo:
`public class Desconto {
    public static double aplicar(double preco, double percentual) {
        return preco * (1 - percentual / 100);
    }
}`
                    }),
                ]
            }),
        ]
    }),

    new Licao({
        id: "licao-bridge-003",
        dificuldade: Dificuldade.Dificil,
        grupo: "Estruturais",
        nivel: 3,
        padrao: "Bridge",
        conteudoMarkdown: [
            '# Bridge: variações e quando (não) usar 🐝',
            '',
            '## Bridge vs. Adapter',
            '',
            'Os dois padrões têm uma estrutura parecida (uma classe guarda uma referência a outra e delega chamadas), mas resolvem problemas diferentes — a diferença está na **intenção** e no **momento**:',
            '',
            '| | Bridge | Adapter |',
            '|---|---|---|',
            '| **Quando é aplicado** | Planejado desde o início do design. | Aplicado depois, sobre código/API já existente. |',
            '| **Objetivo** | Permitir que duas hierarquias variem de forma independente. | Tornar compatíveis duas interfaces que não foram feitas uma para a outra. |',
            '| **Quantas implementações** | Geralmente várias, desde o começo. | Geralmente uma — só a que já existe e precisa ser encaixada. |',
            '',
            'Na prática: se você está desenhando o sistema do zero e já sabe que vai ter múltiplas variações dos dois lados (vários controles, vários dispositivos), comece com Bridge. Se você está integrando uma biblioteca de terceiros cuja interface não bate com a que seu código espera, isso é Adapter.',
            '',
            '## Bridge vs. Strategy',
            '',
            'Estruturalmente, Bridge e Strategy também se parecem (composição + delegação). A diferença é de **intenção**: Strategy troca um **algoritmo** (o *como fazer* uma única operação) em tempo de execução; Bridge separa duas **hierarquias inteiras de abstração**, cada uma podendo ter várias camadas de subclasses dos dois lados.',
            '',
            '## Quando o Bridge faz sentido',
            '',
            '- Quando você já enxerga, no design, **duas dimensões de variação** que crescem de forma independente (ex.: tipos de controle × tipos de dispositivo; formas × plataformas de renderização).',
            '- Quando trocar a implementação **em tempo de execução** é um requisito (ex.: o mesmo controle remoto passando a operar um dispositivo diferente sem recompilar nada).',
            '- Quando você quer evitar acoplar a interface pública (Abstraction) aos detalhes internos de implementação, permitindo publicar a Abstraction sem expor a implementação.',
            '',
            '## Quando evitar',
            '',
            '- Quando só existe **uma** implementação e não há sinal de que outra vá aparecer — nesse caso, a indireção da Bridge só adiciona complexidade sem benefício real.',
            '- Quando as duas hierarquias estão fortemente amarradas por natureza (mudar uma sempre implica mudar a outra) — aí a separação é artificial e não compra flexibilidade nenhuma.',
        ].join('\n')
    }),

    new Quiz({
        id: "quiz-bridge-002",
        dificuldade: Dificuldade.Dificil,
        padrao: "Bridge",
        grupo: "Estruturais",
        nivel: 3,
        tipo: TipoDesafio.PerguntasRespostas,
        perguntas: [
            new Pergunta({
                id: "p1",
                texto: "Qual é a principal diferença de intenção entre Bridge e Adapter?",
                repostas: [
                    new Resposta({ id: "p1r1", texto: "Bridge é planejado desde o design para permitir duas hierarquias variarem independentemente; Adapter é aplicado depois, para compatibilizar uma interface já existente.", correta: true }),
                    new Resposta({ id: "p1r2", texto: "Adapter só funciona com classes finais; Bridge não." }),
                    new Resposta({ id: "p1r3", texto: "Não há diferença real entre os dois padrões." }),
                    new Resposta({ id: "p1r4", texto: "Bridge exige herança múltipla; Adapter não." }),
                ]
            }),
            new Pergunta({
                id: "p2",
                texto: "Com 3 tipos de Abstraction e 4 tipos de Implementor, quantas classes o Bridge precisa, no total, comparado à abordagem sem Bridge?",
                repostas: [
                    new Resposta({ id: "p2r1", texto: "Bridge: 3 + 4 = 7 classes. Sem Bridge: até 3 × 4 = 12 classes.", correta: true }),
                    new Resposta({ id: "p2r2", texto: "As duas abordagens sempre resultam no mesmo número de classes." }),
                    new Resposta({ id: "p2r3", texto: "Bridge sempre precisa de mais classes do que a abordagem sem Bridge." }),
                    new Resposta({ id: "p2r4", texto: "Bridge elimina a necessidade de qualquer classe de Implementor." }),
                ]
            }),
            new Pergunta({
                id: "p3",
                texto: "Qual sinal no código indica que a ponte (composição) foi abandonada em algum lugar do design?",
                repostas: [
                    new Resposta({ id: "p3r1", texto: "Um dispositivo novo exige criar novas classes de controle para cada combinação existente.", correta: true }),
                    new Resposta({ id: "p3r2", texto: "A interface Implementor ter mais de um método." }),
                    new Resposta({ id: "p3r3", texto: "A Abstraction ser uma classe abstrata em vez de concreta." }),
                    new Resposta({ id: "p3r4", texto: "O uso de \"protected\" no campo que guarda o Implementor." }),
                ]
            }),
            new Pergunta({
                id: "p4",
                texto: "Quando faz mais sentido EVITAR o padrão Bridge?",
                repostas: [
                    new Resposta({ id: "p4r1", texto: "Quando existem várias implementações conhecidas desde o início do design." }),
                    new Resposta({ id: "p4r2", texto: "Quando só existe uma implementação e não há indício de que outra vá surgir.", correta: true }),
                    new Resposta({ id: "p4r3", texto: "Quando é necessário trocar a implementação em tempo de execução." }),
                    new Resposta({ id: "p4r4", texto: "Quando a Abstraction precisa ser publicada sem expor a implementação." }),
                ]
            }),
        ]
    }),

    new CompleteTexto({
        id: "ct-bridge-002",
        dificuldade: Dificuldade.Medio,
        grupo: "Estruturais",
        nivel: 2,
        padrao: "Bridge",
        textos: [
            new Texto({
                id: "t1",
                texto: "No Bridge, a {{1}} guarda uma referência ao {{2}} e delega as chamadas pra ele — é essa composição que forma a \"ponte\" entre as duas hierarquias.",
                opcoes: ["Abstraction", "Implementor", "RefinedAbstraction", "ConcreteImplementor", "interface gráfica", "fábrica"],
                respostas: ["Abstraction", "Implementor"]
            }),
            new Texto({
                id: "t2",
                texto: "A {{1}} estende a Abstraction com funcionalidades extras, sem precisar saber qual {{2}} concreto está por trás.",
                opcoes: ["RefinedAbstraction", "ConcreteImplementor", "Abstraction", "Implementor", "Adapter", "Decorator"],
                respostas: ["RefinedAbstraction", "ConcreteImplementor"]
            }),
            new Texto({
                id: "t3",
                texto: "O Bridge separa duas hierarquias — a de {{1}} e a de {{2}} — ligadas por uma única seta de {{3}} entre elas.",
                opcoes: ["abstração", "implementação", "composição", "herança", "delegação dupla", "generalização"],
                respostas: ["abstração", "implementação", "composição"]
            }),
        ]
    }),

    new Quiz({
        id: "quiz-bridge-003",
        dificuldade: Dificuldade.Dificil,
        padrao: "Bridge",
        grupo: "Estruturais",
        nivel: 3,
        tipo: TipoDesafio.PerguntasRespostas,
        perguntas: [
            new Pergunta({
                id: "p1",
                texto: "Ao adicionar um novo ConcreteImplementor (ex.: um novo tipo de dispositivo), o que precisa mudar na hierarquia de Abstraction?",
                repostas: [
                    new Resposta({ id: "p1r1", texto: "Nada — a Abstraction continua funcionando sem alterações, já que só depende da interface Implementor.", correta: true }),
                    new Resposta({ id: "p1r2", texto: "Toda subclasse de Abstraction precisa ser reescrita." }),
                    new Resposta({ id: "p1r3", texto: "É preciso criar uma nova Abstraction para cada Implementor." }),
                    new Resposta({ id: "p1r4", texto: "A interface Implementor precisa ser duplicada." }),
                ]
            }),
            new Pergunta({
                id: "p2",
                texto: "Qual é a principal diferença de intenção entre Bridge e Strategy, já que os dois usam composição de forma parecida?",
                repostas: [
                    new Resposta({ id: "p2r1", texto: "Bridge separa duas hierarquias que evoluem juntas por design; Strategy troca um algoritmo isolado, geralmente sem uma segunda hierarquia de abstração por trás.", correta: true }),
                    new Resposta({ id: "p2r2", texto: "Strategy só funciona com classes finais; Bridge não." }),
                    new Resposta({ id: "p2r3", texto: "Bridge não permite trocar a implementação em tempo de execução; Strategy sim." }),
                    new Resposta({ id: "p2r4", texto: "Não há diferença — são o mesmo padrão com nomes diferentes." }),
                ]
            }),
            new Pergunta({
                id: "p3",
                texto: "Um exemplo clássico de Bridge no mundo real é um driver de banco de dados (ex.: JDBC). O que representa o Implementor nesse cenário?",
                repostas: [
                    new Resposta({ id: "p3r1", texto: "O driver específico de cada banco (PostgreSQL, MySQL...), que implementa a comunicação real com aquele banco.", correta: true }),
                    new Resposta({ id: "p3r2", texto: "A query SQL escrita pelo desenvolvedor." }),
                    new Resposta({ id: "p3r3", texto: "A classe Connection usada pelo código cliente." }),
                    new Resposta({ id: "p3r4", texto: "O resultado retornado pela consulta." }),
                ]
            }),
            new Pergunta({
                id: "p4",
                texto: "Em qual categoria do catálogo GoF o Bridge se encaixa?",
                repostas: [
                    new Resposta({ id: "p4r1", texto: "Criacional." }),
                    new Resposta({ id: "p4r2", texto: "Estrutural.", correta: true }),
                    new Resposta({ id: "p4r3", texto: "Comportamental." }),
                    new Resposta({ id: "p4r4", texto: "Concorrência." }),
                ]
            }),
        ]
    }),
];
