import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Producers, queue and consumers',
  description:
    'A producer publishes messages into a bounded queue, and consumers take them in order. Watch what happens to the queue when production outpaces consumption.',
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
    growing: 'Production is more than the consumers can handle, so the queue keeps growing. Backpressure is building.',
    full: 'The queue is full, so new messages are rejected. Either producers slow down or you need more consumers.',
    balanced: 'Production matches what the consumers can handle, so the queue holds steady.',
    draining: 'Consumers keep up with production, so the queue stays short or drains.',
  },
}

const pt: typeof en = {
  title: 'Produtores, fila e consumidores',
  description:
    'Um produtor publica mensagens em uma fila limitada, e os consumidores as retiram em ordem. Veja o que acontece com a fila quando a produção supera o consumo.',
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
    growing: 'A produção passa do que os consumidores conseguem processar, então a fila não para de crescer. O backpressure está se acumulando.',
    full: 'A fila está cheia, então novas mensagens são rejeitadas. Ou os produtores desaceleram, ou você precisa de mais consumidores.',
    balanced: 'A produção empata com o que os consumidores conseguem processar, então a fila fica estável.',
    draining: 'Os consumidores acompanham a produção, então a fila fica curta ou esvazia.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
