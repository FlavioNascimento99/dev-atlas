import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'A spreadsheet cell notifying its observers',
  description:
    'The cell is the subject; chart, totals and autosave are observers. Each step either changes the value of the cell or delivers the notification to the next subscribed observer.',
  subscribed: 'Subscribed',
  unsubscribed: 'Unsubscribed',
  svgTitle: 'A subject, the code that changes it and three observers',
  svgDescription:
    'The caller on the top left sets the value of the cell, at the top. Lines go from the cell to the three observers below it: solid for a subscribed observer, dashed for an unsubscribed one. Each observer shows the last value it received.',
  caller: 'caller',
  callerStatus: {
    idle: 'idle',
    changed: 'waiting',
    notifying: 'waiting',
    returned: 'returned',
  },
  subject: 'cell (subject)',
  position: 'subscribed · #{n}',
  notSubscribed: 'not subscribed',
  stale: 'stale',
  legendSubscribed: 'subscribed',
  legendUnsubscribed: 'unsubscribed',
  legendNotification: 'notification',
  idle: 'The cell holds {value} and every observer shows it. Press Step to change the value, or unsubscribe an observer first and watch what it misses.',
  changed:
    'Some code sets cell.value = {value}. The cell stores the value and calls notify(), which copies its list: [{list}]. The cell knows nothing else about those entries, and the caller is now waiting.',
  changedNobody:
    'Some code sets cell.value = {value}. The cell stores the value and calls notify(), but its list is empty: nobody will be told.',
  notifying: 'notify() calls {name}, which updates to {value}, and control returns to the loop. Still to call: {remaining}. The caller keeps waiting.',
  none: 'nobody',
  returned: 'Every observer in the list has returned, so only now does the assignment return to its caller.',
  staleNote: 'Not subscribed and now out of date: {names}. The cell holds no reference to them, so the change never reached them.',
}

const pt: typeof en = {
  title: 'Uma célula de planilha notificando seus observers',
  description:
    'A célula é o subject; chart, totals e autosave são observers. Cada etapa muda o valor da célula ou entrega a notificação ao próximo observer inscrito.',
  subscribed: 'Inscrito',
  unsubscribed: 'Não inscrito',
  svgTitle: 'Um subject, o código que o altera e três observers',
  svgDescription:
    'O chamador, no alto à esquerda, define o valor da célula, no alto. Linhas saem da célula para os três observers abaixo dela: contínuas para um observer inscrito, tracejadas para um não inscrito. Cada observer mostra o último valor que recebeu.',
  caller: 'chamador',
  callerStatus: {
    idle: 'ocioso',
    changed: 'esperando',
    notifying: 'esperando',
    returned: 'retornou',
  },
  subject: 'cell (subject)',
  position: 'inscrito · nº {n}',
  notSubscribed: 'não inscrito',
  stale: 'defasado',
  legendSubscribed: 'inscrito',
  legendUnsubscribed: 'não inscrito',
  legendNotification: 'notificação',
  idle: 'A célula guarda {value} e todos os observers mostram esse valor. Pressione Avançar para mudar o valor, ou cancele antes a inscrição de um observer e veja o que ele perde.',
  changed:
    'Algum código define cell.value = {value}. A célula guarda o valor e chama notify(), que copia a sua lista: [{list}]. A célula não sabe mais nada sobre essas entradas, e o chamador agora está esperando.',
  changedNobody:
    'Algum código define cell.value = {value}. A célula guarda o valor e chama notify(), mas a lista está vazia: ninguém será avisado.',
  notifying:
    'notify() chama {name}, que se atualiza para {value}, e o controle volta ao laço. Ainda por chamar: {remaining}. O chamador continua esperando.',
  none: 'ninguém',
  returned: 'Todos os observers da lista retornaram; só agora a atribuição retorna a quem a chamou.',
  staleNote: 'Sem inscrição e agora desatualizados: {names}. A célula não guarda referência a eles, então a mudança nunca os alcançou.',
}

export const texts: Record<Locale, typeof en> = { en, pt }
