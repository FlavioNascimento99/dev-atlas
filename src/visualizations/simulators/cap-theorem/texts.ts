import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'One partition, two designs',
  description:
    'Three replicas hold the value x. Client A talks to N1 and client B to N3, taking turns to write and read. Cut or restore the link to N3 and choose what a node does when it cannot reach a majority.',
  mode: 'Design',
  consistency: 'Consistency first (CP)',
  availability: 'Availability first (AP)',
  link: 'Link between N3 and the others',
  linkCut: 'Cut',
  linkConnected: 'Connected',
  client: 'Client {name}',
  idle: 'no request yet',
  majority: 'majority · 2 of 3',
  minority: 'minority · 1 of 3',
  minorityRefusing: 'minority · no quorum',
  healthy: 'network healthy',
  svgTitle: 'Three replicas, two clients and the network link between them',
  svgDescription:
    'Replicas N1 and N2 are on the left and N3 on the right, each showing its value of x. Client A sends requests to N1 and client B to N3. When the link is cut, N3 is isolated from the other two.',
  labels: {
    cut: 'N3 cut off from N1 and N2',
    writeReplicated: 'write x={value} · ok',
    writeCommitted: 'write x={value} · ok',
    writeTentative: 'write x={value} · local only',
    writeRejected: 'write x={value} · refused',
    readFresh: 'read x={value} · fresh',
    readStale: 'read x={value} · stale',
    readRejected: 'read · refused',
    healInSync: 'link restored: already in sync',
    healCaughtUp: 'link restored: all at x={value}',
    healReconciled: 'x={value} kept · x={dropped} dropped',
  },
  legend: {
    sameValue: 'same color = same value',
    accepted: 'accepted or fresh',
    local: 'stale or local only',
    refused: 'refused or link cut',
  },
  start:
    'The link between N3 and the other two replicas is cut. Press Play or Step to send requests, and restore the link whenever you want to see the recovery.',
  steps: {
    cut: 'The link is cut. N1 and N2 still form a majority. N3 is alone and cannot tell "the others have no new writes" from "the others have writes I cannot see".',
    writeReplicated:
      'Client {client} writes x = {value} to {node}. The network is healthy, so the write reaches all three replicas. Without a partition, both designs behave the same.',
    writeCommitted:
      'Client {client} writes x = {value} to {node}. N1 and N2 form a majority, so the write is accepted on that side. N3 cannot be told about it.',
    writeTentative:
      'Client {client} writes x = {value} to {node}. Availability first: {node} accepts the write locally and logs it for later reconciliation. The two sides now hold different values.',
    writeRejected:
      'Client {client} tries to write x = {value} to {node}. Consistency first: {node} cannot reach a majority, so it refuses the write. The client gets an error, but the replicas never accept conflicting writes.',
    readFresh: 'Client {client} reads from {node} and gets x = {value}, the most recent write.',
    readStale:
      'Client {client} reads from {node} and gets x = {value}. Availability first: {node} answers with the value it has, but a newer write exists on the other side. The answer is stale.',
    readRejected:
      'Client {client} reads from {node}. Consistency first: {node} cannot rule out a newer write on the other side, so it refuses to answer rather than risk a stale value.',
    healInSync: 'The link is back and no replica missed a write, so there is nothing to repair.',
    healCaughtUp:
      'The link is back. The replicas that were behind copy x = {value}. No conflicting write was accepted during the partition, so there is nothing to merge.',
    healReconciled:
      'The link is back and the two sides disagree. This lab resolves the conflict with last write wins: x = {value} is kept and x = {dropped}, a write its client saw succeed, is discarded. Availability during the partition is paid for now.',
  },
}

const pt: typeof en = {
  title: 'Uma partição, dois designs',
  description:
    'Três réplicas guardam o valor x. O cliente A fala com N1 e o cliente B com N3, alternando escritas e leituras. Corte ou restaure o link com N3 e escolha o que um nó faz quando não alcança a maioria.',
  mode: 'Design',
  consistency: 'Consistência primeiro (CP)',
  availability: 'Disponibilidade primeiro (AP)',
  link: 'Link entre N3 e os demais',
  linkCut: 'Cortado',
  linkConnected: 'Conectado',
  client: 'Cliente {name}',
  idle: 'sem requisição ainda',
  majority: 'maioria · 2 de 3',
  minority: 'minoria · 1 de 3',
  minorityRefusing: 'minoria · sem quórum',
  healthy: 'rede saudável',
  svgTitle: 'Três réplicas, dois clientes e o link de rede entre eles',
  svgDescription:
    'As réplicas N1 e N2 ficam à esquerda e N3 à direita, cada uma mostrando o seu valor de x. O cliente A envia requisições a N1 e o cliente B a N3. Quando o link é cortado, N3 fica isolado dos outros dois.',
  labels: {
    cut: 'N3 isolado de N1 e N2',
    writeReplicated: 'grava x={value} · ok',
    writeCommitted: 'grava x={value} · ok',
    writeTentative: 'grava x={value} · só local',
    writeRejected: 'grava x={value} · recusada',
    readFresh: 'lê x={value} · atual',
    readStale: 'lê x={value} · antigo',
    readRejected: 'lê · recusada',
    healInSync: 'link restaurado: já em sincronia',
    healCaughtUp: 'link restaurado: todos em x={value}',
    healReconciled: 'x={value} fica · x={dropped} descartado',
  },
  legend: {
    sameValue: 'mesma cor = mesmo valor',
    accepted: 'aceita ou atual',
    local: 'antigo ou só local',
    refused: 'recusada ou link cortado',
  },
  start:
    'O link entre N3 e as outras duas réplicas está cortado. Pressione Reproduzir ou Avançar para enviar requisições e restaure o link quando quiser ver a recuperação.',
  steps: {
    cut: 'O link foi cortado. N1 e N2 ainda formam maioria. N3 está sozinho e não consegue distinguir "os outros não têm escritas novas" de "os outros têm escritas que eu não vejo".',
    writeReplicated:
      'O cliente {client} escreve x = {value} em {node}. A rede está saudável, então a escrita chega às três réplicas. Sem partição, os dois designs se comportam da mesma forma.',
    writeCommitted:
      'O cliente {client} escreve x = {value} em {node}. N1 e N2 formam maioria, então a escrita é aceita nesse lado. N3 não tem como ser avisado.',
    writeTentative:
      'O cliente {client} escreve x = {value} em {node}. Disponibilidade primeiro: {node} aceita a escrita localmente e a registra para reconciliação posterior. Os dois lados agora guardam valores diferentes.',
    writeRejected:
      'O cliente {client} tenta escrever x = {value} em {node}. Consistência primeiro: {node} não alcança a maioria, então recusa a escrita. O cliente recebe um erro, mas as réplicas nunca aceitam escritas conflitantes.',
    readFresh: 'O cliente {client} lê de {node} e recebe x = {value}, a escrita mais recente.',
    readStale:
      'O cliente {client} lê de {node} e recebe x = {value}. Disponibilidade primeiro: {node} responde com o valor que possui, mas existe uma escrita mais nova no outro lado. A resposta está desatualizada.',
    readRejected:
      'O cliente {client} lê de {node}. Consistência primeiro: {node} não consegue descartar uma escrita mais nova no outro lado, então se recusa a responder em vez de arriscar um valor desatualizado.',
    healInSync: 'O link voltou e nenhuma réplica perdeu escritas, então não há nada a reparar.',
    healCaughtUp:
      'O link voltou. As réplicas que estavam atrasadas copiam x = {value}. Nenhuma escrita conflitante foi aceita durante a partição, então não há nada a mesclar.',
    healReconciled:
      'O link voltou e os dois lados discordam. Este laboratório resolve o conflito com last write wins: x = {value} é mantido e x = {dropped}, uma escrita que o cliente viu ser aceita, é descartado. A disponibilidade durante a partição é paga agora.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
