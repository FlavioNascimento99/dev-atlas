import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'One event, three independent consumers',
  description:
    'The order service publishes OrderPlaced to a broker. Inventory, billing and notification each receive their own copy and process it at their own pace, without the order service knowing any of them.',
  notificationService: 'Notification service',
  online: 'Online',
  offline: 'Down when the event is published',
  svgTitle: 'An event travelling from a producer through a broker to three consumers',
  svgDescription:
    'The order service on the left is connected only to the broker in the middle. The broker holds one copy of the event for each subscriber and is connected to the three consumers on the right: inventory, billing and notification. Each consumer shows its status and progress.',
  producer: 'Orders',
  producerStatus: {
    idle: 'producer',
    publishing: 'publishing',
    accepted: 'order accepted',
  },
  broker: 'Broker',
  waiting: 'waiting: {count}',
  consumers: {
    inventory: 'Inventory',
    billing: 'Billing',
    notification: 'Notification',
  },
  status: {
    idle: 'subscribed',
    offline: 'down',
    processing: 'processing',
    done: 'done',
  },
  legend: {
    event: 'Copy of the event',
    processing: 'Processing',
    done: 'Done',
    offline: 'Down',
  },
  start: 'Press Play or Step. Three services are subscribed to OrderPlaced; the order service knows only the broker.',
  startDown:
    'Press Play or Step. Three services are subscribed to OrderPlaced, but the notification service is down. The order service knows only the broker, so it cannot tell.',
  retainedNote: 'The copy for the notification service is still waiting at the broker.',
  steps: {
    publish:
      'A customer confirms a purchase. The order service saves the order and publishes OrderPlaced to the broker, without knowing who will react, or whether anyone will.',
    stored:
      'The broker stores the event and keeps one copy for each subscriber. For the order service the work is over: the order is accepted, and it never receives a "result".',
    deliver:
      'Each subscriber gets its own copy: inventory reserves stock, billing charges the card and notification sends an email. None of them knows about the others.',
    deliverOnline:
      'Inventory and billing get their copies and start working. The notification service is down, so its copy stays at the broker; nobody else is affected.',
    inventoryDone: 'Inventory finishes first: the stock is reserved. The other consumers are not waiting for it, nor it for them.',
    billingDone: 'Billing finishes: the card is charged.',
    notificationDone: 'Notification finishes: the email is sent. Every subscriber reacted to the same fact, each on its own schedule.',
    recover: 'The notification service is back. The broker still holds its copy of OrderPlaced.',
    deliverRetained:
      'The broker delivers the retained copy and the notification service starts processing it, long after the others finished. The order was accepted regardless.',
    working: 'The notification service keeps working at its own pace. Nothing else in the system waits for it.',
  },
}

const pt: typeof en = {
  title: 'Um evento, três consumers independentes',
  description:
    'O serviço de pedidos publica OrderPlaced em um broker. Estoque, cobrança e notificações recebem cada um a sua cópia e a processam no próprio ritmo, sem que o serviço de pedidos conheça nenhum deles.',
  notificationService: 'Serviço de notificações',
  online: 'No ar',
  offline: 'Fora do ar quando o evento é publicado',
  svgTitle: 'Um evento indo de um producer, por um broker, a três consumers',
  svgDescription:
    'O serviço de pedidos, à esquerda, está ligado apenas ao broker, no meio. O broker guarda uma cópia do evento para cada assinante e está ligado aos três consumers à direita: estoque, cobrança e notificações. Cada consumer mostra seu estado e seu progresso.',
  producer: 'Pedidos',
  producerStatus: {
    idle: 'producer',
    publishing: 'publicando',
    accepted: 'pedido aceito',
  },
  broker: 'Broker',
  waiting: 'aguardando: {count}',
  consumers: {
    inventory: 'Estoque',
    billing: 'Cobrança',
    notification: 'Notificações',
  },
  status: {
    idle: 'inscrito',
    offline: 'fora do ar',
    processing: 'processando',
    done: 'concluído',
  },
  legend: {
    event: 'Cópia do evento',
    processing: 'Processando',
    done: 'Concluído',
    offline: 'Fora do ar',
  },
  start: 'Pressione Reproduzir ou Avançar. Três serviços estão inscritos em OrderPlaced; o serviço de pedidos conhece apenas o broker.',
  startDown:
    'Pressione Reproduzir ou Avançar. Três serviços estão inscritos em OrderPlaced, mas o serviço de notificações está fora do ar. O serviço de pedidos conhece apenas o broker, então não tem como saber.',
  retainedNote: 'A cópia do serviço de notificações continua aguardando no broker.',
  steps: {
    publish:
      'Um cliente confirma a compra. O serviço de pedidos grava o pedido e publica OrderPlaced no broker, sem saber quem vai reagir, nem se alguém vai.',
    stored:
      'O broker armazena o evento e guarda uma cópia para cada assinante. Para o serviço de pedidos o trabalho acabou: o pedido está aceito, e ele nunca recebe um "resultado".',
    deliver:
      'Cada assinante recebe a sua cópia: o estoque reserva os itens, a cobrança debita o cartão e as notificações enviam um e-mail. Nenhum deles sabe da existência dos outros.',
    deliverOnline:
      'Estoque e cobrança recebem suas cópias e começam a trabalhar. O serviço de notificações está fora do ar, então a cópia dele fica no broker; ninguém mais é afetado.',
    inventoryDone: 'O estoque termina primeiro: os itens estão reservados. Os outros consumers não esperam por ele, nem ele por eles.',
    billingDone: 'A cobrança termina: o cartão foi debitado.',
    notificationDone: 'As notificações terminam: o e-mail foi enviado. Cada assinante reagiu ao mesmo fato, no seu próprio tempo.',
    recover: 'O serviço de notificações voltou. O broker ainda guarda a cópia dele de OrderPlaced.',
    deliverRetained:
      'O broker entrega a cópia retida e o serviço de notificações começa a processá-la, muito depois de os outros terminarem. O pedido foi aceito mesmo assim.',
    working: 'O serviço de notificações segue trabalhando no próprio ritmo. Nada mais no sistema espera por ele.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
