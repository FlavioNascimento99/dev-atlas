import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Recursive resolution of www.example.com',
  description:
    'Your operating system has a small helper, the stub resolver, that passes the question to a recursive resolver. The recursive resolver does the legwork: it follows the delegations from the root to the com servers, and on to the authoritative servers of example.com.',
  cache: 'Resolver cache',
  cold: 'Empty: first lookup',
  warm: 'Warm: second lookup within the TTL',
  svgTitle: 'Sequence of DNS messages to resolve www.example.com',
  svgDescription:
    'Five lifelines, left to right: stub resolver, recursive resolver, root server, com server and example.com authoritative server. Solid arrows are queries and dashed arrows are responses.',
  actors: {
    stub: 'Stub',
    resolver: 'Resolver',
    root: 'Root',
    tld: 'com',
    authoritative: 'example.com',
  },
  labels: {
    query: 'www.example.com A?',
    cacheMiss: 'cache miss',
    cacheHit: 'cache hit',
    referralTld: 'referral: com NS',
    referralAuthoritative: 'referral: example.com NS',
    answer: 'A 192.0.2.10 · TTL 3600',
    cached: 'stores in cache',
  },
  startCold: 'Press Play or Step. Every cache is empty, so the recursive resolver has to walk the tree from the root.',
  startWarm: 'Press Play or Step. The resolver looked up this name a moment ago, and the TTL of the record has not run out yet.',
  steps: {
    ask: 'The application needs the address of www.example.com. It asks the stub resolver, and the stub hands the question to its recursive resolver to do the full lookup.',
    askRoot:
      'Nothing is cached, so the resolver starts at the top. It asks a root server, whose address it already knows from the root hints.',
    rootReferral: 'The root does not have the answer, but it knows who is next: it refers the resolver to the name servers of com.',
    askTld: 'The resolver asks a com server the same question.',
    tldReferral: 'The com server does not have it either. It refers the resolver to the authoritative servers of example.com.',
    askAuthoritative: 'The resolver asks an authoritative server of example.com, the one that actually holds the record.',
    authoritativeAnswer: 'The authoritative server returns the A record, along with its TTL: how long it may be cached.',
    respond:
      'The resolver caches the record, plus the referrals it learned along the way, and returns the answer to the stub resolver. Three round trips later, the application can open a connection to that IP address.',
    respondFromCache:
      'Cache hit: the record is still within its TTL, so the resolver answers from memory. The root, com and example.com servers are never contacted.',
  },
}

const pt: typeof en = {
  title: 'Resolução recursiva de www.example.com',
  description:
    'O seu sistema operacional tem um pequeno ajudante, o stub resolver, que repassa a pergunta a um resolver recursivo. É o resolver recursivo que faz o trabalho pesado: ele segue as delegações da raiz aos servidores de com e, deles, aos servidores autoritativos de example.com.',
  cache: 'Cache do resolver',
  cold: 'Vazio: primeira consulta',
  warm: 'Aquecido: segunda consulta dentro do TTL',
  svgTitle: 'Sequência de mensagens DNS para resolver www.example.com',
  svgDescription:
    'Cinco linhas de vida, da esquerda para a direita: stub resolver, resolver recursivo, servidor raiz, servidor de com e servidor autoritativo de example.com. Setas contínuas são consultas e setas tracejadas são respostas.',
  actors: {
    stub: 'Stub',
    resolver: 'Resolver',
    root: 'Raiz',
    tld: 'com',
    authoritative: 'example.com',
  },
  labels: {
    query: 'www.example.com A?',
    cacheMiss: 'cache miss',
    cacheHit: 'cache hit',
    referralTld: 'referência: NS de com',
    referralAuthoritative: 'referência: NS de example.com',
    answer: 'A 192.0.2.10 · TTL 3600',
    cached: 'guarda em cache',
  },
  startCold:
    'Pressione Reproduzir ou Avançar. Todos os caches estão vazios, então o resolver recursivo vai ter de percorrer a árvore a partir da raiz.',
  startWarm: 'Pressione Reproduzir ou Avançar. O resolver consultou este nome há pouco, e o TTL do registro ainda não acabou.',
  steps: {
    ask: 'A aplicação precisa do endereço de www.example.com. Ela pergunta ao stub resolver, e o stub repassa a pergunta ao seu resolver recursivo para que ele faça a consulta completa.',
    askRoot:
      'Não há nada em cache, então o resolver começa pelo topo. Ele pergunta a um servidor raiz, cujo endereço já conhece pelos root hints.',
    rootReferral: 'A raiz não tem a resposta, mas sabe quem vem depois: indica ao resolver os name servers de com.',
    askTld: 'O resolver faz a mesma pergunta a um servidor de com.',
    tldReferral: 'O servidor de com também não tem a resposta. Ele indica ao resolver os servidores autoritativos de example.com.',
    askAuthoritative: 'O resolver pergunta a um servidor autoritativo de example.com, o que de fato guarda o registro.',
    authoritativeAnswer: 'O servidor autoritativo devolve o registro A junto com o seu TTL: por quanto tempo ele pode ficar em cache.',
    respond:
      'O resolver guarda em cache o registro, e também as referências que aprendeu pelo caminho, e devolve a resposta ao stub resolver. Três idas e voltas depois, a aplicação pode abrir uma conexão com esse endereço IP.',
    respondFromCache:
      'Cache hit: o registro ainda está dentro do TTL, então o resolver responde da memória. Os servidores da raiz, de com e de example.com nem são contatados.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
