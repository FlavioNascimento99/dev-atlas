import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Cache-aside reads with LRU eviction',
  description:
    'The application looks for each key in the cache first and only goes to the database on a miss. Like real traffic, some keys are much more popular than others.',
  capacity: 'Cache capacity',
  keys: 'Distinct keys',
  app: 'App',
  cache: 'Cache',
  database: 'Database',
  key: 'K{n}',
  mostRecent: 'most recent',
  leastRecent: 'least recent',
  svgTitle: 'Application reading keys through a cache backed by a database',
  svgDescription:
    'Reads travel from the application to the cache, and on to the database on a miss. Cache entries are ordered from most to least recently used.',
  start: 'The cache has room for {capacity} of the {keys} keys and starts empty, so the first reads have to go to the database.',
  hit: 'Read K{key}: cache hit. It comes straight from memory, with no trip to the database, and moves to the top as the most recently used entry.',
  miss: 'Read K{key}: cache miss. The application has to load it from the database, then keeps a copy in the cache for next time.',
  evicted: 'The cache was full, so something had to go: K{evicted}, the entry nobody had touched for the longest time, was evicted.',
  stats: 'Hits {hits} · Misses {misses} · Hit ratio {ratio}',
  hitLabel: 'hit',
  missLabel: 'miss',
}

const pt: typeof en = {
  title: 'Leituras cache-aside com evicção LRU',
  description:
    'A aplicação procura cada chave primeiro no cache e só vai ao banco de dados em caso de miss. Como no tráfego real, algumas chaves são bem mais populares que outras.',
  capacity: 'Capacidade do cache',
  keys: 'Chaves distintas',
  app: 'App',
  cache: 'Cache',
  database: 'Banco de dados',
  key: 'K{n}',
  mostRecent: 'mais recente',
  leastRecent: 'menos recente',
  svgTitle: 'Aplicação lendo chaves por meio de um cache apoiado em um banco de dados',
  svgDescription:
    'As leituras vão da aplicação ao cache e seguem até o banco de dados em caso de miss. As entradas do cache são ordenadas da mais à menos recentemente usada.',
  start: 'O cache tem espaço para {capacity} das {keys} chaves e começa vazio, então as primeiras leituras precisam ir ao banco de dados.',
  hit: 'Leitura de K{key}: cache hit. A chave vem direto da memória, sem ir ao banco de dados, e sobe para o topo como a entrada usada mais recentemente.',
  miss: 'Leitura de K{key}: cache miss. A aplicação precisa buscar a chave no banco de dados e guarda uma cópia no cache para a próxima vez.',
  evicted: 'O cache estava cheio, então alguém tinha que sair: K{evicted}, a entrada que ninguém usava havia mais tempo, foi removida.',
  stats: 'Hits {hits} · Misses {misses} · Taxa de acerto {ratio}',
  hitLabel: 'hit',
  missLabel: 'miss',
}

export const texts: Record<Locale, typeof en> = { en, pt }
