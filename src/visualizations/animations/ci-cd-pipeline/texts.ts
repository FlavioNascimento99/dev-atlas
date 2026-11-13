import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'One commit through a deployment pipeline',
  description:
    'Every stage gives more confidence at a higher cost in time. The artifact is built once and that same build is promoted from one environment to the next, unless a stage fails.',
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
  start: 'Press Play or Step. A commit is about to be pushed; staging and production run the previous release.',
  steps: {
    push: 'A developer pushes a small change to the mainline. The push event triggers the pipeline and a runner checks out that exact commit.',
    build:
      'Commit stage: the runner installs dependencies, compiles and lints, in a reference environment rather than on a developer’s machine.',
    unitTests: 'Commit stage: the fast unit tests pass, so the commit can be packaged.',
    unitTestsFailed:
      'A unit test fails. The pipeline stops and notifies the team, every later stage is blocked and no artifact is built. Staging and production keep the previous release, and fixing the mainline, often with a revert, starts a new run.',
    artifact:
      'A deployable artifact, here a container image, is built once from this commit and stored. Every later stage uses this same build, never a rebuild.',
    acceptance: 'The slower integration and acceptance tests run against that artifact and pass.',
    acceptanceFailed:
      'An acceptance test fails against the artifact. The pipeline stops: the image stays in the registry but is promoted to no environment, and staging and production keep the previous release.',
    staging: 'The same artifact is deployed to staging, an environment that mirrors production.',
    approval:
      'A person approves the release: this manual trigger is continuous delivery. In continuous deployment the stage would be automatic.',
    production:
      'The artifact that was tested and ran in staging is promoted to production. What was tested is exactly what is running.',
  },
}

const pt: typeof en = {
  title: 'Um commit por um pipeline de deploy',
  description:
    'Cada estágio dá mais confiança a um custo maior de tempo. O artefato é construído uma única vez e esse mesmo build é promovido de um ambiente para o seguinte, a não ser que um estágio falhe.',
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
  start: 'Pressione Play ou Step. Um commit está prestes a receber push; staging e produção rodam o release anterior.',
  steps: {
    push: 'Um desenvolvedor faz push de uma mudança pequena na mainline. O evento de push dispara o pipeline e um runner faz checkout exatamente daquele commit.',
    build:
      'Estágio de commit: o runner instala dependências, compila e roda o lint, em um ambiente de referência e não na máquina de um desenvolvedor.',
    unitTests: 'Estágio de commit: os testes unitários, rápidos, passam, então o commit pode ser empacotado.',
    unitTestsFailed:
      'Um teste unitário falha. O pipeline para e notifica o time, todos os estágios seguintes ficam bloqueados e nenhum artefato é construído. Staging e produção continuam com o release anterior, e a correção da mainline, muitas vezes um revert, inicia uma nova execução.',
    artifact:
      'Um artefato implantável, aqui uma imagem de container, é construído uma única vez a partir deste commit e armazenado. Todos os estágios seguintes usam esse mesmo build, nunca um novo.',
    acceptance: 'Os testes de integração e de aceitação, mais lentos, rodam contra esse artefato e passam.',
    acceptanceFailed:
      'Um teste de aceitação falha contra o artefato. O pipeline para: a imagem fica no registro, mas não é promovida para nenhum ambiente, e staging e produção continuam com o release anterior.',
    staging: 'O mesmo artefato é implantado em staging, um ambiente semelhante ao de produção.',
    approval:
      'Uma pessoa aprova o release: esse gatilho manual é continuous delivery. Em continuous deployment o estágio seria automático.',
    production:
      'O artefato que foi testado e rodou em staging é promovido para produção. O que foi testado é exatamente o que está rodando.',
  },
}

export const texts: Record<Locale, typeof en> = { en, pt }
