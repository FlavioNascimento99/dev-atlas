import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Load balancing strategies',
  description:
    'Requests arrive at the load balancer and are routed to servers. Each request keeps a connection open for a random time.',
  servers: 'Servers',
  rate: 'Requests per tick',
  strategy: 'Strategy',
  strategies: {
    'round-robin': 'Round-robin',
    'least-connections': 'Least connections',
    random: 'Random',
  },
  hints: {
    'round-robin': 'Round-robin cycles through the servers in order, ignoring how busy each one is.',
    'least-connections': 'Least connections sends each request to the server with the fewest active connections.',
    random: 'Random picks any server with equal probability; the load evens out only over many requests.',
  },
  balancer: 'Load balancer',
  server: 'S{n}',
  load: '{active} active · {handled} total',
  svgTitle: 'Load balancer routing requests to servers',
  svgDescription:
    'The load balancer on the left sends requests to the servers on the right. Each bar shows the active connections of a server.',
  start: 'Press Play or Step to route {rate} request(s) per tick.',
  moment: 'Tick {tick}: requests went to {targets}. Active connections per server range from {min} to {max}.',
}

const pt: typeof en = {
  title: 'Estratégias de balanceamento de carga',
  description:
    'Requisições chegam ao load balancer e são encaminhadas aos servidores. Cada requisição mantém uma conexão aberta por um tempo aleatório.',
  servers: 'Servidores',
  rate: 'Requisições por tick',
  strategy: 'Estratégia',
  strategies: {
    'round-robin': 'Round-robin',
    'least-connections': 'Menos conexões',
    random: 'Aleatória',
  },
  hints: {
    'round-robin': 'Round-robin percorre os servidores em ordem, sem considerar o quanto cada um está ocupado.',
    'least-connections': 'Menos conexões envia cada requisição ao servidor com menos conexões ativas.',
    random: 'Aleatória escolhe qualquer servidor com a mesma probabilidade; a carga só se equilibra com muitas requisições.',
  },
  balancer: 'Load balancer',
  server: 'S{n}',
  load: '{active} ativas · {handled} no total',
  svgTitle: 'Load balancer encaminhando requisições aos servidores',
  svgDescription:
    'O load balancer à esquerda envia requisições aos servidores à direita. Cada barra mostra as conexões ativas de um servidor.',
  start: 'Pressione Reproduzir ou Avançar para encaminhar {rate} requisição(ões) por tick.',
  moment: 'Tick {tick}: requisições foram para {targets}. As conexões ativas por servidor variam de {min} a {max}.',
}

export const texts: Record<Locale, typeof en> = { en, pt }
