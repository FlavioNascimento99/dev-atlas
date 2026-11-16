import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'One commit through a deployment pipeline',
  description:
    'Think of an assembly line with inspection stations. Each stage gives more confidence, at a higher cost in time. The artifact is built once, and that same build moves from one environment to the next, unless a stage fails and stops the line.',
  tests: 'Test results',
  allPass: 'All pass',
  unitFail: 'Unit tests fail',
  acceptanceFail: 'Acceptance tests fail',
  svgTitle: 'Stages of a deployment pipeline and where the artifact of the commit is',
  svgDescription:
    'On the left, eight stages from top to bottom: push, compile and lint, unit tests, package the artifact, acceptance tests, deploy to staging, manual approval and deploy to production. On the right, the artifact registry, staging and production, each showing whether it holds the artifact built from this commit or the previous release.',
  commit: 'commit 4f2a9c1',
  stages: {
    push: 'Push to mainline',
    build: 'Compile + lint',
    unitTests: 'Unit tests',
    artifact: 'Package artifact (once)',
    acceptance: 'Acceptance tests',
    staging: 'Deploy to staging',
    approval: 'Manual approval',
    production: 'Deploy to production',
  },
  locations: {
    registry: 'Artifact registry',
    staging: 'Staging',
    production: 'Production',
  },
  artifact: 'image 4f2a9c1',
  previous: 'previous release',
  notBuilt: 'not built yet',
  legend: {
    passed: 'Passed',
    failed: 'Failed',
    blocked: 'Blocked',
    artifact: 'Artifact of this commit',
  },
  start: 'Press Play or Step. A commit is about to be pushed. For now, staging and production still run the previous release.',
  steps: {
    push: 'A developer pushes a small change to the mainline. That push event starts the pipeline, and a runner, the machine that does the work, checks out that exact commit.',
    build:
      'Commit stage: the runner installs dependencies, compiles and lints. It does this in a reference environment, not on a developer’s machine, so the result does not depend on anyone’s laptop.',
    unitTests: 'Commit stage: the fast unit tests pass, so the commit is ready to be packaged.',
    unitTestsFailed:
      'A unit test fails, and the line stops right here. The team is notified, every later stage is blocked and no artifact is built. Staging and production keep the previous release. Fixing the mainline, often with a revert, starts a new run.',
    artifact:
      'A deployable artifact, here a container image, is built once from this commit and stored in the registry. Every later stage uses this same build. Nothing is rebuilt.',
    acceptance: 'Now the slower integration and acceptance tests run against that artifact. They pass.',
    acceptanceFailed:
      'An acceptance test fails against the artifact, and the pipeline stops. The image stays in the registry, but it is promoted to no environment. Staging and production keep the previous release.',
    staging: 'The same artifact is deployed to staging, an environment set up to mirror production.',
    approval:
      'A person approves the release. That manual trigger is what makes this continuous delivery. In continuous deployment, this stage would be automatic.',
    production:
      'The artifact that was tested and ran in staging is promoted to production. What was tested is exactly what is running now.',
  },
}

const pt: typeof en = {
  title: 'Um commit por um pipeline de deploy',
  description:
    'Pense numa linha de montagem com postos de inspeção. Cada estágio dá mais confiança, a um custo maior de tempo. O artefato é construído uma única vez, e esse mesmo build passa de um ambiente para o seguinte, a não ser que um estágio falhe e pare a linha.',
  tests: 'Resultado dos testes',
  allPass: 'Todos passam',
  unitFail: 'Testes unitários falham',
  acceptanceFail: 'Testes de aceitação falham',
  svgTitle: 'Estágios de um pipeline de deploy e onde está o artefato do commit',
  svgDescription:
    'À esquerda, oito estágios de cima para baixo: push, compilação e lint, testes unitários, empacotamento do artefato, testes de aceitação, deploy em staging, aprovação manual e deploy em produção. À direita, o registro de artefatos, staging e produção, cada um mostrando se contém o artefato construído a partir deste commit ou o release anterior.',
  commit: 'commit 4f2a9c1',
  stages: {
    push: 'Push na mainline',
    build: 'Compilar + lint',
    unitTests: 'Testes unitários',
    artifact: 'Empacotar artefato (1 vez)',
    acceptance: 'Testes de aceitação',
    staging: 'Deploy em staging',
    approval: 'Aprovação manual',
    production: 'Deploy em produção',
  },
  locations: {
    registry: 'Registro de artefatos',
    staging: 'Staging',
    production: 'Produção',
  },
  artifact: 'imagem 4f2a9c1',
  previous: 'release anterior',
  notBuilt: 'ainda não gerado',
  legend: {
    passed: 'Passou',
    failed: 'Falhou',
    blocked: 'Bloqueado',
    artifact: 'Artefato deste commit',
  },
  start: 'Pressione Reproduzir ou Avançar. Um commit está prestes a ir para a mainline. Por enquanto, staging e produção ainda rodam o release anterior.',
  steps: {
    push: 'Um desenvolvedor faz push de uma mudança pequena na mainline. Esse evento de push dispara o pipeline, e um runner, a máquina que faz o trabalho, faz checkout exatamente daquele commit.',
    build:
      'Estágio de commit: o runner instala dependências, compila e roda o lint. Tudo isso acontece em um ambiente de referência, não na máquina de um desenvolvedor, então o resultado não depende do notebook de ninguém.',
    unitTests: 'Estágio de commit: os testes unitários, que são rápidos, passam. O commit está pronto para ser empacotado.',
    unitTestsFailed:
      'Um teste unitário falha, e a linha para aqui mesmo. O time é avisado, todos os estágios seguintes ficam bloqueados e nenhum artefato é construído. Staging e produção continuam com o release anterior. A correção da mainline, muitas vezes um revert, inicia uma nova execução.',
    artifact:
      'Um artefato implantável, aqui uma imagem de container, é construído uma única vez a partir deste commit e guardado no registro. Todos os estágios seguintes usam esse mesmo build. Nada é reconstruído.',
    acceptance: 'Agora os testes de integração e de aceitação, mais lentos, rodam contra esse artefato. Eles passam.',
    acceptanceFailed:
      'Um teste de aceitação falha contra o artefato, e o pipeline para. A imagem fica no registro, mas não é promovida para nenhum ambiente. Staging e produção continuam com o release anterior.',
    staging: 'O mesmo artefato é implantado em staging, um ambiente montado para espelhar a produção.',
    approval:
      'Uma pessoa aprova o release. É esse gatilho manual que faz disto continuous delivery. Em continuous deployment, este estágio seria automático.',
    production:
      'O artefato que foi testado e rodou em staging é promovido para produção. O que foi testado é exatamente o que está rodando agora.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
