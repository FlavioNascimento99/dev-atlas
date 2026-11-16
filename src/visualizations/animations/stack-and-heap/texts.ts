import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Stack and heap while a C program runs',
  description:
    'Every statement changes the memory. A call pushes a frame on the stack and a return pops it. A block obtained from malloc stays on the heap until someone frees it.',
  release: 'Does main call free(q)?',
  releaseYes: 'Yes: free(q)',
  releaseNo: 'No: forget it (leak)',
  program: 'Program',
  svgTitle: 'Stack frames and heap blocks of the program',
  svgDescription:
    'On the left, the stack, with the frame of the running function on top and the pointer variables of each frame. On the right, the heap, with the block returned by malloc. Arrows go from each pointer to the block it points to.',
  stack: 'Stack',
  heap: 'Heap',
  emptyStack: 'empty',
  emptyHeap: 'no block allocated',
  status: {
    allocated: 'in use',
    freed: 'freed',
    leaked: 'leaked: no pointer',
  },
  legend: {
    allocated: 'block in use',
    freed: 'freed block',
    leaked: 'leaked block',
    dangling: 'dangling pointer',
  },
  startRelease: 'Press Play or Step. Nothing is running yet: the stack is empty and no heap block is allocated.',
  startLeak:
    'Press Play or Step. In this version main never calls free(q). Nothing is running yet: the stack is empty and no heap block is allocated.',
  steps: {
    enterMain: 'main starts. A frame for main is pushed on the stack with room for the pointer q, which has no value yet.',
    callMake: 'main calls make. A second frame is pushed on top, with room for the pointer p.',
    allocate:
      'malloc asks the allocator for a block on the heap. Its address goes into p, which lives in the frame of make. The block holds no meaningful value yet.',
    write: '*p = 42 follows the pointer and writes 42 into the heap block.',
    returnMake:
      'make returns. Its frame is popped and p disappears, but the heap block stays put. The returned address is stored in q.',
    free: 'free(q) gives the block back to the allocator. q still holds the old address. That is a dangling pointer: using it now would be an error.',
    returnMain: 'main returns and its frame is popped. The stack is empty and every block was given back: one free for one malloc.',
    returnMainLeak:
      'main returns and its frame is popped. The block is still allocated, but no pointer to it is left, so nothing can free it: a memory leak. Here the operating system reclaims it when the process exits. In a long-running program such as a server, leaks like this pile up.',
  },
}

const pt: typeof en = {
  title: 'Stack e heap durante a execução de um programa em C',
  description:
    'Cada instrução muda a memória. Uma chamada empilha um frame na stack, e um retorno o desempilha. Um bloco obtido com malloc fica no heap até alguém liberá-lo.',
  release: 'main chama free(q)?',
  releaseYes: 'Sim: free(q)',
  releaseNo: 'Não: esquece (memory leak)',
  program: 'Programa',
  svgTitle: 'Frames da stack e blocos do heap do programa',
  svgDescription:
    'À esquerda, a stack, com o frame da função em execução no topo e as variáveis ponteiro de cada frame. À direita, o heap, com o bloco devolvido por malloc. As setas vão de cada ponteiro ao bloco para o qual ele aponta.',
  stack: 'Stack',
  heap: 'Heap',
  emptyStack: 'vazia',
  emptyHeap: 'nenhum bloco alocado',
  status: {
    allocated: 'em uso',
    freed: 'liberado',
    leaked: 'leak: sem ponteiro',
  },
  legend: {
    allocated: 'bloco em uso',
    freed: 'bloco liberado',
    leaked: 'bloco com leak',
    dangling: 'dangling pointer',
  },
  startRelease: 'Pressione Reproduzir ou Avançar. Nada está em execução ainda: a stack está vazia e não há bloco alocado no heap.',
  startLeak:
    'Pressione Reproduzir ou Avançar. Nesta versão main nunca chama free(q). Nada está em execução ainda: a stack está vazia e não há bloco alocado no heap.',
  steps: {
    enterMain: 'main começa. Um frame de main é empilhado na stack, com espaço para o ponteiro q, que ainda não tem valor.',
    callMake: 'main chama make. Um segundo frame é empilhado por cima, com espaço para o ponteiro p.',
    allocate:
      'malloc pede ao alocador um bloco no heap. O endereço vai para p, que vive no frame de make. O bloco ainda não tem nenhum valor útil.',
    write: '*p = 42 segue o ponteiro e grava 42 no bloco do heap.',
    returnMake:
      'make retorna. O frame dela é desempilhado e p desaparece, mas o bloco no heap continua lá. O endereço retornado é guardado em q.',
    free: 'free(q) devolve o bloco ao alocador. q ainda guarda o endereço antigo. Isso é um dangling pointer: usá-lo agora seria um erro.',
    returnMain:
      'main retorna e o frame dela é desempilhado. A stack fica vazia e todo bloco foi devolvido: um free para cada malloc.',
    returnMainLeak:
      'main retorna e o frame dela é desempilhado. O bloco continua alocado, mas não sobrou nenhum ponteiro para ele, então nada mais consegue liberá-lo: um memory leak. Aqui o sistema operacional o recupera quando o processo termina. Num programa de longa duração, como um servidor, leaks assim se acumulam.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
