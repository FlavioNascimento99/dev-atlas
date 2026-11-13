import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Producers, queue and consumers',
  description:
    'A producer publishes messages into a bounded queue and consumers take them in order. Watch the queue when production outpaces consumption.',
  productionRate: 'Messages produced per tick',
  consumers: 'Consumers',
  processingTime: 'Processing time (ticks)',
  producer: 'Producer',
  queue: 'Queue ({length}/{capacity})',
  consumer: 'C{n}',
  history: 'Queue length over time',
  svgTitle: 'Message queue between a producer and consumers',
  svgDescription:
    'The producer on the left fills the queue in the middle; consumers on the right take messages and show their progress. A chart below tracks the queue length.',
  start: 'Producing {rate} per tick against a consumption capacity of {capacity} per tick.',
  moment: 'Tick {tick}: {consumed} consumed, {rejected} rejected, {queued} waiting.',
  trends: {
    growing: 'Production exceeds what the consumers can handle, so the queue keeps growing: backpressure is building.',
    full: 'The queue is full and new messages are rejected. Producers must slow down or more consumers are needed.',
    balanced: 'Production matches the consumption capacity, so the queue holds steady.',
    draining: 'Consumers keep up with production, so the queue stays short or drains.',
  },
}

const pt: typeof en = {
  title: 'Produtores, fila e consumidores',
  description:
    'Um produtor publica mensagens em uma fila limitada e os consumidores as retiram em ordem. Observe a fila quando a produção supera o consumo.',
  productionRate: 'Mensagens produzidas por tick',
  consumers: 'Consumidores',
  processingTime: 'Tempo de processamento (ticks)',
  producer: 'Produtor',
  queue: 'Fila ({length}/{capacity})',
  consumer: 'C{n}',
  history: 'Tamanho da fila ao longo do tempo',
  svgTitle: 'Fila de mensagens entre um produtor e consumidores',
  svgDescription:
    'O produtor à esquerda enche a fila no meio; os consumidores à direita retiram mensagens e mostram seu progresso. Um gráfico abaixo acompanha o tamanho da fila.',
  start: 'Produzindo {rate} por tick contra uma capacidade de consumo de {capacity} por tick.',
  moment: 'Tick {tick}: {consumed} consumidas, {rejected} rejeitadas, {queued} aguardando.',
  trends: {
    growing: 'A produção supera o que os consumidores conseguem processar, então a fila cresce: há backpressure se acumulando.',
    full: 'A fila está cheia e novas mensagens são rejeitadas. Os produtores precisam desacelerar ou são necessários mais consumidores.',
    balanced: 'A produção iguala a capacidade de consumo, então a fila se mantém estável.',
    draining: 'Os consumidores acompanham a produção, então a fila fica curta ou esvazia.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
