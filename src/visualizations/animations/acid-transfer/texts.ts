import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'A transfer of 100 from Alice to Bob',
  description:
    'A transfer is two steps: a debit and a credit. Run it with and without a transaction, add a server crash between the two statements if you like, and compare what is left in the database.',
  mode: 'Statements',
  withTransaction: 'In a transaction',
  withoutTransaction: 'No transaction',
  failure: 'Failure',
  crash: 'Crash after the debit',
  noCrash: 'None',
  svgTitle: 'Balances of Alice and Bob during a transfer of 100',
  svgDescription:
    'Two account cards with their balances and, between them, the 100 being moved. Below, the total of the committed balances and the log of the statements executed so far.',
  accounts: { alice: 'Alice', bob: 'Bob' },
  uncommitted: 'uncommitted',
  crashMark: 'crash',
  totalOk: 'Committed total: {total}',
  totalBroken: 'Committed total: {total} · {missing} missing',
  logTitle: 'Statement log',
  log: {
    begin: 'BEGIN',
    debit: 'UPDATE Alice − 100',
    debitAutocommit: 'UPDATE Alice − 100 → auto-commit',
    credit: 'UPDATE Bob + 100',
    creditAutocommit: 'UPDATE Bob + 100 → auto-commit',
    commit: 'COMMIT',
    crash: 'server crash',
    crashAutocommit: 'server crash',
    rollback: 'ROLLBACK (crash recovery)',
    restart: 'restart: nothing to roll back',
  },
  legend: {
    committed: 'Committed, invariant holds',
    uncommitted: 'Uncommitted change',
    failure: 'Failure or lost money',
  },
  startTransaction:
    'Press Play or Step. Alice has 500 and Bob has 200, 700 in total. The transfer runs between BEGIN and COMMIT.',
  startAutocommit:
    'Press Play or Step. Alice has 500 and Bob has 200, 700 in total. The two updates run without BEGIN, so each one commits on its own.',
  steps: {
    begin: 'BEGIN opens the transaction. Nothing it writes is visible to other sessions until COMMIT.',
    debit:
      "Alice's balance drops by 100 and the change is recorded in the write-ahead log, but it is not committed yet. Isolation: another session reading Alice's row still sees 500, so the committed total is still 700.",
    debitAutocommit:
      'Without BEGIN, the statement gets an implicit transaction of its own, which commits as soon as it succeeds. The debit is already permanent, and until the credit runs, 100 is in neither account.',
    credit: "Bob's balance goes up by 100. Both changes are still uncommitted, and other sessions cannot see them.",
    creditAutocommit:
      'The credit commits on its own too. Nothing failed between the two statements this time, so the total is back to 700. You got lucky, not protected.',
    commit:
      'COMMIT flushes the log to disk and only then reports success. Durability: from here on, a crash cannot lose the transfer. Both new balances become visible at the same moment, and the total is still 700.',
    crash: 'The server crashes between the debit and the credit. The transaction never reached COMMIT.',
    crashAutocommit:
      'The server crashes between the debit and the credit. The debit was already committed and the credit never ran.',
    rollback:
      'Atomicity: during recovery the database undoes the uncommitted debit. Alice is back to 500, the total is 700 and the application can retry the whole transfer.',
    restart:
      'The database restarts with exactly what was committed: Alice 400 and Bob 200. There is no transaction to roll back, so 100 has vanished. Spotting and repairing that is now up to the application.',
  },
}

const pt: typeof en = {
  title: 'Uma transferência de 100 de Alice para Bob',
  description:
    'Uma transferência tem dois passos: um débito e um crédito. Rode com e sem transação, coloque uma queda do servidor entre os dois comandos se quiser e compare o que sobra no banco de dados.',
  mode: 'Comandos',
  withTransaction: 'Em uma transação',
  withoutTransaction: 'Sem transação',
  failure: 'Falha',
  crash: 'Queda após o débito',
  noCrash: 'Nenhuma',
  svgTitle: 'Saldos de Alice e Bob durante uma transferência de 100',
  svgDescription:
    'Dois cartões de conta com seus saldos e, entre eles, os 100 que estão sendo movidos. Abaixo, o total dos saldos com commit e o log dos comandos executados até agora.',
  accounts: { alice: 'Alice', bob: 'Bob' },
  uncommitted: 'sem commit',
  crashMark: 'queda',
  totalOk: 'Total com commit: {total}',
  totalBroken: 'Total com commit: {total} · faltam {missing}',
  logTitle: 'Log de comandos',
  log: {
    begin: 'BEGIN',
    debit: 'UPDATE Alice − 100',
    debitAutocommit: 'UPDATE Alice − 100 → auto-commit',
    credit: 'UPDATE Bob + 100',
    creditAutocommit: 'UPDATE Bob + 100 → auto-commit',
    commit: 'COMMIT',
    crash: 'queda do servidor',
    crashAutocommit: 'queda do servidor',
    rollback: 'ROLLBACK (recuperação)',
    restart: 'reinício: nada a desfazer',
  },
  legend: {
    committed: 'Com commit, invariante vale',
    uncommitted: 'Alteração sem commit',
    failure: 'Falha ou dinheiro perdido',
  },
  startTransaction:
    'Pressione Reproduzir ou Avançar. Alice tem 500 e Bob tem 200, 700 no total. A transferência roda entre BEGIN e COMMIT.',
  startAutocommit:
    'Pressione Reproduzir ou Avançar. Alice tem 500 e Bob tem 200, 700 no total. Os dois updates rodam sem BEGIN, então cada um faz commit sozinho.',
  steps: {
    begin: 'BEGIN abre a transação. Nada do que ela escreve fica visível para outras sessões até o COMMIT.',
    debit:
      'O saldo de Alice cai 100 e a alteração é registrada no write-ahead log, mas ainda não tem commit. Isolamento: outra sessão que leia a linha de Alice continua vendo 500, então o total com commit segue em 700.',
    debitAutocommit:
      'Sem BEGIN, o comando recebe uma transação implícita só dele, que faz commit assim que ele termina com sucesso. O débito já é permanente e, até o crédito rodar, 100 não estão em nenhuma das contas.',
    credit:
      'O saldo de Bob sobe 100. As duas alterações continuam sem commit, e as outras sessões não as enxergam.',
    creditAutocommit:
      'O crédito também faz commit sozinho. Desta vez nada falhou entre os dois comandos, então o total volta a 700. Foi sorte, não proteção.',
    commit:
      'O COMMIT descarrega o log em disco e só então informa sucesso. Durabilidade: daqui em diante, uma queda não consegue mais perder a transferência. Os dois novos saldos ficam visíveis no mesmo momento, e o total continua 700.',
    crash: 'O servidor cai entre o débito e o crédito. A transação nunca chegou ao COMMIT.',
    crashAutocommit: 'O servidor cai entre o débito e o crédito. O débito já tinha commit e o crédito nunca rodou.',
    rollback:
      'Atomicidade: durante a recuperação, o banco de dados desfaz o débito sem commit. Alice volta a 500, o total é 700 e a aplicação pode repetir a transferência inteira.',
    restart:
      'O banco de dados reinicia exatamente com o que tinha commit: Alice 400 e Bob 200. Não há transação para desfazer, então 100 sumiram. Perceber e consertar isso agora é problema da aplicação.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
