import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Three packets over TCP and over UDP',
  description:
    'A client sends a request split into three packets. Run the same exchange through each protocol, and try losing the second packet on the way. Packets are numbered 1 to 3 to keep things readable; real TCP numbers every byte.',
  protocol: 'Protocol',
  loss: 'Packet 2',
  arrives: 'Arrives',
  isLost: 'Is lost',
  svgTitle: 'Packets exchanged between a client and a server',
  svgDescription:
    'Two lifelines, client on the left and server on the right. Arrows are packets; a red arrow that stops halfway is a lost packet. Notes on the server show what reaches the application.',
  actors: {
    client: 'Client',
    server: 'Server',
  },
  labels: {
    syn: 'SYN',
    synAck: 'SYN-ACK',
    ack: 'ACK',
    data1: 'DATA 1',
    data2: 'DATA 2',
    data3: 'DATA 3',
    ack1: 'ACK 1',
    ack2: 'ACK 2',
    ack3: 'ACK 3',
    fin: 'FIN',
    finAck: 'FIN + ACK',
    deliver1: 'app ← 1',
    deliver2: 'app ← 2',
    deliver3: 'app ← 3',
    deliver23: 'app ← 2, 3',
    buffer3: '3 waits in the buffer',
    timeout: 'timeout',
  },
  delivered: 'Delivered to the application: {packets}',
  nothing: 'nothing yet',
  start: {
    tcp: 'Press Play or Step. TCP has to open a connection before the first byte of data can be sent.',
    udp: 'Press Play or Step. UDP has no connection to open: the first packet already carries data.',
  },
  steps: {
    syn: 'Three-way handshake, 1 of 3: the client asks to open a connection. Its SYN carries the initial sequence number it will use.',
    synAck: 'Handshake, 2 of 3: the server acknowledges the SYN and sends its own initial sequence number.',
    ack: 'Handshake, 3 of 3: the client acknowledges. A full round trip has gone by and no data has been sent yet.',
    data1: 'Segment 1 arrives in order, so TCP delivers it to the application.',
    ack1: 'The server acknowledges segment 1. Acknowledgments are cumulative: they confirm everything received up to that point.',
    data2: 'Segment 2 arrives in order and is delivered.',
    ack2: 'The server acknowledges everything up to segment 2.',
    data3: 'Segment 3 arrives in order and is delivered.',
    ack3: 'The server acknowledges everything up to segment 3. The sender knows the whole request arrived.',
    data2Lost: 'Segment 2 is lost on the way. IP is best-effort, and for now neither side knows it happened.',
    data3Buffered:
      'Segment 3 arrives, but segment 2, which comes before it, is missing. TCP holds 3 in the buffer and delivers nothing. This is head-of-line blocking.',
    duplicateAck: 'The server can only repeat its last acknowledgment: it still has everything up to segment 1 and nothing more.',
    retransmit:
      'No acknowledgment for segment 2 arrived in time, so the client retransmits it. The gap is filled and segments 2 and 3 are delivered in order.',
    ackAll: 'One cumulative acknowledgment confirms everything up to segment 3. The application never saw the loss. All it noticed was a delay.',
    fin: 'Teardown: the client has nothing else to send and closes its side with a FIN.',
    finAck: 'The server acknowledges it and sends its own FIN.',
    lastAck: 'The client acknowledges and the connection is closed. Every segment reached the application, in order.',
    udpData1: 'No handshake: the first datagram already carries data and is handed to the application as soon as it arrives.',
    udpData2: 'Datagram 2 arrives and is delivered. The server sends no acknowledgment.',
    udpData2Lost: 'Datagram 2 is lost on the way. With no acknowledgments, the sender never finds out.',
    udpData3: 'Datagram 3 arrives and is delivered. There is no teardown either: three packets instead of twelve.',
    udpData3AfterLoss:
      'Datagram 3 is delivered immediately, without waiting for 2. Nothing recovers the lost datagram unless the application detects and handles the gap.',
  },
}

const pt: typeof en = {
  title: 'Três pacotes por TCP e por UDP',
  description:
    'Um cliente envia uma requisição dividida em três pacotes. Rode a mesma troca em cada protocolo e experimente perder o segundo pacote no caminho. Os pacotes estão numerados de 1 a 3 para facilitar a leitura; o TCP de verdade numera cada byte.',
  protocol: 'Protocolo',
  loss: 'Pacote 2',
  arrives: 'Chega',
  isLost: 'Se perde',
  svgTitle: 'Pacotes trocados entre um cliente e um servidor',
  svgDescription:
    'Duas linhas de vida, o cliente à esquerda e o servidor à direita. As setas são pacotes; uma seta vermelha que para no meio é um pacote perdido. As notas no servidor mostram o que chega à aplicação.',
  actors: {
    client: 'Cliente',
    server: 'Servidor',
  },
  labels: {
    ...en.labels,
    buffer3: '3 espera no buffer',
  },
  delivered: 'Entregue à aplicação: {packets}',
  nothing: 'nada ainda',
  start: {
    tcp: 'Pressione Reproduzir ou Avançar. O TCP precisa abrir uma conexão antes de enviar o primeiro byte de dados.',
    udp: 'Pressione Reproduzir ou Avançar. O UDP não tem conexão para abrir: o primeiro pacote já carrega dados.',
  },
  steps: {
    syn: 'Three-way handshake, 1 de 3: o cliente pede para abrir a conexão. O SYN dele leva o número de sequência inicial que ele vai usar.',
    synAck: 'Handshake, 2 de 3: o servidor confirma o SYN e envia o seu próprio número de sequência inicial.',
    ack: 'Handshake, 3 de 3: o cliente confirma. Uma ida e volta completa já passou, e nenhum dado foi enviado ainda.',
    data1: 'O segmento 1 chega em ordem, então o TCP o entrega à aplicação.',
    ack1: 'O servidor confirma o segmento 1. Os acknowledgments são cumulativos: confirmam tudo o que foi recebido até aquele ponto.',
    data2: 'O segmento 2 chega em ordem e é entregue.',
    ack2: 'O servidor confirma tudo até o segmento 2.',
    data3: 'O segmento 3 chega em ordem e é entregue.',
    ack3: 'O servidor confirma tudo até o segmento 3. O emissor sabe que a requisição inteira chegou.',
    data2Lost: 'O segmento 2 se perde no caminho. O IP é best-effort e, por enquanto, nenhum dos lados sabe disso.',
    data3Buffered:
      'O segmento 3 chega, mas o segmento 2, que vem antes, está faltando. O TCP segura o 3 no buffer e não entrega nada. Isso é o head-of-line blocking.',
    duplicateAck: 'O servidor só pode repetir a última confirmação: ele continua tendo tudo até o segmento 1 e nada além disso.',
    retransmit:
      'Nenhuma confirmação do segmento 2 chegou a tempo, então o cliente o retransmite. A lacuna é preenchida e os segmentos 2 e 3 são entregues em ordem.',
    ackAll: 'Uma única confirmação cumulativa cobre tudo até o segmento 3. A aplicação nunca viu a perda. Só percebeu um atraso.',
    fin: 'Encerramento: o cliente não tem mais nada a enviar e fecha o seu lado com um FIN.',
    finAck: 'O servidor confirma e envia o seu próprio FIN.',
    lastAck: 'O cliente confirma e a conexão é encerrada. Todos os segmentos chegaram à aplicação, em ordem.',
    udpData1: 'Sem handshake: o primeiro datagrama já carrega dados e é entregue à aplicação assim que chega.',
    udpData2: 'O datagrama 2 chega e é entregue. O servidor não envia nenhuma confirmação.',
    udpData2Lost: 'O datagrama 2 se perde no caminho. Como não há confirmações, o emissor nunca fica sabendo.',
    udpData3: 'O datagrama 3 chega e é entregue. Também não há encerramento: três pacotes em vez de doze.',
    udpData3AfterLoss:
      'O datagrama 3 é entregue imediatamente, sem esperar pelo 2. Nada recupera o datagrama perdido, a menos que a aplicação detecte e trate a lacuna.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
