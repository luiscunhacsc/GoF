const patterns = [
  {
    id: "singleton",
    name: "Singleton",
    category: "creational",
    keywords: ["instância unica", "global", "configuracao"],
    tagline: "Garante que uma classe tenha apenas uma instância.",
    intent: "Centraliza acesso a um recurso unico e controla o ciclo de vida dessa instância.",
    whenToUse: [
      "Quando precisares de um unico ponto de acesso para configuracao ou cache.",
      "Quando multiplas instancias do mesmo servico criariam inconsistência.",
      "Quando queres inicializacao lazy com controlo explícito."
    ],
    benefits: [
      "Evita duplicacao de estado global.",
      "Controla criação e acesso de forma previsivel."
    ],
    tradeoffs: [
      "Pode esconder dependências e dificultar testes.",
      "Se abusado, aproxima-se de variavel global."
    ],
    uml: `
classDiagram
  class AppConfig {
    - static AppConfig instance
    - AppConfig()
    + static AppConfig getInstance()
    + execute()
  }
`,
    javaExample: `
public final class AppConfig {
    private static volatile AppConfig instance;
    private String apiBaseUrl = "https://api.exemplo.pt";

    private AppConfig() {}

    public static AppConfig getInstance() {
        if (instance == null) {
            synchronized (AppConfig.class) {
                if (instance == null) {
                    instance = new AppConfig();
                }
            }
        }
        return instance;
    }

    public String getApiBaseUrl() {
        return apiBaseUrl;
    }
}
`
  },
  {
    id: "factory-method",
    name: "Factory Method",
    category: "creational",
    keywords: ["factory", "criação", "subclasses"],
    tagline: "Move a criação para subclasses atraves de um método fábrica.",
    intent: "Define um contrato para criação de objetos, delegando a decisao concreta as subclasses.",
    whenToUse: [
      "Quando queres desacoplar cliente de classes concretas.",
      "Quando o tipo de produto depende do contexto em runtime.",
      "Quando novas variantes devem ser adicionadas sem alterar cliente."
    ],
    benefits: [
      "Reduz acoplamento com implementações concretas.",
      "Facilita extensao por herança e polimorfismo."
    ],
    tradeoffs: [
      "Aumenta numero de classes no sistema.",
      "Pode complicar fluxos simples de criação."
    ],
    uml: `
classDiagram
  class Report {
    <<interface>>
    +render()
  }
  class PdfReport
  class HtmlReport
  Report <|.. PdfReport
  Report <|.. HtmlReport

  class ReportCreator {
    <<abstract>>
    +createReport() Report
    +export()
  }
  class PdfCreator
  class HtmlCreator
  ReportCreator <|-- PdfCreator
  ReportCreator <|-- HtmlCreator
  PdfCreator ..> PdfReport
  HtmlCreator ..> HtmlReport
`,
    javaExample: `
interface Report {
    String render();
}

class PdfReport implements Report {
    public String render() { return "PDF report"; }
}

class HtmlReport implements Report {
    public String render() { return "<html>report</html>"; }
}

abstract class ReportCreator {
    protected abstract Report createReport();
    public String export() {
        Report report = createReport();
        return report.render();
    }
}

class PdfCreator extends ReportCreator {
    protected Report createReport() { return new PdfReport(); }
}

class HtmlCreator extends ReportCreator {
    protected Report createReport() { return new HtmlReport(); }
}
`
  },
  {
    id: "abstract-factory",
    name: "Abstract Factory",
    category: "creational",
    keywords: ["família", "objetos relacionados", "ui"],
    tagline: "Cria famílias de objetos relacionados sem expor classes concretas.",
    intent: "Fornece uma interface para criar objetos compatíveis entre si, mantendo consistencia entre variantes.",
    whenToUse: [
      "Quando o sistema precisa suportar temas/plataformas completas.",
      "Quando produtos de uma família devem ser usados em conjunto.",
      "Quando queres alternar famílias em runtime."
    ],
    benefits: [
      "Garante compatibilidade entre objetos criados.",
      "Facilita troca de famílias completas."
    ],
    tradeoffs: [
      "Adicionar novo tipo de produto obriga a mudar todas as fábricas.",
      "Introduz mais abstrações."
    ],
    uml: `
classDiagram
  class GUIFactory {
    <<interface>>
    +createButton() Button
    +createCheckbox() Checkbox
  }
  class WindowsFactory
  class MacFactory
  GUIFactory <|.. WindowsFactory
  GUIFactory <|.. MacFactory

  class Button {
    <<interface>>
    +paint()
  }
  class WinButton
  class MacButton
  Button <|.. WinButton
  Button <|.. MacButton

  class Checkbox {
    <<interface>>
    +paint()
  }
  class WinCheckbox
  class MacCheckbox
  Checkbox <|.. WinCheckbox
  Checkbox <|.. MacCheckbox

  WindowsFactory ..> WinButton
  WindowsFactory ..> WinCheckbox
  MacFactory ..> MacButton
  MacFactory ..> MacCheckbox
`,
    javaExample: `
interface Button { void paint(); }
interface Checkbox { void paint(); }

class WinButton implements Button { public void paint() { System.out.println("WinButton"); } }
class MacButton implements Button { public void paint() { System.out.println("MacButton"); } }
class WinCheckbox implements Checkbox { public void paint() { System.out.println("WinCheckbox"); } }
class MacCheckbox implements Checkbox { public void paint() { System.out.println("MacCheckbox"); } }

interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class WindowsFactory implements GUIFactory {
    public Button createButton() { return new WinButton(); }
    public Checkbox createCheckbox() { return new WinCheckbox(); }
}

class MacFactory implements GUIFactory {
    public Button createButton() { return new MacButton(); }
    public Checkbox createCheckbox() { return new MacCheckbox(); }
}
`
  },
  {
    id: "builder",
    name: "Builder",
    category: "creational",
    keywords: ["objeto complexo", "passo a passo", "imutavel"],
    tagline: "Separa construção de objeto complexo da sua representação final.",
    intent: "Permite construir objetos em etapas, com maior legibilidade e controlo de combinacoes.",
    whenToUse: [
      "Quando construtores ficam longos e pouco legiveis.",
      "Quando o objeto possui muitas opções opcionais.",
      "Quando queres criar versóes diferentes do mesmo produto."
    ],
    benefits: [
      "Melhora legibilidade e manutencao da construção.",
      "Reduz construtores telescópicos."
    ],
    tradeoffs: [
      "Aumenta numero de classes/interfaces.",
      "Pode ser overkill para objetos simples."
    ],
    uml: `
classDiagram
  class Builder {
    +cpu(String)
    +ram(int)
    +ssd(int)
    +build() Computer
  }
  Computer *-- Builder
  class Computer
`,
    javaExample: `
class Computer {
    private final String cpu;
    private final int ramGb;
    private final int ssdGb;

    private Computer(Builder builder) {
        this.cpu = builder.cpu;
        this.ramGb = builder.ramGb;
        this.ssdGb = builder.ssdGb;
    }

    static class Builder {
        private String cpu;
        private int ramGb;
        private int ssdGb;

        Builder cpu(String value) { this.cpu = value; return this; }
        Builder ramGb(int value) { this.ramGb = value; return this; }
        Builder ssdGb(int value) { this.ssdGb = value; return this; }
        Computer build() { return new Computer(this); }
    }
}
`
  },
  {
    id: "prototype",
    name: "Prototype",
    category: "creational",
    keywords: ["clone", "copiar objeto", "estado inicial"],
    tagline: "Cria novos objetos ao clonar uma instância existente.",
    intent: "Evita custo de criação do zero e preserva configuracoes base atraves de copia controlada.",
    whenToUse: [
      "Quando criação de objetos e cara (I/O, parsing, setup pesado).",
      "Quando queres modelos base reutilizaveis.",
      "Quando precisas de objetos com pequenas variações."
    ],
    benefits: [
      "Criação rápida de objetos complexos.",
      "Reduz dependência de construtores detalhados."
    ],
    tradeoffs: [
      "Clone profundo pode ser complexo.",
      "Risco de partilha acidental de referências mutaveis."
    ],
    uml: `
classDiagram
  class Prototype {
    <<interface>>
    +copy() Prototype
  }
  class Enemy {
    - type : String
    - hp : int
    +copy() Prototype
  }
  Prototype <|.. Enemy
`,
    javaExample: `
interface Prototype<T> {
    T copy();
}

class Enemy implements Prototype<Enemy> {
    private final String type;
    private final int hp;

    Enemy(String type, int hp) {
        this.type = type;
        this.hp = hp;
    }

    public Enemy copy() {
        return new Enemy(type, hp);
    }
}
`
  },
  {
    id: "adapter",
    name: "Adapter",
    category: "structural",
    keywords: ["compatibilidade", "interface", "integracao"],
    tagline: "Converte interface incompatível para outra esperada pelo cliente.",
    intent: "Permite colaboração entre classes que não foram desenhadas para trabalhar juntas.",
    whenToUse: [
      "Quando integras bibliotecas legadas.",
      "Quando queres reutilizar classe existente com interface diferente.",
      "Quando migras APIs sem quebrar cliente."
    ],
    benefits: [
      "Reutiliza codigo existente sem alterar origem.",
      "Reduz impacto de mudanças externas."
    ],
    tradeoffs: [
      "Adiciona camada extra de abstração.",
      "Pode esconder inconsistencias de design."
    ],
    uml: `
classDiagram
  class PaymentGateway {
    <<interface>>
    +pay(amount)
  }
  class LegacyGateway {
    +makePaymentInCents(cents)
  }
  class LegacyGatewayAdapter {
    - adaptee : LegacyGateway
    +pay(amount)
  }
  PaymentGateway <|.. LegacyGatewayAdapter
  LegacyGatewayAdapter --> LegacyGateway
`,
    javaExample: `
interface PaymentGateway {
    void pay(double amount);
}

class LegacyGateway {
    void makePaymentInCents(int cents) {
        System.out.println("Paid " + cents + " cents");
    }
}

class LegacyGatewayAdapter implements PaymentGateway {
    private final LegacyGateway legacyGateway;

    LegacyGatewayAdapter(LegacyGateway legacyGateway) {
        this.legacyGateway = legacyGateway;
    }

    public void pay(double amount) {
        legacyGateway.makePaymentInCents((int) (amount * 100));
    }
}
`
  },
  {
    id: "bridge",
    name: "Bridge",
    category: "structural",
    keywords: ["abstração", "implementação", "variação independente"],
    tagline: "Separa abstração da implementação para evoluírem independentemente.",
    intent: "Evita explosao de subclasses quando tens multiplas dimensoes de variação.",
    whenToUse: [
      "Quando abstração e implementação mudam por razões diferentes.",
      "Quando queres trocar implementações em runtime.",
      "Quando tens combinacoes cruzadas de funcionalidades."
    ],
    benefits: [
      "Reduz herança combinatoria.",
      "Promove composição e flexibilidade."
    ],
    tradeoffs: [
      "Aumenta numero de interfaces/classes.",
      "Pode ser excessivo em casos simples."
    ],
    uml: `
classDiagram
  class Device {
    <<interface>>
    +enable()
    +disable()
    +isEnabled() boolean
  }
  class Tv
  Device <|.. Tv

  class RemoteControl {
    - device : Device
    +togglePower()
  }
  RemoteControl --> Device
`,
    javaExample: `
interface Device {
    void enable();
    void disable();
}

class Tv implements Device {
    public void enable() { System.out.println("TV ON"); }
    public void disable() { System.out.println("TV OFF"); }
}

class RemoteControl {
    protected final Device device;
    RemoteControl(Device device) { this.device = device; }
    void toggle(boolean on) {
        if (on) device.enable();
        else device.disable();
    }
}
`
  },
  {
    id: "composite",
    name: "Composite",
    category: "structural",
    keywords: ["árvore", "parte-todo", "uniformidade"],
    tagline: "Trata objetos individuais e composicoes de forma uniforme.",
    intent: "Modela estruturas hierárquicas (árvore) onde cliente não precisa distinguir folha de composição.",
    whenToUse: [
      "Quando modelas menus, ficheiros, componentes visuais.",
      "Quando operações devem aplicar-se tanto a nos quanto folhas.",
      "Quando queres APIs uniformes para estruturas recursivas."
    ],
    benefits: [
      "Simplifica cliente ao unificar interface.",
      "Facilita composição recursiva."
    ],
    tradeoffs: [
      "Pode tornar interface demasiado genérica.",
      "Validação de regras em runtime fica mais difícil."
    ],
    uml: `
classDiagram
  class Node {
    <<interface>>
    +size()
  }
  class FileNode
  class FolderNode {
    - children : List~Node~
    +add(Node)
    +size()
  }
  Node <|.. FileNode
  Node <|.. FolderNode
  FolderNode --> Node : contém
`,
    javaExample: `
import java.util.ArrayList;
import java.util.List;

interface Node {
    int size();
}

class FileNode implements Node {
    private final int kb;
    FileNode(int kb) { this.kb = kb; }
    public int size() { return kb; }
}

class FolderNode implements Node {
    private final List<Node> children = new ArrayList<>();
    void add(Node node) { children.add(node); }
    public int size() {
        return children.stream().mapToInt(Node::size).sum();
    }
}
`
  },
  {
    id: "decorator",
    name: "Decorator",
    category: "structural",
    keywords: ["comportamento dinamico", "wrapping", "extensao"],
    tagline: "Adiciona responsabilidades a objetos dinamicamente.",
    intent: "Extende comportamento sem modificar classe original nem criar herança excessiva.",
    whenToUse: [
      "Quando precisas combinar funcionalidades em runtime.",
      "Quando herança cria muitas subclasses para combinacoes.",
      "Quando queres manter classe base simples."
    ],
    benefits: [
      "Composição flexível de comportamentos.",
      "Respeita principio Open/Closed."
    ],
    tradeoffs: [
      "Muitos wrappers podem dificultar debugging.",
      "Ordem de composição altera resultado."
    ],
    uml: `
classDiagram
  class Coffee {
    <<interface>>
    +cost() double
  }
  class Espresso
  Coffee <|.. Espresso

  class CoffeeDecorator {
    <<abstract>>
    - component : Coffee
  }
  Coffee <|.. CoffeeDecorator

  class MilkDecorator
  class CaramelDecorator
  CoffeeDecorator <|-- MilkDecorator
  CoffeeDecorator <|-- CaramelDecorator
  CoffeeDecorator --> Coffee
`,
    javaExample: `
interface Coffee {
    double cost();
}

class Espresso implements Coffee {
    public double cost() { return 1.20; }
}

abstract class CoffeeDecorator implements Coffee {
    protected final Coffee delegate;
    CoffeeDecorator(Coffee delegate) { this.delegate = delegate; }
}

class MilkDecorator extends CoffeeDecorator {
    MilkDecorator(Coffee delegate) { super(delegate); }
    public double cost() { return delegate.cost() + 0.30; }
}

class CaramelDecorator extends CoffeeDecorator {
    CaramelDecorator(Coffee delegate) { super(delegate); }
    public double cost() { return delegate.cost() + 0.40; }
}
`
  },
  {
    id: "facade",
    name: "Facade",
    category: "structural",
    keywords: ["api simples", "subsystems", "orquestracao"],
    tagline: "Fornece interface simples para um subsistema complexo.",
    intent: "Esconde detalhes de integracao e reduz acoplamento entre cliente e subsistemas.",
    whenToUse: [
      "Quando subsistema e grande e difícil de usar diretamente.",
      "Quando queres ponto de entrada unico para um fluxo.",
      "Quando precisas encapsular complexidade legada."
    ],
    benefits: [
      "Simplifica uso e onboarding do sistema.",
      "Reduz dependências diretas do cliente."
    ],
    tradeoffs: [
      "Facade muito grande vira god object.",
      "Pode esconder capacidades avancadas do subsistema."
    ],
    uml: `
classDiagram
  class OrderFacade {
    +placeOrder()
  }
  class InventoryService
  class PaymentService
  class ShippingService
  OrderFacade --> InventoryService
  OrderFacade --> PaymentService
  OrderFacade --> ShippingService
`,
    javaExample: `
class InventoryService {
    boolean reserve(String sku) { return true; }
}
class PaymentService {
    boolean charge(double amount) { return true; }
}
class ShippingService {
    void ship(String sku) { System.out.println("Shipped " + sku); }
}

class OrderFacade {
    private final InventoryService inventory = new InventoryService();
    private final PaymentService payment = new PaymentService();
    private final ShippingService shipping = new ShippingService();

    boolean placeOrder(String sku, double amount) {
        if (!inventory.reserve(sku)) return false;
        if (!payment.charge(amount)) return false;
        shipping.ship(sku);
        return true;
    }
}
`
  },
  {
    id: "flyweight",
    name: "Flyweight",
    category: "structural",
    keywords: ["memória", "partilha", "estado intrínseco"],
    tagline: "Partilha estado comum para reduzir uso de memória.",
    intent: "Separa estado intrínseco (partilhável) de estado extrínseco (contextual) para escalar objetos em massa.",
    whenToUse: [
      "Quando tens milhões de objetos semelhantes.",
      "Quando memória e gargalo principal.",
      "Quando parte do estado pode ser reutilizada."
    ],
    benefits: [
      "Reducao agressiva de memória.",
      "Melhor performance em cenários massivos."
    ],
    tradeoffs: [
      "Aumenta complexidade na gestao de estado externo.",
      "Pode dificultar leitura da modelação."
    ],
    uml: `
classDiagram
  class Flyweight {
    <<interface>>
    +draw(x, y)
  }
  class TreeType {
    - texture : String
    +draw(x, y)
  }
  Flyweight <|.. TreeType
  class TreeTypeFactory {
    - cache : Map
    +get(type) TreeType
  }
  TreeTypeFactory --> TreeType
`,
    javaExample: `
import java.util.HashMap;
import java.util.Map;

interface Flyweight {
    void draw(int x, int y);
}

class TreeType implements Flyweight {
    private final String texture;
    TreeType(String texture) { this.texture = texture; }
    public void draw(int x, int y) {
        System.out.println("Draw " + texture + " at " + x + "," + y);
    }
}

class TreeTypeFactory {
    private static final Map<String, TreeType> CACHE = new HashMap<>();
    static TreeType get(String texture) {
        return CACHE.computeIfAbsent(texture, TreeType::new);
    }
}
`
  },
  {
    id: "proxy",
    name: "Proxy",
    category: "structural",
    keywords: ["controlo acesso", "lazy", "remoto"],
    tagline: "Controla acesso a outro objeto atraves de substituto.",
    intent: "Interceta chamadas para adicionar políticas como segurança, cache, lazy loading ou acesso remoto.",
    whenToUse: [
      "Quando precisas validar permissões antes da operação.",
      "Quando objeto real e caro e deve ser carregado sob demanda.",
      "Quando queres cache transparente para chamadas repetidas."
    ],
    benefits: [
      "Adiciona políticas sem alterar objeto real.",
      "Permite otimizações e proteção."
    ],
    tradeoffs: [
      "Pode introduzir latência adicional.",
      "Debugging pode ficar menos direto."
    ],
    uml: `
classDiagram
  class ImageService {
    <<interface>>
    +fetch(id)
  }
  class RealImageService
  class CachingImageProxy {
    - realService : RealImageService
    +fetch(id)
  }
  ImageService <|.. RealImageService
  ImageService <|.. CachingImageProxy
  CachingImageProxy --> RealImageService
`,
    javaExample: `
interface ImageService {
    String fetch(String id);
}

class RealImageService implements ImageService {
    public String fetch(String id) { return "binary-image-" + id; }
}

class CachingImageProxy implements ImageService {
    private final ImageService real = new RealImageService();
    private final java.util.Map<String, String> cache = new java.util.HashMap<>();

    public String fetch(String id) {
        return cache.computeIfAbsent(id, real::fetch);
    }
}
`
  },
  {
    id: "chain-of-responsibility",
    name: "Chain of Responsibility",
    category: "behavioral",
    keywords: ["pipeline", "handlers", "encadeamento"],
    tagline: "Encadeia handlers para processar pedido sem acoplamento direto.",
    intent: "Permite que varios objetos tentem tratar uma requisição de forma sequencial.",
    whenToUse: [
      "Quando tens regras sequenciais e opcionais de validação.",
      "Quando queres configurar fluxo de processamento dinamicamente.",
      "Quando um unico handler não deve conhecer todos os casos."
    ],
    benefits: [
      "Baixo acoplamento entre emissor e processadores.",
      "Fluxo extensível por composição."
    ],
    tradeoffs: [
      "Pedido pode ficar sem tratamento se cadeia mal configurada.",
      "Rastrear caminho exato pode ser difícil."
    ],
    uml: `
classDiagram
  class Handler {
    <<abstract>>
    - next : Handler
    +setNext(Handler next) Handler
    +handle(String request)
    #process(String request) boolean
  }
`,
    javaExample: `
abstract class Handler {
    private Handler next;

    public Handler setNext(Handler next) {
        this.next = next;
        return next;
    }

    public final boolean handle(String request) {
        if (!process(request)) return false;
        return next == null || next.handle(request);
    }

    protected abstract boolean process(String request);
}
`
  },
  {
    id: "command",
    name: "Command",
    category: "behavioral",
    keywords: ["ação encapsulada", "undo", "fila"],
    tagline: "Encapsula uma ação como objeto.",
    intent: "Transforma pedidos em objetos para parametrização, fila, histórico e undo.",
    whenToUse: [
      "Quando precisas de undo/redo.",
      "Quando ações devem ser agendadas ou enfileiradas.",
      "Quando UI deve desacoplar-se da lógica de execucao."
    ],
    benefits: [
      "Desacopla invocador de executor.",
      "Facilita composição de operações e histórico."
    ],
    tradeoffs: [
      "Cria varias classes para comandos simples.",
      "Pode aumentar overhead de objetos."
    ],
    uml: `
classDiagram
  class Command {
    <<interface>>
    +execute()
  }
  class Light {
    +on()
  }
  class LightOnCommand
  Command <|.. LightOnCommand
  LightOnCommand --> Light
  class RemoteControl {
    +press(Command)
  }
  RemoteControl --> Command
`,
    javaExample: `
interface Command {
    void execute();
}

class Light {
    void on() { System.out.println("Light ON"); }
}

class LightOnCommand implements Command {
    private final Light light;
    LightOnCommand(Light light) { this.light = light; }
    public void execute() { light.on(); }
}

class RemoteControl {
    void press(Command command) { command.execute(); }
}
`
  },
  {
    id: "interpreter",
    name: "Interpreter",
    category: "behavioral",
    keywords: ["gramática", "linguagem", "expressões"],
    tagline: "Define gramática e interpreta sentenças dessa linguagem.",
    intent: "Representa regras gramaticais como classes para interpretar expressões.",
    whenToUse: [
      "Quando linguagem e pequena e regras sao estáveis.",
      "Quando queres interpretar expressões de domínio.",
      "Quando um parser completo seria excessivo."
    ],
    benefits: [
      "Gramática explicita e extensível por classes.",
      "Boa legibilidade para DSLs pequenas."
    ],
    tradeoffs: [
      "Escala mal para gramaticas grandes.",
      "Performance inferior a parsers especializados."
    ],
    uml: `
classDiagram
  class Expression {
    <<interface>>
    +interpret(Context) int
  }
  class NumberExpression
  class AddExpression
  Expression <|.. NumberExpression
  Expression <|.. AddExpression
  AddExpression --> Expression : left
  AddExpression --> Expression : right
`,
    javaExample: `
interface Expression {
    int interpret();
}

class NumberExpression implements Expression {
    private final int value;
    NumberExpression(int value) { this.value = value; }
    public int interpret() { return value; }
}

class AddExpression implements Expression {
    private final Expression left;
    private final Expression right;
    AddExpression(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }
    public int interpret() { return left.interpret() + right.interpret(); }
}
`
  },
  {
    id: "iterator",
    name: "Iterator",
    category: "behavioral",
    keywords: ["percorrer coleção", "sequencia", "abstração"],
    tagline: "Percorre coleção sem expor estrutura interna.",
    intent: "Fornece mecanismo padrão para iteração independente da representação da coleção.",
    whenToUse: [
      "Quando queres encapsular lógica de navegação.",
      "Quando a estrutura interna da coleção deve permanecer privada.",
      "Quando precisas de multiplas estratégias de percurso."
    ],
    benefits: [
      "Simplifica cliente ao abstrair iteração.",
      "Permite múltiplos iteradores para mesma coleção."
    ],
    tradeoffs: [
      "Pode duplicar funcionalidades ja existentes na linguagem.",
      "Iteradores inválidos em coleções mutaveis exigem cuidado."
    ],
    uml: `
classDiagram
  class NameRepository {
    +iterator() NameIterator
  }
  class NameIterator {
    - index : int
    +hasNext() boolean
    +next() String
  }
  NameRepository --> NameIterator
`,
    javaExample: `
class NameRepository {
    private final String[] names = {"Ana", "Bruno", "Carla"};

    NameIterator iterator() {
        return new NameIterator(names);
    }
}

class NameIterator {
    private final String[] names;
    private int index = 0;

    NameIterator(String[] names) {
        this.names = names;
    }

    boolean hasNext() {
        return index < names.length;
    }

    String next() {
        return names[index++];
    }
}
`
  },
  {
    id: "mediator",
    name: "Mediator",
    category: "behavioral",
    keywords: ["coordenação", "desacoplamento colegas", "chat"],
    tagline: "Centraliza comunicação entre objetos colegas.",
    intent: "Evita dependências diretas N para N entre componentes, delegando coordenação a um mediador.",
    whenToUse: [
      "Quando muitos objetos comunicam entre si de forma caótica.",
      "Quando queres simplificar regras de colaboração.",
      "Quando mudanças de interação sao frequentes."
    ],
    benefits: [
      "Reduz acoplamento entre colegas.",
      "Centraliza regras de interação."
    ],
    tradeoffs: [
      "Mediador pode crescer demasiado e concentrar lógica.",
      "Pode tornar dependências implícitas."
    ],
    uml: `
classDiagram
  class ChatMediator {
    <<interface>>
    +send(message, User)
  }
  class User
  ChatMediator --> User
`,
    javaExample: `
interface ChatMediator {
    void send(String message, User sender);
}

class User {
    private final String name;
    private final ChatMediator mediator;

    User(String name, ChatMediator mediator) {
        this.name = name;
        this.mediator = mediator;
    }

    void send(String message) { mediator.send(message, this); }
    void receive(String message) { System.out.println(name + " recebeu: " + message); }
}
`
  },
  {
    id: "memento",
    name: "Memento",
    category: "behavioral",
    keywords: ["snapshot", "undo", "estado"],
    tagline: "Guarda e restaura estado sem expor detalhes internos.",
    intent: "Captura snapshots de estado para rollback/undo mantendo encapsulamento do originator.",
    whenToUse: [
      "Quando precisas de undo em editores ou workflows.",
      "Quando estado interno não deve ser exposto externamente.",
      "Quando checkpoints temporais sao necessários."
    ],
    benefits: [
      "Permite recuperação de estado de forma segura.",
      "Mantem encapsulamento do objeto originador."
    ],
    tradeoffs: [
      "Pode consumir muita memória com muitos snapshots.",
      "Exige política de retenção no caretaker."
    ],
    uml: `
classDiagram
  class Editor {
    - state : String
    +save() Snapshot
    +restore(Snapshot snapshot)
  }
  class Snapshot {
    - state : String
  }
  Editor --> Snapshot
`,
    javaExample: `
class Editor {
    private String text = "";

    static class Snapshot {
        private final String text;
        Snapshot(String text) { this.text = text; }
    }

    Snapshot save() { return new Snapshot(text); }
    void restore(Snapshot snapshot) { this.text = snapshot.text; }
    void type(String value) { text += value; }
}
`
  },
  {
    id: "observer",
    name: "Observer",
    category: "behavioral",
    keywords: ["pubsub", "eventos", "notificacao"],
    tagline: "Define dependência um-para-muitos para notificacoes automáticas.",
    intent: "Quando subject muda de estado, todos os observers registados sao notificados.",
    whenToUse: [
      "Quando tens eventos assíncronos de domínio.",
      "Quando múltiplos consumidores reagem a mesma mudanca.",
      "Quando queres desacoplar emissor e subscritores."
    ],
    benefits: [
      "Promove arquitetura orientada a eventos.",
      "Permite adicionar novos listeners sem tocar no subject."
    ],
    tradeoffs: [
      "Notificacoes em cascata podem dificultar tracing.",
      "Gestao de subscrições deve evitar leaks."
    ],
    uml: `
classDiagram
  class Newsletter
  class Observer {
    <<interface>>
    +update(message)
  }
  class EmailSubscriber
  Newsletter --> Observer
  Observer <|.. EmailSubscriber
`,
    javaExample: `
interface Observer {
    void update(String message);
}

class Newsletter {
    private final java.util.List<Observer> observers = new java.util.ArrayList<>();
    void subscribe(Observer observer) { observers.add(observer); }
    void publish(String message) { observers.forEach(o -> o.update(message)); }
}

class EmailSubscriber implements Observer {
    public void update(String message) {
        System.out.println("Email: " + message);
    }
}
`
  },
  {
    id: "state",
    name: "State",
    category: "behavioral",
    keywords: ["estado interno", "transições", "fsm"],
    tagline: "Altera comportamento quando o estado interno muda.",
    intent: "Encapsula estados como objetos e delega comportamento com base no estado atual.",
    whenToUse: [
      "Quando ha muitos if/else por estado.",
      "Quando transições de estado sao explícitas e complexas.",
      "Quando regras por estado evoluem frequentemente."
    ],
    benefits: [
      "Elimina condicionais extensos no contexto.",
      "Modela transições de forma clara."
    ],
    tradeoffs: [
      "Mais classes para cada estado.",
      "Exige disciplina na definição de transições."
    ],
    uml: `
classDiagram
  class PlayerState {
    <<interface>>
    +clickPlay(PlayerContext)
  }
  class PlayingState
  class PausedState
  PlayerState <|.. PlayingState
  PlayerState <|.. PausedState
  class PlayerContext {
    - state : PlayerState
    +setState(PlayerState)
    +clickPlay()
  }
  PlayerContext --> PlayerState
`,
    javaExample: `
interface PlayerState {
    void clickPlay(PlayerContext context);
}

class PlayerContext {
    private PlayerState state = new PausedState();
    void setState(PlayerState state) { this.state = state; }
    void clickPlay() { state.clickPlay(this); }
}

class PlayingState implements PlayerState {
    public void clickPlay(PlayerContext context) {
        System.out.println("Pause");
        context.setState(new PausedState());
    }
}

class PausedState implements PlayerState {
    public void clickPlay(PlayerContext context) {
        System.out.println("Play");
        context.setState(new PlayingState());
    }
}
`
  },
  {
    id: "strategy",
    name: "Strategy",
    category: "behavioral",
    keywords: ["algoritmo", "substituivel", "runtime"],
    tagline: "Encapsula algoritmos e permite troca dinâmica.",
    intent: "Define família de algoritmos intercambiáveis para variar comportamento sem alterar contexto.",
    whenToUse: [
      "Quando tens múltiplos algoritmos para o mesmo problema.",
      "Quando queres eliminar condicionais de seleção de algoritmo.",
      "Quando queres configurar política em runtime."
    ],
    benefits: [
      "Flexibilidade para trocar lógica em execucao.",
      "Cumpre Open/Closed para novos algoritmos."
    ],
    tradeoffs: [
      "Cliente precisa conhecer estratégias disponiveis.",
      "Aumento de objetos e interfaces."
    ],
    uml: `
classDiagram
  class DiscountStrategy {
    <<interface>>
    +apply(total) double
  }
  class BlackFridayDiscount
  class LoyaltyDiscount
  DiscountStrategy <|.. BlackFridayDiscount
  DiscountStrategy <|.. LoyaltyDiscount
  class Checkout {
    - strategy : DiscountStrategy
    +close(total)
  }
  Checkout --> DiscountStrategy
`,
    javaExample: `
interface DiscountStrategy {
    double apply(double total);
}

class BlackFridayDiscount implements DiscountStrategy {
    public double apply(double total) { return total * 0.7; }
}

class LoyaltyDiscount implements DiscountStrategy {
    public double apply(double total) { return total * 0.9; }
}

class Checkout {
    private DiscountStrategy strategy;
    Checkout(DiscountStrategy strategy) { this.strategy = strategy; }
    double close(double total) { return strategy.apply(total); }
}
`
  },
  {
    id: "template-method",
    name: "Template Method",
    category: "behavioral",
    keywords: ["esqueleto algoritmo", "hooks", "passos"],
    tagline: "Define esqueleto de algoritmo e permite variar passos.",
    intent: "Move estrutura fixa do processo para classe base e delega passos variaveis a subclasses.",
    whenToUse: [
      "Quando multiplas classes repetem a mesma ordem de execucao.",
      "Quando só alguns passos mudam entre variantes.",
      "Quando queres hooks opcionais de extensao."
    ],
    benefits: [
      "Reutiliza fluxo comum e reduz duplicacao.",
      "Mantem invariantes do algoritmo."
    ],
    tradeoffs: [
      "Dependencia forte de herança.",
      "Mudancas no template impactam subclasses."
    ],
    uml: `
classDiagram
  class DataPipeline {
    <<abstract>>
    +run()
    #extract()
    #transform()
    #load()
  }
  class CsvPipeline
  DataPipeline <|-- CsvPipeline
`,
    javaExample: `
abstract class DataPipeline {
    public final void run() {
        extract();
        transform();
        load();
    }

    protected abstract void extract();
    protected abstract void transform();
    protected abstract void load();
}

class CsvPipeline extends DataPipeline {
    protected void extract() { System.out.println("Read CSV"); }
    protected void transform() { System.out.println("Clean data"); }
    protected void load() { System.out.println("Write DB"); }
}
`
  },
  {
    id: "visitor",
    name: "Visitor",
    category: "behavioral",
    keywords: ["operações externas", "duplo dispatch", "estrutura fixa"],
    tagline: "Separa operações da estrutura de objetos sobre a qual atuam.",
    intent: "Adiciona novas operações sem alterar classes dos elementos visitados.",
    whenToUse: [
      "Quando tens estrutura estavel e operações variaveis.",
      "Quando queres evitar poluir elementos com multiplas responsabilidades.",
      "Quando precisas de double dispatch."
    ],
    benefits: [
      "Novas operações sem alterar elementos.",
      "Agrupa lógica por operação (ex: export, validação)."
    ],
    tradeoffs: [
      "Adicionar novo tipo de elemento obriga atualizar todos os visitors.",
      "Pode aumentar complexidade conceptual."
    ],
    uml: `
classDiagram
  class ShapeVisitor {
    <<interface>>
    +visitCircle(Circle)
    +visitRectangle(Rectangle)
  }
  class Shape {
    <<interface>>
    +accept(ShapeVisitor)
  }
  class Circle
  class Rectangle
  Shape <|.. Circle
  Shape <|.. Rectangle
  Circle --> ShapeVisitor : accept()
  Rectangle --> ShapeVisitor : accept()
`,
    javaExample: `
interface Shape {
    void accept(ShapeVisitor visitor);
}

class Circle implements Shape {
    public void accept(ShapeVisitor visitor) { visitor.visit(this); }
}

class Rectangle implements Shape {
    public void accept(ShapeVisitor visitor) { visitor.visit(this); }
}

interface ShapeVisitor {
    void visit(Circle circle);
    void visit(Rectangle rectangle);
}
`
  }
];

const CATEGORY_LABELS = {
  creational: "Criacional",
  structural: "Estrutural",
  behavioral: "Comportamental"
};

const UML_JAVA_MAP = {
  "singleton": [
    { uml: "AppConfig", java: "AppConfig", reason: "Classe principal do padrão singleton." },
    { uml: "getInstance()", java: "getInstance()", reason: "Ponto de acesso unico a instância." }
  ],
  "factory-method": [
    { uml: "Report", java: "Report", reason: "Abstração de produto no método fábrica." },
    { uml: "ReportCreator", java: "ReportCreator", reason: "Criador abstrato alinhado." },
    { uml: "PdfReport", java: "PdfReport", reason: "Produto concreto alinhado." },
    { uml: "PdfCreator", java: "PdfCreator", reason: "Factory concreta alinhada." },
    { uml: "HtmlCreator", java: "HtmlCreator", reason: "Factory concreta adicional alinhada." }
  ],
  "abstract-factory": [
    { uml: "GUIFactory", java: "GUIFactory", reason: "Fabrica abstrata de componentes UI." },
    { uml: "WindowsFactory", java: "WindowsFactory", reason: "Fabrica concreta Windows." },
    { uml: "MacFactory", java: "MacFactory", reason: "Fabrica concreta Mac." },
    { uml: "Button", java: "Button", reason: "Produto abstrato botao." },
    { uml: "Checkbox", java: "Checkbox", reason: "Produto abstrato checkbox." }
  ],
  "builder": [
    { uml: "Computer", java: "Computer", reason: "Produto final construido." },
    { uml: "Builder", java: "Builder", reason: "Builder concreto usado pelo produto." },
    { uml: "build()", java: "build()", reason: "Passo final de construção presente em ambos." }
  ],
  "prototype": [
    { uml: "Prototype", java: "Prototype", reason: "Contrato de clonagem/alteracao." },
    { uml: "Enemy", java: "Enemy", reason: "Implementação concreta do prototipo." },
    { uml: "copy()", java: "copy()", reason: "Operacao de copia identica no UML e no Java." }
  ],
  "adapter": [
    { uml: "PaymentGateway", java: "PaymentGateway", reason: "Interface esperada pelo cliente." },
    { uml: "LegacyGateway", java: "LegacyGateway", reason: "Servico legado adaptado." },
    { uml: "LegacyGatewayAdapter", java: "LegacyGatewayAdapter", reason: "Adaptador concreto." }
  ],
  "bridge": [
    { uml: "Device", java: "Device", reason: "Implementador da bridge." },
    { uml: "RemoteControl", java: "RemoteControl", reason: "Abstração que usa o implementador." },
    { uml: "Tv", java: "Tv", reason: "Implementação concreta de dispositivo." }
  ],
  "composite": [
    { uml: "Node", java: "Node", reason: "Interface comum da árvore." },
    { uml: "FileNode", java: "FileNode", reason: "Elemento folha." },
    { uml: "FolderNode", java: "FolderNode", reason: "Elemento composto." }
  ],
  "decorator": [
    { uml: "Coffee", java: "Coffee", reason: "Componente base decoravel." },
    { uml: "CoffeeDecorator", java: "CoffeeDecorator", reason: "Decorator abstrato alinhado." },
    { uml: "Espresso", java: "Espresso", reason: "Componente concreto base." },
    { uml: "MilkDecorator", java: "MilkDecorator", reason: "Decorator concreto aplicado." },
    { uml: "CaramelDecorator", java: "CaramelDecorator", reason: "Decorator concreto adicional." }
  ],
  "facade": [
    { uml: "OrderFacade", java: "OrderFacade", reason: "Facade principal de orquestracao." },
    { uml: "InventoryService", java: "InventoryService", reason: "Subsystem de inventario." },
    { uml: "PaymentService", java: "PaymentService", reason: "Subsystem de pagamento." },
    { uml: "ShippingService", java: "ShippingService", reason: "Subsystem de envio." }
  ],
  "flyweight": [
    { uml: "Flyweight", java: "Flyweight", reason: "Contrato flyweight partilhado." },
    { uml: "TreeType", java: "TreeType", reason: "Estado intrínseco partilhado." },
    { uml: "TreeTypeFactory", java: "TreeTypeFactory", reason: "Factory/cache de flyweights." }
  ],
  "proxy": [
    { uml: "ImageService", java: "ImageService", reason: "Contrato público partilhado." },
    { uml: "RealImageService", java: "RealImageService", reason: "Servico real encapsulado." },
    { uml: "CachingImageProxy", java: "CachingImageProxy", reason: "Proxy concreto com cache." }
  ],
  "chain-of-responsibility": [
    { uml: "Handler", java: "Handler", reason: "Contrato base da cadeia." },
    { uml: "setNext(Handler next)", java: "setNext(Handler next)", reason: "Ligacao explicita entre handlers." },
    { uml: "handle(String request)", java: "handle(String request)", reason: "Processamento encadeado do pedido." }
  ],
  "command": [
    { uml: "Command", java: "Command", reason: "Contrato de comando alinhado." },
    { uml: "Light", java: "Light", reason: "Receiver do comando concreto." },
    { uml: "LightOnCommand", java: "LightOnCommand", reason: "Comando concreto equivalente." },
    { uml: "RemoteControl", java: "RemoteControl", reason: "Invocador desacoplado do receiver." }
  ],
  "interpreter": [
    { uml: "Expression", java: "Expression", reason: "Abstração base de expressao." },
    { uml: "NumberExpression", java: "NumberExpression", reason: "Terminal expression alinhada." },
    { uml: "AddExpression", java: "AddExpression", reason: "Non-terminal expression alinhada." }
  ],
  "iterator": [
    { uml: "NameRepository", java: "NameRepository", reason: "Colecao agregada no exemplo." },
    { uml: "NameIterator", java: "NameIterator", reason: "Iterador concreto da coleção." },
    { uml: "hasNext()", java: "hasNext()", reason: "Operacao de verificação de próximo item." },
    { uml: "next()", java: "next()", reason: "Operacao para obter próximo item." },
    { uml: "iterator()", java: "iterator()", reason: "Metodo fábrica de iterador da coleção." },
    { uml: "index", java: "index", reason: "Cursor interno do iterador." },
    { uml: "NameRepository", java: "NameRepository", reason: "Colecao concreta do diagrama e codigo." }
  ],
  "mediator": [
    { uml: "ChatMediator", java: "ChatMediator", reason: "Contrato do mediador." },
    { uml: "User", java: "User", reason: "Participante concreto da comunicação." }
  ],
  "memento": [
    { uml: "Editor", java: "Editor", reason: "Objeto que salva e restaura estado." },
    { uml: "Snapshot", java: "Snapshot", reason: "Objeto snapshot interno do estado." },
    { uml: "save()", java: "save()", reason: "Criação do memento alinhada." },
    { uml: "restore(Snapshot snapshot)", java: "restore(Snapshot snapshot)", reason: "Restauro do estado por snapshot." }
  ],
  "observer": [
    { uml: "Newsletter", java: "Newsletter", reason: "Publisher do estado/notificacao." },
    { uml: "Observer", java: "Observer", reason: "Interface de subscricao alinhada." },
    { uml: "EmailSubscriber", java: "EmailSubscriber", reason: "Cliente observador concreto no exemplo." }
  ],
  "state": [
    { uml: "PlayerState", java: "PlayerState", reason: "Interface de estado equivalente." },
    { uml: "PlayerContext", java: "PlayerContext", reason: "Contexto com estado atual." },
    { uml: "PlayingState", java: "PlayingState", reason: "Estado concreto alinhado." },
    { uml: "PausedState", java: "PausedState", reason: "Estado concreto alinhado." }
  ],
  "strategy": [
    { uml: "DiscountStrategy", java: "DiscountStrategy", reason: "Interface de estrategia aplicada ao domínio." },
    { uml: "BlackFridayDiscount", java: "BlackFridayDiscount", reason: "Algoritmo concreto 1 do contexto." },
    { uml: "LoyaltyDiscount", java: "LoyaltyDiscount", reason: "Algoritmo concreto 2 do contexto." },
    { uml: "Checkout", java: "Checkout", reason: "Contexto que delega na estrategia." }
  ],
  "template-method": [
    { uml: "DataPipeline", java: "DataPipeline", reason: "Template base do algoritmo." },
    { uml: "run()", java: "run()", reason: "Metodo template alinhado." },
    { uml: "CsvPipeline", java: "CsvPipeline", reason: "Implementação concreta alinhada." }
  ],
  "visitor": [
    { uml: "ShapeVisitor", java: "ShapeVisitor", reason: "Contrato de visita no codigo Java." },
    { uml: "Shape", java: "Shape", reason: "Elemento visitável do domínio." },
    { uml: "Circle", java: "Circle", reason: "Elemento concreto alinhado." },
    { uml: "Rectangle", java: "Rectangle", reason: "Elemento concreto alinhado." }
  ]
};

const STORAGE_KEY = "gof-studio-completed-v1";
const SEEN_STORAGE_KEY = "gof-studio-seen-v1";

const state = {
  selectedCategory: "all",
  search: "",
  selectedPatternId: patterns[0].id,
  completed: new Set(),
  seen: new Set(),
  currentQuiz: null
};

const elements = {
  searchInput: document.getElementById("searchInput"),
  patternList: document.getElementById("patternList"),
  filterButtons: Array.from(document.querySelectorAll(".filter-btn")),
  progressText: document.getElementById("progressText"),
  progressFill: document.getElementById("progressFill"),
  statCategoryCount: document.getElementById("statCategoryCount"),
  statCompleted: document.getElementById("statCompleted"),
  patternCategoryLabel: document.getElementById("patternCategoryLabel"),
  patternTitle: document.getElementById("patternTitle"),
  patternTagline: document.getElementById("patternTagline"),
  patternIntent: document.getElementById("patternIntent"),
  whenToUseList: document.getElementById("whenToUseList"),
  benefitsList: document.getElementById("benefitsList"),
  tradeoffsList: document.getElementById("tradeoffsList"),
  javaCode: document.getElementById("javaCode"),
  umlContainer: document.getElementById("umlContainer"),
  rigorBadge: document.getElementById("rigorBadge"),
  mappingTableBody: document.getElementById("mappingTableBody"),
  markComplete: document.getElementById("markComplete"),
  copyCodeBtn: document.getElementById("copyCodeBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  quizQuestion: document.getElementById("quizQuestion"),
  quizOptions: document.getElementById("quizOptions"),
  quizFeedback: document.getElementById("quizFeedback"),
  newQuizBtn: document.getElementById("newQuizBtn")
};

if (typeof mermaid !== "undefined") {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "base",
    themeVariables: {
      primaryColor: "#d9f2ec",
      primaryTextColor: "#203240",
      primaryBorderColor: "#0f766e",
      lineColor: "#2f4c5e",
      secondaryColor: "#fff5e6",
      tertiaryColor: "#ecf5ff",
      fontFamily: "Manrope"
    }
  });
}

bootstrap();

function bootstrap() {
  loadProgress();
  bindEvents();
  renderAll();
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    const filtered = getFilteredPatterns();
    if (!filtered.some((pattern) => pattern.id === state.selectedPatternId)) {
      state.selectedPatternId = filtered.length ? filtered[0].id : "";
    }
    renderAll();
  });

  elements.filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCategory = button.dataset.category;
      const filtered = getFilteredPatterns();
      if (!filtered.some((pattern) => pattern.id === state.selectedPatternId)) {
        state.selectedPatternId = filtered.length ? filtered[0].id : "";
      }
      renderAll();
    });
  });

  elements.markComplete.addEventListener("change", (event) => {
    const selected = getSelectedPattern();
    if (!selected) return;

    if (event.target.checked) {
      state.completed.add(selected.id);
    } else {
      state.completed.delete(selected.id);
    }

    saveProgress();
    renderProgress();
    renderPatternList();
  });

  elements.copyCodeBtn.addEventListener("click", async () => {
    const selected = getSelectedPattern();
    if (!selected) return;

    try {
      await navigator.clipboard.writeText(selected.javaExample.trim());
      const previousText = elements.copyCodeBtn.textContent;
      elements.copyCodeBtn.textContent = "Copiado";
      setTimeout(() => {
        elements.copyCodeBtn.textContent = previousText;
      }, 1200);
    } catch {
      const previousText = elements.copyCodeBtn.textContent;
      elements.copyCodeBtn.textContent = "Falhou";
      setTimeout(() => {
        elements.copyCodeBtn.textContent = previousText;
      }, 1200);
    }
  });

  elements.prevBtn.addEventListener("click", () => navigatePattern(-1));
  elements.nextBtn.addEventListener("click", () => navigatePattern(1));
  elements.newQuizBtn.addEventListener("click", () => buildQuiz());
}

function renderAll() {
  updateFilterButtons();
  renderPatternList();
  renderProgress();
  renderPatternDetail();
  renderQuizIfNeeded();
}

function updateFilterButtons() {
  elements.filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.category === state.selectedCategory);
  });
}

function getFilteredPatterns() {
  return patterns.filter((pattern) => {
    const categoryMatch = state.selectedCategory === "all" || pattern.category === state.selectedCategory;
    const searchable = `${pattern.name} ${pattern.tagline} ${pattern.intent} ${pattern.keywords.join(" ")}`.toLowerCase();
    const textMatch = !state.search || searchable.includes(state.search);
    return categoryMatch && textMatch;
  });
}

function getSelectedPattern() {
  return patterns.find((pattern) => pattern.id === state.selectedPatternId) || null;
}

function renderPatternList() {
  const filtered = getFilteredPatterns();
  elements.statCategoryCount.textContent = String(filtered.length);

  if (!filtered.length) {
    elements.patternList.innerHTML = `<li class="empty-state">Sem resultados para este filtro/pesquisa.</li>`;
    return;
  }

  elements.patternList.innerHTML = filtered
    .map((pattern) => {
      const isActive = pattern.id === state.selectedPatternId;
      const isCompleted = state.completed.has(pattern.id);
      return `
        <li class="pattern-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}" data-id="${pattern.id}" tabindex="0" role="button" aria-label="${pattern.name}">
          <h4>${pattern.name}</h4>
          <p>${CATEGORY_LABELS[pattern.category]}  -  ${pattern.tagline}</p>
        </li>
      `;
    })
    .join("");

  elements.patternList.querySelectorAll(".pattern-item").forEach((item) => {
    item.addEventListener("click", () => {
      state.selectedPatternId = item.dataset.id;
      renderPatternList();
      renderPatternDetail();
    });

    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        state.selectedPatternId = item.dataset.id;
        renderPatternList();
        renderPatternDetail();
      }
    });
  });
}

function renderProgress() {
  const completed = state.completed.size;
  elements.statCompleted.textContent = String(completed);
  elements.progressText.textContent = `${completed} de ${patterns.length} concluídos`;
  const percent = (completed / patterns.length) * 100;
  elements.progressFill.style.width = `${percent}%`;
}

function renderPatternDetail() {
  const filtered = getFilteredPatterns();
  if (!filtered.length) {
    setDetailPlaceholder();
    return;
  }

  if (!filtered.some((pattern) => pattern.id === state.selectedPatternId)) {
    state.selectedPatternId = filtered[0].id;
  }

  const pattern = getSelectedPattern();
  if (!pattern) return;
  markPatternSeen(pattern.id);

  elements.patternCategoryLabel.textContent = CATEGORY_LABELS[pattern.category];
  elements.patternTitle.textContent = pattern.name;
  elements.patternTagline.textContent = pattern.tagline;
  elements.patternIntent.textContent = pattern.intent;
  elements.javaCode.textContent = pattern.javaExample.trim();
  elements.markComplete.checked = state.completed.has(pattern.id);

  setList(elements.whenToUseList, pattern.whenToUse);
  setList(elements.benefitsList, pattern.benefits);
  setList(elements.tradeoffsList, pattern.tradeoffs);
  renderUml(pattern.uml);
  renderMapping(pattern);
  updateNavButtons(filtered, pattern.id);

  elements.patternTitle.classList.remove("fade-in");
  elements.patternTitle.offsetWidth;
  elements.patternTitle.classList.add("fade-in");
  renderQuizIfNeeded();
}

function setDetailPlaceholder() {
  elements.patternCategoryLabel.textContent = "Categoria";
  elements.patternTitle.textContent = "Nenhum padrão encontrado";
  elements.patternTagline.textContent = "Ajusta os filtros ou a pesquisa para continuar.";
  elements.patternIntent.textContent = "Sem padrão selecionado.";
  elements.whenToUseList.innerHTML = "";
  elements.benefitsList.innerHTML = "";
  elements.tradeoffsList.innerHTML = "";
  elements.javaCode.textContent = "";
  elements.umlContainer.innerHTML = `<p class="uml-fallback">Sem diagrama para apresentar.</p>`;
  elements.rigorBadge.textContent = "Sem validação";
  elements.rigorBadge.classList.remove("ok", "warn");
  elements.mappingTableBody.innerHTML = `<tr><td colspan="4">Sem dados de conformidade.</td></tr>`;
  elements.markComplete.checked = false;
  elements.prevBtn.disabled = true;
  elements.nextBtn.disabled = true;
}

function updateNavButtons(filtered, currentId) {
  const index = filtered.findIndex((pattern) => pattern.id === currentId);
  elements.prevBtn.disabled = index <= 0;
  elements.nextBtn.disabled = index === -1 || index >= filtered.length - 1;
}

function navigatePattern(direction) {
  const filtered = getFilteredPatterns();
  if (!filtered.length) return;

  const currentIndex = filtered.findIndex((pattern) => pattern.id === state.selectedPatternId);
  if (currentIndex === -1) return;

  const newIndex = currentIndex + direction;
  if (newIndex < 0 || newIndex >= filtered.length) return;

  state.selectedPatternId = filtered[newIndex].id;
  renderPatternList();
  renderPatternDetail();
}

function setList(element, items) {
  element.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderMapping(pattern) {
  const mapping = UML_JAVA_MAP[pattern.id] || [];

  if (!mapping.length) {
    elements.rigorBadge.textContent = "Sem mapa definido";
    elements.rigorBadge.classList.remove("ok");
    elements.rigorBadge.classList.add("warn");
    elements.mappingTableBody.innerHTML = `<tr><td colspan="4">Não existe mapeamento para este padrão.</td></tr>`;
    return;
  }

  const results = mapping.map((entry) => {
    const umlFound = containsSymbol(pattern.uml, entry.uml);
    const javaFound = containsSymbol(pattern.javaExample, entry.java);
    return {
      ...entry,
      umlFound,
      javaFound,
      ok: umlFound && javaFound
    };
  });

  const okCount = results.filter((result) => result.ok).length;
  const total = results.length;
  const strictOk = okCount === total;

  elements.rigorBadge.textContent = `Conformidade ${okCount}/${total}`;
  elements.rigorBadge.classList.toggle("ok", strictOk);
  elements.rigorBadge.classList.toggle("warn", !strictOk);

  elements.mappingTableBody.innerHTML = results
    .map((result) => {
      const statusClass = result.ok ? "ok" : "fail";
      const statusText = result.ok ? "OK" : "Falha";
      return `
        <tr>
          <td><code>${escapeHtml(result.uml)}</code></td>
          <td><code>${escapeHtml(result.java)}</code></td>
          <td><span class="status-chip ${statusClass}">${statusText}</span></td>
          <td>${escapeHtml(result.reason)}</td>
        </tr>
      `;
    })
    .join("");
}

function containsSymbol(text, symbol) {
  if (!text || !symbol) return false;

  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(symbol)) {
    const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const tokenRegex = new RegExp(`\\b${escaped}\\b`);
    return tokenRegex.test(text);
  }

  return text.includes(symbol);
}

async function renderUml(umlDefinition) {
  elements.umlContainer.innerHTML = "";

  if (typeof mermaid === "undefined") {
    elements.umlContainer.innerHTML = `<pre class="uml-fallback">${escapeHtml(umlDefinition.trim())}</pre>`;
    return;
  }

  const block = document.createElement("pre");
  block.className = "mermaid";
  block.textContent = umlDefinition.trim();
  elements.umlContainer.appendChild(block);

  try {
    await mermaid.run({ nodes: [block] });
  } catch {
    elements.umlContainer.innerHTML = `<pre class="uml-fallback">${escapeHtml(umlDefinition.trim())}</pre>`;
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        state.completed = new Set(parsed.filter((id) => patterns.some((pattern) => pattern.id === id)));
      }
    }
  } catch {
    state.completed = new Set();
  }

  try {
    const seenRaw = localStorage.getItem(SEEN_STORAGE_KEY);
    if (seenRaw) {
      const parsedSeen = JSON.parse(seenRaw);
      if (Array.isArray(parsedSeen)) {
        state.seen = new Set(parsedSeen.filter((id) => patterns.some((pattern) => pattern.id === id)));
      }
    }
  } catch {
    state.seen = new Set();
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.completed]));
}

function saveSeen() {
  localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify([...state.seen]));
}

function markPatternSeen(patternId) {
  if (!patternId || state.seen.has(patternId)) return;
  state.seen.add(patternId);
  saveSeen();
}

function renderQuizIfNeeded() {
  const selected = getSelectedPattern();
  if (!selected) return;

  if (!state.currentQuiz || state.currentQuiz.patternId !== selected.id) {
    buildQuiz();
  }
}

function buildQuiz() {
  const selected = getSelectedPattern();
  if (!selected) return;

  markPatternSeen(selected.id);
  const studiedIds = new Set([...state.completed, selected.id]);
  const studiedPatterns = patterns.filter((pattern) => studiedIds.has(pattern.id));
  const otherStudied = studiedPatterns.filter((pattern) => pattern.id !== selected.id);

  if (otherStudied.length >= 3) {
    buildComparativeQuiz(selected, otherStudied);
    return;
  }

  buildFocusedQuiz(selected, otherStudied);
}

function buildComparativeQuiz(selected, otherStudied) {
  const distractors = shuffle(otherStudied).slice(0, 3);
  const cluePool = [...selected.whenToUse, selected.intent];
  const clue = cluePool[Math.floor(Math.random() * cluePool.length)];
  const options = shuffle([selected, ...distractors]).map((pattern) => ({
    value: pattern.id,
    label: pattern.name
  }));

  state.currentQuiz = {
    patternId: selected.id,
    mode: "comparative",
    correctValue: selected.id,
    explanation: `${selected.name} é o melhor encaixe porque ${selected.intent.toLowerCase()}.`
  };

  elements.quizQuestion.textContent = `Num cenário em que ${lowerFirst(clue)}, que padrão escolherias?`;
  renderQuizOptions(options);
}

function buildFocusedQuiz(selected, otherStudied) {
  const quizTypes = ["intent", "category", "tradeoff", "usage"];
  const type = quizTypes[Math.floor(Math.random() * quizTypes.length)];
  const fallbackDistractors = [
    "Porque queres aumentar o acoplamento entre módulos.",
    "Porque queres evitar encapsular comportamentos.",
    "Porque pretendes remover qualquer tipo de abstração.",
    "Porque preferes condicional rígido em vez de composição."
  ];

  let question = "";
  let correctLabel = "";
  let distractors = [];
  let explanation = "";

  if (type === "category") {
    const categories = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));
    const options = shuffle(categories).map((item) => ({
      value: item.value,
      label: item.label
    }));

    state.currentQuiz = {
      patternId: selected.id,
      mode: "focused-category",
      correctValue: selected.category,
      explanation: `${selected.name} pertence à categoria ${CATEGORY_LABELS[selected.category]}.`
    };

    elements.quizQuestion.textContent = `Em termos GoF, a que família pertence o padrão ${selected.name}?`;
    renderQuizOptions(options);
    return;
  }

  if (type === "intent") {
    question = `Qual frase descreve melhor a intenção central de ${selected.name}?`;
    correctLabel = selected.intent;
    distractors = [
      ...otherStudied.map((pattern) => pattern.intent),
      ...selected.whenToUse,
      ...selected.benefits,
      ...selected.tradeoffs
    ];
    explanation = `A intenção central de ${selected.name} é: ${selected.intent}`;
  } else if (type === "tradeoff") {
    const tradeoff = selected.tradeoffs[Math.floor(Math.random() * selected.tradeoffs.length)];
    question = `Qual é um trade-off real ao aplicar ${selected.name}?`;
    correctLabel = tradeoff;
    distractors = [
      ...selected.benefits,
      ...otherStudied.flatMap((pattern) => pattern.benefits),
      ...otherStudied.flatMap((pattern) => pattern.whenToUse),
      ...fallbackDistractors
    ];
    explanation = `Trade-off típico de ${selected.name}: ${tradeoff}`;
  } else {
    const usage = selected.whenToUse[Math.floor(Math.random() * selected.whenToUse.length)];
    question = `Em que situação ${selected.name} é mais apropriado?`;
    correctLabel = usage;
    distractors = [
      ...otherStudied.flatMap((pattern) => pattern.whenToUse),
      ...selected.benefits,
      ...selected.tradeoffs,
      ...fallbackDistractors
    ];
    explanation = `Situação recomendada para ${selected.name}: ${usage}`;
  }

  const uniqueDistractors = uniqueStrings(distractors).filter((item) => item !== correctLabel);
  const optionLabels = shuffle([correctLabel, ...uniqueDistractors.slice(0, 3)]);
  while (optionLabels.length < 4) {
    const extra = fallbackDistractors.find((item) => !optionLabels.includes(item));
    if (!extra) break;
    optionLabels.push(extra);
  }

  const options = optionLabels.map((label, index) => ({
    value: `opt-${index}`,
    label
  }));
  const correctOption = options.find((option) => option.label === correctLabel);

  state.currentQuiz = {
    patternId: selected.id,
    mode: `focused-${type}`,
    correctValue: correctOption ? correctOption.value : options[0].value,
    explanation
  };

  elements.quizQuestion.textContent = question;
  renderQuizOptions(options);
}

function renderQuizOptions(options) {
  elements.quizFeedback.textContent = "";
  elements.quizOptions.innerHTML = options
    .map((option) => `<button class="quiz-option" type="button" data-value="${option.value}">${escapeHtml(option.label)}</button>`)
    .join("");

  elements.quizOptions.querySelectorAll(".quiz-option").forEach((button) => {
    button.addEventListener("click", () => handleQuizAnswer(button.dataset.value));
  });
}

function handleQuizAnswer(answerValue) {
  if (!state.currentQuiz) return;

  const correctValue = state.currentQuiz.correctValue;
  const isCorrect = answerValue === correctValue;

  elements.quizOptions.querySelectorAll(".quiz-option").forEach((button) => {
    const value = button.dataset.value;
    button.disabled = true;
    if (value === correctValue) {
      button.classList.add("correct");
    } else if (value === answerValue) {
      button.classList.add("wrong");
    }
  });

  elements.quizFeedback.textContent = isCorrect
    ? `Correto. ${state.currentQuiz.explanation}`
    : `Quase. ${state.currentQuiz.explanation}`;
}

function lowerFirst(text) {
  if (!text) return "";
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function uniqueStrings(items) {
  const result = [];
  const seen = new Set();

  items.forEach((item) => {
    const normalized = String(item || "").trim();
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    result.push(normalized);
  });

  return result;
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
