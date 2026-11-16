import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Monolith and microservices, side by side',
  description:
    'The same four business capabilities of an online store, packaged in two ways. Compare what gets deployed together, where the data lives and how one part reaches another.',
  architectures: {
    monolith: 'Monolith',
    microservices: 'Microservices',
  },
  summary: 'Deploy units: {units} · Databases: {databases}',
  svgTitles: {
    monolith: 'Structure of a monolith',
    microservices: 'Structure of a microservices system',
  },
  svgDescriptions: {
    monolith:
      'One deploy unit contains the orders, payments, inventory and catalog modules. Orders calls payments and inventory in process. All modules share a single database.',
    microservices:
      'An edge gateway and four services, orders, payments, inventory and catalog, are separate deploy units. The gateway calls orders, and orders calls payments and inventory, all over the network. Each service has its own database.',
  },
  components: {
    orders: 'Orders',
    payments: 'Payments',
    inventory: 'Inventory',
    catalog: 'Catalog',
    gateway: 'Edge gateway',
  },
  database: 'DB',
  calls: {
    inProcess: 'in-process call',
    network: 'network call',
  },
  legend: {
    unit: 'Deploy unit',
    module: 'Module inside a unit',
    database: 'Database',
  },
  explanation:
    'In the monolith, the modules are released together, call each other inside one process and share one database. A single transaction can cover an order, its payment and its stock, but changing one module redeploys all of them. In microservices, each service is its own deploy unit with a private database. The same calls now cross the network, where they are slower and can fail, and no transaction spans them. In exchange, a service such as catalog can be released without touching the others.',
}

const pt: typeof en = {
  title: 'Monólito e microsserviços, lado a lado',
  description:
    'As mesmas quatro capacidades de negócio de uma loja online, empacotadas de dois jeitos. Compare o que vai para produção junto, onde ficam os dados e como uma parte alcança a outra.',
  architectures: {
    monolith: 'Monólito',
    microservices: 'Microsserviços',
  },
  summary: 'Unidades de deploy: {units} · Bancos de dados: {databases}',
  svgTitles: {
    monolith: 'Estrutura de um monólito',
    microservices: 'Estrutura de um sistema de microsserviços',
  },
  svgDescriptions: {
    monolith:
      'Uma única unidade de deploy contém os módulos de pedidos, pagamentos, estoque e catálogo. Pedidos chama pagamentos e estoque em processo. Todos os módulos compartilham um único banco de dados.',
    microservices:
      'Um gateway de borda e quatro serviços, pedidos, pagamentos, estoque e catálogo, são unidades de deploy separadas. O gateway chama pedidos, e pedidos chama pagamentos e estoque, sempre pela rede. Cada serviço tem o próprio banco de dados.',
  },
  components: {
    orders: 'Pedidos',
    payments: 'Pagamentos',
    inventory: 'Estoque',
    catalog: 'Catálogo',
    gateway: 'Gateway de borda',
  },
  database: 'BD',
  calls: {
    inProcess: 'chamada em processo',
    network: 'chamada de rede',
  },
  legend: {
    unit: 'Unidade de deploy',
    module: 'Módulo dentro de uma unidade',
    database: 'Banco de dados',
  },
  explanation:
    'No monólito, os módulos são implantados juntos, chamam uns aos outros dentro de um único processo e compartilham um banco de dados. Uma só transação cobre um pedido, o pagamento e o estoque, mas mudar um módulo reimplanta todos. Nos microsserviços, cada serviço é a própria unidade de deploy, com um banco de dados privado. As mesmas chamadas agora atravessam a rede, onde são mais lentas e podem falhar, e nenhuma transação as abrange. Em troca, um serviço como o de catálogo pode ser implantado sem tocar nos demais.',
}

export const texts: Record<Locale, typeof en> = { en, pt }
