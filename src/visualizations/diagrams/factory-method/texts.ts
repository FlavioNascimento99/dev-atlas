import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Factory Method: who knows whom',
  description:
    'The document exporter from the article, drawn as a simplified class diagram. Follow the arrows to see which classes each participant needs to know about.',
  svgTitle: 'Class diagram of the Factory Method pattern in a document exporter',
  svgDescription:
    'The client points to the abstract creator Exporter, which points to the Writer interface. PdfExporter and HtmlExporter extend Exporter; PdfWriter and HtmlWriter implement Writer. PdfExporter creates PdfWriter and HtmlExporter creates HtmlWriter.',
  stereotypes: {
    abstract: '«abstract» creator',
    interface: '«interface» product',
  },
  edges: {
    uses: 'depends on an abstraction',
    creates: 'creates a concrete product',
    inherits: 'extends or implements',
  },
  kinds: {
    abstraction: 'Abstraction',
    concrete: 'Concrete class',
  },
  explanation:
    'The client calls save() on an Exporter, and save() only touches its product through the Writer interface. Neither of them points to a concrete class. The only arrows that reach a concrete product leave a concrete creator: its createWriter() override decides what to instantiate. Supporting a new format adds one box to each column and changes nothing above them.',
}

const pt: typeof en = {
  title: 'Factory Method: quem conhece quem',
  description:
    'O exportador de documentos do artigo, desenhado como um diagrama de classes simplificado. Siga as setas para ver quais classes cada participante precisa conhecer.',
  svgTitle: 'Diagrama de classes do padrão Factory Method em um exportador de documentos',
  svgDescription:
    'O cliente aponta para o creator abstrato Exporter, que aponta para a interface Writer. PdfExporter e HtmlExporter estendem Exporter; PdfWriter e HtmlWriter implementam Writer. PdfExporter cria PdfWriter e HtmlExporter cria HtmlWriter.',
  stereotypes: {
    abstract: '«abstract» creator',
    interface: '«interface» produto',
  },
  edges: {
    uses: 'depende de uma abstração',
    creates: 'cria um produto concreto',
    inherits: 'estende ou implementa',
  },
  kinds: {
    abstraction: 'Abstração',
    concrete: 'Classe concreta',
  },
  explanation:
    'O cliente chama save() em um Exporter, e save() só mexe no produto pela interface Writer. Nenhum dos dois aponta para uma classe concreta. As únicas setas que chegam a um produto concreto saem de um creator concreto: é a sobrescrita de createWriter() dele que decide o que instanciar. Para suportar um formato novo, basta uma caixa a mais em cada coluna, sem mudar nada acima delas.',
}

export const texts: Record<Locale, typeof en> = { en, pt }
