import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'A spreadsheet cell notifying its observers',
  description:
    'The cell is the subject; chart, totals and autosave are its observers. Each step does one thing: it either changes the value of the cell or delivers the notification to the next subscribed observer.',
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
  idle: 'The cell holds {value} and every observer shows it. Press Step to change the value. Or unsubscribe an observer first, and watch what it misses.',
  changed:
    'Some code sets cell.value = {value}. The cell stores the value and calls notify(), which copies its list: [{list}]. That list is all the cell knows about them. From now on, the caller waits.',
  changedNobody:
    'Some code sets cell.value = {value}. The cell stores the value and calls notify(), but its list is empty. Nobody will hear about it.',
  notifying: 'notify() calls {name}, which updates to {value}, and control goes back to the loop. Still to call: {remaining}. The caller is still waiting.',
  none: 'nobody',
  returned: 'Every observer in the list has returned. Only now does the assignment give control back to its caller.',
  staleNote: 'Not subscribed and now out of date: {names}. The cell holds no reference to them, so the change never got there.',
}

const pt: typeof en = {
  title: 'Uma célula de planilha notificando seus observers',
  description:
    'A célula é o subject; chart, totals e autosave são os observers dela. Cada etapa faz uma coisa só: muda o valor da célula ou entrega a notificação ao próximo observer inscrito.',
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
  idle: 'A célula guarda {value} e todos os observers mostram esse valor. Pressione Avançar para mudar o valor. Ou cancele antes a inscrição de um observer e veja o que ele perde.',
  changed:
    'Algum código define cell.value = {value}. A célula guarda o valor e chama notify(), que copia a lista: [{list}]. Essa lista é tudo o que a célula sabe sobre eles. A partir daqui, o chamador fica esperando.',
  changedNobody:
    'Algum código define cell.value = {value}. A célula guarda o valor e chama notify(), mas a lista está vazia. Ninguém vai ficar sabendo.',
  notifying:
    'notify() chama {name}, que passa a mostrar {value}, e o controle volta ao laço. Falta chamar: {remaining}. O chamador continua esperando.',
  none: 'ninguém',
  returned: 'Todos os observers da lista retornaram. Só agora a atribuição devolve o controle a quem a chamou.',
  staleNote: 'Sem inscrição e agora desatualizados: {names}. A célula não guarda referência a eles, então a mudança nunca chegou lá.',
}

export const texts: Record<Locale, typeof en> = { en, pt }
