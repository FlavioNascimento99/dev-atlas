import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Recursive resolution of www.example.com',
  description:
    'The stub resolver of the operating system hands the question to a recursive resolver, which finds the answer by following the delegations from the root to the com servers and on to the authoritative servers of example.com.',
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
  startCold: 'Press Play or Step. Every cache is empty, so the recursive resolver will have to walk the tree from the root.',
  startWarm: 'Press Play or Step. The resolver has already resolved this name and the TTL of the record has not expired.',
  steps: {
    ask: 'The application asks the stub resolver for the address of www.example.com, and the stub sends the question to its recursive resolver, asking it to do the full lookup.',
    askRoot:
      'Nothing is cached, so the resolver starts at the top: it asks a root server, whose address it knows from the root hints.',
    rootReferral: 'The root does not know the answer, but refers the resolver to the name servers of com.',
    askTld: 'The resolver asks the same question to a com server.',
    tldReferral: 'The com server refers the resolver to the authoritative servers of example.com.',
    askAuthoritative: 'The resolver asks an authoritative server of example.com.',
    authoritativeAnswer: 'The authoritative server returns the A record with its TTL.',
    respond:
      'The resolver caches the record, and the referrals it learned along the way, and returns the answer to the stub resolver. Three round trips later, the application can open a connection to that IP address.',
    respondFromCache:
      'Cache hit: the record is still within its TTL, so the resolver answers from memory. The root, com and example.com servers were never contacted.',
  },
}

const pt: typeof en = {
  title: 'Resolução recursiva de www.example.com',
  description:
    'O stub resolver do sistema operacional entrega a pergunta a um resolver recursivo, que encontra a resposta seguindo as delegações da raiz aos servidores de com e, deles, aos servidores autoritativos de example.com.',
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
    'Pressione Reproduzir ou Avançar. Todos os caches estão vazios, então o resolver recursivo terá de percorrer a árvore a partir da raiz.',
  startWarm: 'Pressione Reproduzir ou Avançar. O resolver já resolveu este nome e o TTL do registro ainda não expirou.',
  steps: {
    ask: 'A aplicação pede ao stub resolver o endereço de www.example.com, e o stub envia a pergunta ao seu resolver recursivo, pedindo que ele faça a consulta completa.',
    askRoot:
      'Não há nada em cache, então o resolver começa pelo topo: pergunta a um servidor raiz, cujo endereço ele conhece pelos root hints.',
    rootReferral: 'A raiz não sabe a resposta, mas indica ao resolver os name servers de com.',
    askTld: 'O resolver faz a mesma pergunta a um servidor de com.',
    tldReferral: 'O servidor de com indica ao resolver os servidores autoritativos de example.com.',
    askAuthoritative: 'O resolver pergunta a um servidor autoritativo de example.com.',
    authoritativeAnswer: 'O servidor autoritativo devolve o registro A com o seu TTL.',
    respond:
      'O resolver guarda em cache o registro, e as referências que aprendeu pelo caminho, e devolve a resposta ao stub resolver. Três idas e voltas depois, a aplicação pode abrir uma conexão com esse endereço IP.',
    respondFromCache:
      'Cache hit: o registro ainda está dentro do TTL, então o resolver responde da memória. Os servidores da raiz, de com e de example.com nem foram contatados.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
