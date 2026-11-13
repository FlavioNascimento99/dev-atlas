import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Lost update on a shared counter',
  description:
    'Two threads increment the same counter with read, add and write steps. The scheduler alternates between them on every step.',
  mutex: 'Synchronization',
  withoutMutex: 'Without mutex',
  withMutex: 'With mutex',
  increments: 'Increments per thread',
  thread: 'Thread {name}',
  register: 'r = {value}',
  counter: 'counter',
  lockFree: 'mutex: free',
  lockHeld: 'mutex: {name}',
  svgTitle: 'Two threads updating a shared counter',
  svgDescription:
    'Each thread shows its program with the next instruction highlighted and its private register; the shared counter sits in the middle.',
  start: 'Both threads will increment the counter {increments} time(s). Expected final value: {expected}.',
  read: 'Thread {name} reads counter = {value} into its register.',
  add: 'Thread {name} adds 1 in its register, which now holds {value}. Memory still holds {counter}.',
  write: 'Thread {name} writes {value} to the counter.',
  lostUpdate: 'Thread {name} writes {value}, overwriting an update it never saw: a lost update!',
  acquire: 'Thread {name} acquires the mutex and enters the critical section.',
  blocked: 'Thread {name} tries to acquire the mutex, but Thread {owner} holds it, so it waits.',
  release: 'Thread {name} releases the mutex.',
  finishedOk: 'Done: counter = {counter}, exactly the expected {expected}.',
  finishedLost: 'Done: counter = {counter}, but {expected} was expected. {lost} update(s) were lost.',
}

const pt: typeof en = {
  title: 'Atualização perdida em um contador compartilhado',
  description:
    'Duas threads incrementam o mesmo contador com passos de leitura, soma e escrita. O escalonador alterna entre elas a cada passo.',
  mutex: 'Sincronização',
  withoutMutex: 'Sem mutex',
  withMutex: 'Com mutex',
  increments: 'Incrementos por thread',
  thread: 'Thread {name}',
  register: 'r = {value}',
  counter: 'contador',
  lockFree: 'mutex: livre',
  lockHeld: 'mutex: {name}',
  svgTitle: 'Duas threads atualizando um contador compartilhado',
  svgDescription:
    'Cada thread mostra seu programa com a próxima instrução destacada e seu registrador privado; o contador compartilhado fica no meio.',
  start: 'As duas threads vão incrementar o contador {increments} vez(es). Valor final esperado: {expected}.',
  read: 'A thread {name} lê contador = {value} para o seu registrador.',
  add: 'A thread {name} soma 1 no registrador, que agora vale {value}. A memória ainda guarda {counter}.',
  write: 'A thread {name} escreve {value} no contador.',
  lostUpdate: 'A thread {name} escreve {value} e sobrescreve uma atualização que nunca viu: atualização perdida!',
  acquire: 'A thread {name} adquire o mutex e entra na seção crítica.',
  blocked: 'A thread {name} tenta adquirir o mutex, mas a thread {owner} o detém, então ela espera.',
  release: 'A thread {name} libera o mutex.',
  finishedOk: 'Concluído: contador = {counter}, exatamente o esperado ({expected}).',
  finishedLost: 'Concluído: contador = {counter}, mas o esperado era {expected}. {lost} atualização(ões) se perderam.',
}

export const texts: Record<Locale, typeof en> = { en, pt }
