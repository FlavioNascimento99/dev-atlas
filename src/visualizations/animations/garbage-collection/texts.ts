import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'One mark-sweep cycle on a small heap',
  description:
    'The program lets go of its only reference to an object that is part of a cycle. A tracing collector marks everything the roots can still reach and sweeps away the rest. Reference counting looks at the same heap through the count stored in each object.',
  strategy: 'Collector',
  tracing: 'Tracing (mark-sweep)',
  counting: 'Reference counting',
  svgTitle: 'Object graph on the heap and the roots that point into it',
  svgDescription:
    'On the left, the roots x and y, which are local variables. On the right, a heap with four slots holding the objects A, B, C and D. Arrows are pointers: x points to A, A points to B, y points to C, and C and D point to each other.',
  roots: 'Roots',
  heap: 'Heap',
  free: 'free',
  nullRoot: '{name} = null',
  count: 'refs: {count}',
  phases: {
    program: 'Program runs',
    mark: 'Mark',
    sweep: 'Sweep',
  },
  noPhase: 'no separate collection phase',
  legend: {
    marked: 'marked',
    unmarked: 'not marked',
    object: 'object',
    unreachable: 'unreachable',
    free: 'free space',
  },
  start: {
    tracing:
      'Press Play or Step. Every object is reachable from a root: x points to A and A points to B; y points to C, and C and D point to each other.',
    counting:
      'Press Play or Step. Each object stores the number of references to it. C has two, from the root y and from D; every other object has one.',
  },
  steps: {
    dropReference:
      'The program sets y to null. C and D are now unreachable: no chain of pointers leads to them from a root. They still take up memory, because nothing has gone looking for garbage yet.',
    collectStart: 'A collection starts. The collector begins from the roots, and nothing is marked yet.',
    markFromRoot: 'The root {from} references {object}, so {object} is marked.',
    markFromObject: '{from} references {object}, so {object} is marked.',
    sweep:
      'No marked object points to an unmarked one, so marking is done. The collector walks the heap. The marked objects stay where they are. {freed} were never reached, so their memory becomes available for allocation. Pointing at each other does not save them: reachability decides what is live.',
    resume:
      'The program continues. The marks are cleared for the next cycle, and a new object, {object}, is allocated in the reclaimed space.',
    countDrop:
      'The program sets y to null, and the count of C is updated immediately: it drops from 2 to 1, because D still references C.',
    countStuck:
      'An object is freed when its count drops to zero, and no count did. C and D are unreachable, yet each keeps a count of one because of the other. Counting alone never frees a cycle, which is why CPython pairs reference counting with a cyclic collector. Switch to tracing to see the same cycle reclaimed.',
  },
}

const pt: typeof en = {
  title: 'Um ciclo de mark-sweep em um heap pequeno',
  description:
    'O programa solta a única referência que tinha para um objeto que faz parte de um ciclo. Um coletor por tracing marca tudo o que as raízes ainda alcançam e varre o resto. O reference counting olha o mesmo heap pela contagem guardada em cada objeto.',
  strategy: 'Coletor',
  tracing: 'Tracing (mark-sweep)',
  counting: 'Reference counting',
  svgTitle: 'Grafo de objetos no heap e as raízes que apontam para ele',
  svgDescription:
    'À esquerda, as raízes x e y, que são variáveis locais. À direita, um heap com quatro posições contendo os objetos A, B, C e D. As setas são ponteiros: x aponta para A, A aponta para B, y aponta para C, e C e D apontam um para o outro.',
  roots: 'Raízes',
  heap: 'Heap',
  free: 'livre',
  nullRoot: '{name} = null',
  count: 'refs: {count}',
  phases: {
    program: 'Programa executa',
    mark: 'Marcação (mark)',
    sweep: 'Varredura (sweep)',
  },
  noPhase: 'sem fase de coleta separada',
  legend: {
    marked: 'marcado',
    unmarked: 'não marcado',
    object: 'objeto',
    unreachable: 'inalcançável',
    free: 'espaço livre',
  },
  start: {
    tracing:
      'Pressione Reproduzir ou Avançar. Todo objeto é alcançável a partir de uma raiz: x aponta para A e A aponta para B; y aponta para C, e C e D apontam um para o outro.',
    counting:
      'Pressione Reproduzir ou Avançar. Cada objeto guarda o número de referências para ele. C tem duas, da raiz y e de D; todos os outros têm uma.',
  },
  steps: {
    dropReference:
      'O programa atribui null a y. C e D agora são inalcançáveis: nenhuma cadeia de ponteiros leva até eles a partir de uma raiz. Mesmo assim continuam ocupando memória, porque ninguém saiu procurando lixo ainda.',
    collectStart: 'Uma coleta começa. O coletor parte das raízes, e nada está marcado ainda.',
    markFromRoot: 'A raiz {from} referencia {object}, então {object} é marcado.',
    markFromObject: '{from} referencia {object}, então {object} é marcado.',
    sweep:
      'Nenhum objeto marcado aponta para um não marcado, então a marcação acabou. O coletor percorre o heap. Os objetos marcados ficam onde estão. {freed} nunca foram alcançados, então a memória deles fica disponível para alocação. Apontar um para o outro não os salva: quem decide o que está vivo é a alcançabilidade.',
    resume:
      'O programa continua. As marcas são limpas para o próximo ciclo, e um novo objeto, {object}, é alocado no espaço recuperado.',
    countDrop:
      'O programa atribui null a y, e a contagem de C é atualizada imediatamente: cai de 2 para 1, porque D ainda referencia C.',
    countStuck:
      'Um objeto é liberado quando a contagem dele chega a zero, e nenhuma chegou. C e D são inalcançáveis, mas cada um mantém a contagem em um por causa do outro. A contagem sozinha nunca libera um ciclo, e é por isso que o CPython combina reference counting com um coletor cíclico. Mude para tracing para ver o mesmo ciclo ser recuperado.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
