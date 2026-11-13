import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Interleaving vs simultaneous execution',
  description:
    'The same tasks run on a single core, taking turns, and on several cores at the same time. Each block is one unit of work.',
  tasks: 'Tasks',
  cores: 'Cores in the parallel timeline',
  concurrentLane: 'Concurrency: 1 core, tasks interleave',
  parallelLane: 'Parallelism: {cores} cores, tasks run simultaneously',
  core: 'Core {n}',
  task: 'T{n}',
  svgTitle: 'Execution timelines for one core and for several cores',
  svgDescription:
    'Two timelines of the same tasks. On one core the tasks take turns; with several cores they run in the same time unit.',
  start: 'Press Play or Step. {tasks} tasks need {work} units of work in total.',
  moment:
    'Time {time}: the single core runs {single} while the other tasks wait; with {cores} cores, {parallel} run at the same instant.',
  parallelDone:
    'Time {time}: the single core runs {single} while the other tasks wait; with {cores} cores, every task has already finished.',
  finished:
    'Done. Interleaving on 1 core took {single} time units; {cores} cores took {parallel}. Same total work, less elapsed time.',
}

const pt: typeof en = {
  title: 'Execução intercalada vs simultânea',
  description:
    'As mesmas tarefas rodam em um único núcleo, revezando-se, e em vários núcleos ao mesmo tempo. Cada bloco é uma unidade de trabalho.',
  tasks: 'Tarefas',
  cores: 'Núcleos na linha do tempo paralela',
  concurrentLane: 'Concorrência: 1 núcleo, tarefas intercaladas',
  parallelLane: 'Paralelismo: {cores} núcleos, tarefas simultâneas',
  core: 'Núcleo {n}',
  task: 'T{n}',
  svgTitle: 'Linhas do tempo de execução para um núcleo e para vários núcleos',
  svgDescription:
    'Duas linhas do tempo das mesmas tarefas. Em um núcleo as tarefas se revezam; com vários núcleos elas rodam na mesma unidade de tempo.',
  start: 'Pressione Reproduzir ou Avançar. {tasks} tarefas precisam de {work} unidades de trabalho no total.',
  moment:
    'Tempo {time}: o único núcleo executa {single} enquanto as outras tarefas esperam; com {cores} núcleos, {parallel} rodam no mesmo instante.',
  parallelDone:
    'Tempo {time}: o único núcleo executa {single} enquanto as outras tarefas esperam; com {cores} núcleos, todas as tarefas já terminaram.',
  finished:
    'Concluído. Intercalando em 1 núcleo foram {single} unidades de tempo; com {cores} núcleos, {parallel}. Mesmo trabalho total, menos tempo decorrido.',
}

export const texts: Record<Locale, typeof en> = { en, pt }
