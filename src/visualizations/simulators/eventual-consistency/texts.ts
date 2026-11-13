import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'One write through three replicas',
  description:
    'N = 3 replicas start with stock = 5. A write of stock = 4 is acknowledged once W replicas store it and reaches the others in the background. A read asks R replicas and keeps the newest version it receives; the reader shown here is always routed to the replicas that are furthest behind.',
  w: 'W: replicas that must acknowledge a write',
  r: 'R: replicas asked by a read',
  writer: 'Writer',
  reader: 'Reader',
  worstCase: 'worst case, R={r}',
  acksPending: '{have} of {w} acks',
  acked: 'acked (W={w})',
  readPending: 'write not acked',
  readStale: 'gets {value} · stale',
  readFresh: 'gets {value} · fresh',
  propagation: {
    inFlight: 'in flight',
    delivered: 'delivered',
    hintPending: 'hint pending',
    hintReplayed: 'hint replayed',
  },
  ackMark: 'W={w} ack',
  converged: 'converged',
  windowLabel: 'stale reads: {range}',
  noWindow: 'W+R > N: no stale reads',
  svgTitle: 'A write propagating through replicas A, B and C, and the timeline of what readers can see',
  svgDescription:
    'A writer sends the new value to replica A, which forwards it to B and C. A reader on the right asks R replicas. Below, a timeline from t0 to t5 marks when the write is acknowledged, the ticks at which a read can still return the old value, and when all replicas have converged.',
  legend: {
    old: 'old value (5)',
    fresh: 'new value (4)',
    window: 'stale read possible',
    converged: 'converged or fresh read',
  },
  ticks: [
    'All three replicas hold stock = 5. Press Play or Step to send the write.',
    'A client writes stock = 4. Replica A stores it and forwards the update in the background.',
    'B receives the update. C was unreachable when A forwarded it, so a hint is kept for C.',
    'C is still answering reads with stock = 5: its hint has not been replayed yet.',
    'The hint is replayed (read repair or anti-entropy would have the same effect). C now holds stock = 4: the replicas have converged.',
    'With no further writes, every replica returns the same value.',
  ],
  pending: 'The write is not acknowledged yet: {have} of the W = {w} replicas required have stored it.',
  stale:
    'The write is acknowledged (W = {w}), yet in the worst case a read with R = {r} is routed to {names} and still returns the old stock = 5. This is the inconsistency window.',
  fresh:
    'The write is acknowledged (W = {w}). Whichever replicas a read with R = {r} asks, at least one holds stock = 4, so it returns the new value.',
  overlap: 'W + R = {sum} > N = 3 · read and write sets always overlap',
  noOverlap: 'W + R = {sum} ≤ N = 3 · overlap is not guaranteed',
}

const pt: typeof en = {
  title: 'Uma escrita por três réplicas',
  description:
    'N = 3 réplicas começam com stock = 5. Uma escrita de stock = 4 é confirmada quando W réplicas a armazenam e chega às demais em segundo plano. Uma leitura consulta R réplicas e fica com a versão mais nova que receber; o leitor mostrado aqui é sempre roteado para as réplicas mais atrasadas.',
  w: 'W: réplicas que precisam confirmar uma escrita',
  r: 'R: réplicas consultadas por uma leitura',
  writer: 'Escritor',
  reader: 'Leitor',
  worstCase: 'pior caso, R={r}',
  acksPending: '{have} de {w} acks',
  acked: 'confirmada W={w}',
  readPending: 'escrita sem ack',
  readStale: 'lê {value} · antigo',
  readFresh: 'lê {value} · atual',
  propagation: {
    inFlight: 'a caminho',
    delivered: 'entregue',
    hintPending: 'hint pendente',
    hintReplayed: 'hint entregue',
  },
  ackMark: 'ack W={w}',
  converged: 'convergiu',
  windowLabel: 'leituras antigas: {range}',
  noWindow: 'W+R > N: sem leitura antiga',
  svgTitle: 'Uma escrita se propagando pelas réplicas A, B e C, e a linha do tempo do que os leitores podem ver',
  svgDescription:
    'Um escritor envia o novo valor à réplica A, que o repassa a B e C. Um leitor, à direita, consulta R réplicas. Abaixo, uma linha do tempo de t0 a t5 marca quando a escrita é confirmada, os instantes em que uma leitura ainda pode retornar o valor antigo e quando todas as réplicas convergiram.',
  legend: {
    old: 'valor antigo (5)',
    fresh: 'valor novo (4)',
    window: 'leitura antiga possível',
    converged: 'convergiu ou leitura atual',
  },
  ticks: [
    'As três réplicas guardam stock = 5. Pressione Reproduzir ou Avançar para enviar a escrita.',
    'Um cliente escreve stock = 4. A réplica A armazena o valor e repassa a atualização em segundo plano.',
    'B recebe a atualização. C estava inacessível quando A a repassou, então um hint é guardado para C.',
    'C continua respondendo leituras com stock = 5: o seu hint ainda não foi reproduzido.',
    'O hint é reproduzido (read repair ou anti-entropia teriam o mesmo efeito). C agora tem stock = 4: as réplicas convergiram.',
    'Sem novas escritas, toda réplica retorna o mesmo valor.',
  ],
  pending: 'A escrita ainda não foi confirmada: {have} das W = {w} réplicas exigidas a armazenaram.',
  stale:
    'A escrita está confirmada (W = {w}), mas, no pior caso, uma leitura com R = {r} é roteada para {names} e ainda retorna o antigo stock = 5. Esta é a janela de inconsistência.',
  fresh:
    'A escrita está confirmada (W = {w}). Quaisquer que sejam as réplicas consultadas por uma leitura com R = {r}, ao menos uma tem stock = 4, então ela retorna o valor novo.',
  overlap: 'W + R = {sum} > N = 3 · os conjuntos de leitura e de escrita sempre se sobrepõem',
  noOverlap: 'W + R = {sum} ≤ N = 3 · a sobreposição não é garantida',
}

export const texts: Record<Locale, typeof en> = { en, pt }
