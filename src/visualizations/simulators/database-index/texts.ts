import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Finding one row: B-tree index versus sequential scan',
  description:
    'The same query answered twice, at the same pace of one read per step: by descending a B-tree index on id and by reading the table row by row.',
  keyParam: 'Search for id',
  svgTitle: 'A B-tree index lookup next to a sequential scan of the same table',
  svgDescription:
    'On top, a B-tree with a root, two branch nodes and six chained leaf nodes holding the ids 1 to 18 in order. Below, the 18 table rows in physical order, which is not the order of the ids. The index path and the rows already scanned are highlighted, and two counters show the reads of each strategy.',
  treeTitle: 'B-tree index on id',
  query: 'WHERE id = {key}',
  tableTitle: 'Table rows, in physical order',
  indexScan: 'Index scan',
  seqScan: 'Sequential scan',
  indexCount: 'nodes {nodes} + rows {rows} = {total} reads',
  seqCount: '{read} of {total} rows read',
  legend: {
    index: 'Read through the index',
    scan: 'Read by the sequential scan',
    match: 'Matching entry and row',
  },
  start:
    'Press Play or Step, or pick another id. Both strategies do one read per step: the index reads a node or a table row, the scan reads the next row of the table.',
  indexRoot: 'Index: reads the root node, compares {key} with its separator keys ({keys}) and follows one pointer down.',
  indexBranch: 'Index: reads a branch node, compares {key} with its separator keys ({keys}) and follows one pointer down.',
  indexLeaf: 'Index: reads the leaf node and finds the entry for {key}, which holds a reference to the row in the table.',
  indexLeafMiss: 'Index: reads the leaf node. There is no entry for {key}, so no row matches.',
  indexFetch: 'Index: table access. It reads the row at position {slot} of the table and is done after {reads} reads.',
  indexDone: 'Index: finished after {reads} reads.',
  scanRow: 'Sequential scan: reads row {n} of {total} (id {id}), which does not match.',
  scanMatch:
    'Sequential scan: reads row {n} of {total} (id {id}), which matches. The scan goes on anyway, because any later row could match too.',
  finished:
    'The sequential scan read all {total} rows and the index needed {reads} reads. With more rows the scan grows linearly, while the tree only gets deeper logarithmically.',
}

const pt: typeof en = {
  title: 'Encontrando uma linha: índice B-tree versus sequential scan',
  description:
    'A mesma consulta respondida duas vezes, no mesmo ritmo de uma leitura por passo: descendo um índice B-tree em id e lendo a tabela linha por linha.',
  keyParam: 'Buscar o id',
  svgTitle: 'Uma busca em índice B-tree ao lado de um sequential scan da mesma tabela',
  svgDescription:
    'No alto, uma B-tree com a raiz, dois nós de ramo e seis nós folha encadeados contendo os ids de 1 a 18 em ordem. Abaixo, as 18 linhas da tabela em ordem física, que não é a ordem dos ids. O caminho no índice e as linhas já percorridas ficam destacados, e dois contadores mostram as leituras de cada estratégia.',
  treeTitle: 'Índice B-tree em id',
  query: 'WHERE id = {key}',
  tableTitle: 'Linhas da tabela, em ordem física',
  indexScan: 'Index scan',
  seqScan: 'Sequential scan',
  indexCount: 'nós {nodes} + linhas {rows} = {total} leituras',
  seqCount: '{read} de {total} linhas lidas',
  legend: {
    index: 'Lido pelo índice',
    scan: 'Lido pelo sequential scan',
    match: 'Entrada e linha correspondentes',
  },
  start:
    'Pressione Play ou Step, ou escolha outro id. As duas estratégias fazem uma leitura por passo: o índice lê um nó ou uma linha da tabela, o scan lê a próxima linha da tabela.',
  indexRoot: 'Índice: lê o nó raiz, compara {key} com as chaves separadoras ({keys}) e segue um ponteiro para baixo.',
  indexBranch: 'Índice: lê um nó de ramo, compara {key} com as chaves separadoras ({keys}) e segue um ponteiro para baixo.',
  indexLeaf: 'Índice: lê o nó folha e encontra a entrada de {key}, que guarda uma referência para a linha na tabela.',
  indexLeafMiss: 'Índice: lê o nó folha. Não há entrada para {key}, então nenhuma linha corresponde.',
  indexFetch: 'Índice: acesso à tabela. Lê a linha na posição {slot} da tabela e termina depois de {reads} leituras.',
  indexDone: 'Índice: terminou depois de {reads} leituras.',
  scanRow: 'Sequential scan: lê a linha {n} de {total} (id {id}), que não corresponde.',
  scanMatch:
    'Sequential scan: lê a linha {n} de {total} (id {id}), que corresponde. O scan continua mesmo assim, porque qualquer linha seguinte também poderia corresponder.',
  finished:
    'O sequential scan leu todas as {total} linhas e o índice precisou de {reads} leituras. Com mais linhas o scan cresce linearmente, enquanto a árvore só fica mais profunda logaritmicamente.',
}

export const texts: Record<Locale, typeof en> = { en, pt }
