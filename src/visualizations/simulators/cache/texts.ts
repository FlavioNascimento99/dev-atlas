import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Cache-aside reads with LRU eviction',
  description:
    'The application looks for each key in the cache first and only reads the database on a miss. Popular keys are read more often.',
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
  start: 'The cache holds {capacity} entries out of {keys} keys and starts empty.',
  hit: 'Read K{key}: cache hit. It is served from memory and becomes the most recently used entry.',
  miss: 'Read K{key}: cache miss. The application loads it from the database and stores it in the cache.',
  evicted: 'The cache was full, so K{evicted}, the least recently used entry, was evicted.',
  stats: 'Hits {hits} · Misses {misses} · Hit ratio {ratio}',
  hitLabel: 'hit',
  missLabel: 'miss',
}

const pt: typeof en = {
  title: 'Leituras cache-aside com evicção LRU',
  description:
    'A aplicação procura cada chave primeiro no cache e só lê o banco de dados em caso de miss. Chaves populares são lidas com mais frequência.',
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
  start: 'O cache comporta {capacity} entradas de {keys} chaves e começa vazio.',
  hit: 'Leitura de K{key}: cache hit. A chave é servida da memória e passa a ser a entrada mais recentemente usada.',
  miss: 'Leitura de K{key}: cache miss. A aplicação carrega a chave do banco de dados e a guarda no cache.',
  evicted: 'O cache estava cheio, então K{evicted}, a entrada menos recentemente usada, foi removida.',
  stats: 'Hits {hits} · Misses {misses} · Taxa de acerto {ratio}',
  hitLabel: 'hit',
  missLabel: 'miss',
}

export const texts: Record<Locale, typeof en> = { en, pt }
