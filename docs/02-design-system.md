# DOCUMENTO 02 — DESIGN SYSTEM, EXPERIÊNCIA VISUAL E ARQUITETURA TÉCNICA

**Projeto:** DevAtlas  
**Categoria:** Visual Software Engineering Knowledge Base  
**Versão:** 1.0  
**Status:** Especificação de design e engenharia  
**Referência:** Documento 01 — Visão e Concepção do Produto

---

# 1. Objetivo do documento

Este documento estabelece as diretrizes visuais, funcionais e técnicas para o desenvolvimento da aplicação DevAtlas.

Seu propósito é definir uma identidade visual consistente, uma experiência de navegação intuitiva e uma arquitetura frontend capaz de suportar a evolução da plataforma.

A especificação deverá servir como referência para:

- Desenvolvimento da interface.
- Implementação dos componentes.
- Organização das páginas.
- Construção dos laboratórios visuais.
- Desenvolvimento de novos tópicos.
- Padronização da experiência de navegação.
- Evolução da arquitetura técnica.

O objetivo não é criar uma interface isolada, mas estabelecer um padrão que possa ser reproduzido em toda a plataforma.

# 2. Direção visual e identidade do produto

## 2.1. Conceito visual

O DevAtlas deverá transmitir a identidade de uma ferramenta profissional de engenharia de software.

A interface deverá combinar elementos de:

- Plataformas modernas de documentação.
- Ferramentas de desenvolvimento.
- Ambientes de aprendizado técnico.
- Dashboards de engenharia.
- Editores e visualizadores de diagramas.

A estética deverá ser minimalista, organizada e predominantemente funcional.

O conteúdo técnico será o elemento central da experiência. A interface não deverá competir visualmente com ele.

## 2.2. Características visuais

Diretrizes:

| Característica | Direção |
|---|---|
| Estilo | Minimalista e tecnológico |
| Layout | Editorial e modular |
| Tipografia | Moderna e altamente legível |
| Cores | Neutras, com cores de destaque controladas |
| Componentes | Consistentes e reutilizáveis |
| Espaçamento | Generoso e organizado |
| Animações | Sutis e funcionais |
| Diagramas | Claros e visualmente explicativos |
| Densidade | Moderada, priorizando leitura |

## 2.3. Referências de direção estética

As seguintes plataformas podem servir como referências de experiência e linguagem visual:

- **Linear:** organização, hierarquia visual e minimalismo.
- **Vercel:** identidade tecnológica e clareza.
- **Stripe Docs:** apresentação de documentação técnica.
- **Raycast:** organização de interfaces e navegação.
- **GitBook:** estrutura de documentação e navegação lateral.

Essas referências deverão orientar decisões de design, sem reproduzir diretamente suas interfaces.

## 2.4. Paleta de cores

A proposta inicial será baseada em uma interface neutra, com destaque em tons de índigo.

### Cores principais

| Elemento | Cor sugerida |
|---|---|
| Background principal | #FFFFFF |
| Background secundário | #F8FAFC |
| Superfícies | #F1F5F9 |
| Texto principal | #0F172A |
| Texto secundário | #64748B |
| Bordas | #E2E8F0 |
| Cor primária | #6366F1 |
| Cor de destaque | #0EA5A4 |

### Cores semânticas

| Finalidade | Cor |
|---|---|
| Sucesso | #16A34A |
| Informação | #3B82F6 |
| Atenção | #D97706 |
| Erro | #DC2626 |

A paleta deverá ser implementada através de tokens, permitindo ajustes globais sem modificar componentes individualmente.

## 2.5. Tema escuro

A aplicação deverá oferecer suporte a tema escuro.

O tema escuro deverá utilizar superfícies em tons de grafite e azul-acinzentado, evitando o uso de preto absoluto como fundo predominante.

As cores semânticas e de destaque deverão manter contraste adequado.

A preferência do usuário poderá ser persistida localmente no navegador.

## 2.6. Tipografia

Sugestão:

- **Inter:** textos gerais, títulos e navegação.
- **JetBrains Mono:** códigos, identificadores técnicos e exemplos de implementação.

Hierarquia:

| Elemento | Tamanho de referência |
|---|---|
| Título principal | 36–44 px |
| Título de seção | 24–30 px |
| Subtítulo | 18–22 px |
| Corpo do texto | 15–17 px |
| Texto auxiliar | 13–14 px |
| Código | 13–14 px |

Os tamanhos poderão variar conforme o dispositivo.

# 3. Estrutura global da aplicação

A aplicação deverá possuir uma estrutura de navegação consistente em todas as páginas.

## 3.1. Layout principal

A interface será dividida em três regiões principais:

1. Sidebar: navegação por categorias.
2. Header: identidade, busca e configurações.
3. Main Content: conteúdo da página.

Em páginas de artigos, poderá existir uma quarta região:

4. Table of Contents: navegação interna do artigo.

### Representação estrutural

```text
+------------------------------------------------------------+
| LOGO       Search                         Theme   Settings |
+------------------+-----------------------------------------+
|                  |                                         |
| SIDEBAR          |              MAIN CONTENT               |
|                  |                                         |
| Explore          |                                         |
|                  |                                         |
| Computer Science |                                         |
| Concurrency      |                                         |
| System Design    |                                         |
| Architecture     |                                         |
| Design Patterns  |                                         |
| Distributed Sys. |                                         |
| Infrastructure   |                                         |
| Databases        |                                         |
| Networking       |                                         |
| Security         |                                         |
|                  |                                         |
|                  |                                         |
+------------------+-----------------------------------------+
```

## 3.2. Sidebar

A sidebar será responsável pela navegação entre os domínios de conhecimento.

Elementos:

- Logotipo e nome da aplicação.
- Link para Home.
- Link para Explore.
- Categorias principais.
- Subcategorias expansíveis.
- Indicador visual da página atual.

Categorias:

1. Computer Science
2. Concurrency
3. System Design
4. Software Architecture
5. Design Patterns
6. Distributed Systems
7. Infrastructure
8. Databases
9. Networking
10. Security

Comportamento:

- Permitir expandir e recolher categorias.
- Destacar a categoria atual.
- Destacar o tópico selecionado.
- Manter a navegação organizada.
- Em dispositivos móveis, transformar-se em menu lateral expansível.

## 3.3. Header

O header deverá permanecer consistente em todas as páginas.

Elementos:

- Logotipo.
- Campo de pesquisa global.
- Controle de tema.
- Acesso às configurações visuais.

O campo de pesquisa deverá possuir destaque suficiente para facilitar a localização de conceitos.

## 3.4. Navegação contextual

Em páginas de tópicos, a aplicação deverá apresentar breadcrumbs.

Exemplo:

```text
Home / Concurrency / Synchronization / Mutex
```

Isso permitirá compreender a localização do conteúdo dentro da estrutura da Wiki.

# 4. Páginas e layouts

A aplicação deverá possuir quatro tipos principais de página.

## 4.1. Homepage

A homepage será a porta de entrada para a plataforma.

Seu objetivo será apresentar a proposta do DevAtlas e facilitar o acesso aos domínios de conhecimento.

### Estrutura visual

```text
+------------------------------------------------------------+
| LOGO       Search                         Theme            |
+------------------+-----------------------------------------+
|                  |                                         |
| HOME             |      VISUAL SOFTWARE ENGINEERING         |
|                  |                                         |
| EXPLORE          |      Understand how software works.     |
|                  |                                         |
| CATEGORIES       |      Explore concepts, patterns and      |
|                  |      architectures through visual       |
|                  |      explanations and interactive labs.|
|                  |                                         |
| Computer Science |      [ Explore Knowledge ]              |
| Concurrency      |                                         |
| System Design    |      --------------------------------   |
| Architecture     |                                         |
| Design Patterns  |      EXPLORE KNOWLEDGE DOMAINS           |
| Distributed Sys. |                                         |
| Infrastructure   |      +-------------+ +-------------+    |
| Databases        |      | Computer    | | System      |    |
| Networking       |      | Science      | | Design      |    |
| Security         |      +-------------+ +-------------+    |
|                  |                                         |
|                  |      +-------------+ +-------------+    |
|                  |      | Architecture | | Concurrency |    |
|                  |      +-------------+ +-------------+    |
|                  |                                         |
|                  |      FEATURED TOPICS                    |
|                  |                                         |
|                  |      [ Topic cards ... ]                |
|                  |                                         |
+------------------+-----------------------------------------+
```

### Seções da homepage

**1. Hero Section**

Apresentação da identidade e proposta da plataforma.

Título sugerido:

"Understand how software works."

Descrição:

"Explore the concepts, patterns and architectures behind modern software engineering through structured knowledge and interactive visualizations."

CTA:

"Explore Knowledge"

**2. Knowledge Domains**

Apresentação das dez categorias em cards.

Cada card deverá conter:

- Ícone representativo.
- Nome da categoria.
- Descrição curta.
- Quantidade de tópicos publicados.

**3. Featured Topics**

Apresentação de conteúdos selecionados.

Exemplos:

- Concurrency vs Parallelism.
- How Load Balancers Work.
- Understanding Event-Driven Architecture.
- Database Indexing.

**4. Learning Paths**

Seção opcional para apresentação de sequências de aprendizado.

Exemplos:

- Software Architecture Fundamentals.
- Introduction to Distributed Systems.
- Backend Engineering Foundations.

Na primeira versão, essas trilhas poderão ser apenas agrupamentos editoriais de conteúdos.

## 4.2. Página de categoria

A página de categoria deverá apresentar os conceitos pertencentes a um domínio específico.

Exemplo: System Design.

### Estrutura visual

```text
+------------------------------------------------------------+
| HEADER                                                     |
+------------------+-----------------------------------------+
| SIDEBAR          | Home / System Design                    |
|                  |                                         |
|                  | SYSTEM DESIGN                           |
|                  |                                         |
|                  | Understand how scalable systems are    |
|                  | designed and implemented.              |
|                  |                                         |
|                  | [ Search within category ]              |
|                  |                                         |
|                  | TOPICS                                  |
|                  |                                         |
|                  | +------------------------------------+  |
|                  | | Load Balancing                     |  |
|                  | | Definition and visual explanation  |  |
|                  | | Beginner                           |  |
|                  | +------------------------------------+  |
|                  |                                         |
|                  | +------------------------------------+  |
|                  | | Caching                            |  |
|                  | | Strategies and implementation      |  |
|                  | | Intermediate                       |  |
|                  | +------------------------------------+  |
|                  |                                         |
|                  | +------------------------------------+  |
|                  | | Message Queues                      |  |
|                  | | Asynchronous communication          |  |
|                  | | Intermediate                       |  |
|                  | +------------------------------------+  |
+------------------+-----------------------------------------+
```

### Elementos

- Nome da categoria.
- Descrição.
- Busca contextual.
- Subcategorias.
- Listagem de tópicos.
- Classificação por dificuldade.
- Tags.
- Acesso aos conteúdos relacionados.

Os tópicos poderão ser apresentados em cards ou listas, conforme a densidade da categoria.

A interface deverá permitir a inclusão de novos assuntos sem exigir alterações no layout.

## 4.3. Página individual de tópico

Esta será a página mais importante de toda a aplicação.

É onde acontecerá a experiência principal de aprendizado.

A prioridade será equilibrar leitura técnica, diagramas e laboratórios interativos.

### Estrutura visual

```text
+------------------------------------------------------------+
| HEADER                                                     |
+------------------+-------------------------------+---------+
| SIDEBAR          | MAIN CONTENT                  | ON THIS  |
|                  |                               | PAGE    |
| Computer Science | Home / Concurrency            |         |
| Concurrency      |                               | Overview|
| System Design    | CONCURRENCY                   | How it  |
| Architecture     |                               | works   |
| Design Patterns  | Concurrency vs Parallelism    |         |
| Distributed Sys. |                               | Visual  |
| Infrastructure   | Understand the difference     | Demo    |
| Databases        | between concurrent execution  |         |
| Networking       | and parallel execution.       |         |
| Security         |                               | When to |
|                  | [ Beginner ] [ 8 min read ]   | use     |
|                  |                               |         |
|                  | 01. OVERVIEW                  | Trade-  |
|                  |                               | offs    |
|                  | Definition and explanation... |         |
|                  |                               |         |
|                  | 02. HOW IT WORKS              |         |
|                  |                               |         |
|                  | Detailed explanation...       |         |
|                  |                               |         |
|                  | 03. VISUAL DEMONSTRATION      |         |
|                  |                               |         |
|                  | [ Interactive visualization ] |         |
|                  |                               |         |
|                  | 04. WHEN TO USE               |         |
|                  |                               |         |
|                  | 05. TRADE-OFFS                |         |
|                  |                               |         |
|                  | 06. RELATED CONCEPTS          |         |
|                  |                               |         |
|                  | 07. REFERENCES                |         |
+------------------+-------------------------------+---------+
```

### Componentes da página

**A. Breadcrumbs**

Identificação da localização do conteúdo.

**B. Topic Header**

Deverá apresentar:

- Categoria.
- Título.
- Descrição.
- Nível de dificuldade.
- Tempo estimado de leitura.
- Tags relevantes.

**C. Article Content**

Área destinada ao conteúdo textual.

Deverá suportar:

- Títulos.
- Parágrafos.
- Listas.
- Tabelas.
- Blocos de código.
- Diagramas.
- Imagens.
- Callouts.
- Comparações.

**D. Table of Contents**

Navegação interna do artigo.

Deverá acompanhar a posição do usuário durante a leitura, destacando a seção atual.

**E. Related Concepts**

Apresentação dos conceitos relacionados ao tópico atual.

**F. References**

Lista de fontes técnicas utilizadas.

## 4.4. Página de busca

A busca deverá permitir localizar conteúdos através de:

- Nome do conceito.
- Palavras-chave.
- Descrição.
- Tags.
- Categoria.

Resultados deverão apresentar título, categoria, descrição e nível de dificuldade.

A busca poderá ser acessada globalmente pelo header.

# 5. Design dos componentes de conteúdo

A padronização dos componentes é fundamental para manter a identidade visual dos artigos.

## 5.1. Text Content

Os textos deverão utilizar largura de leitura controlada.

Recomendações:

- Limitar a largura da coluna principal de leitura.
- Utilizar espaçamento adequado entre seções.
- Manter hierarquia clara de títulos.
- Evitar blocos extensos sem subdivisão.
- Utilizar listas para informações enumeráveis.

## 5.2. Code Blocks

Blocos de código deverão apresentar:

- Linguagem identificada.
- Syntax highlighting.
- Botão de copiar.
- Numeração de linhas quando relevante.
- Tratamento visual para código longo.

## 5.3. Callouts

Componentes para destacar informações importantes.

Tipos:

- Information.
- Tip.
- Warning.
- Important.

Exemplo:

**Important:** Concorrência não significa necessariamente execução simultânea.

## 5.4. Comparison Tables

Tabelas para comparar conceitos, tecnologias e estratégias.

Exemplos:

- SQL vs NoSQL.
- Monolith vs Microservices.
- TCP vs UDP.
- Concurrency vs Parallelism.

## 5.5. Related Concepts Cards

Cards compactos para navegação entre assuntos relacionados.

Deverão apresentar:

- Nome.
- Categoria.
- Descrição curta.
- Nível de dificuldade.

# 6. Visual Learning Engine

O mecanismo de visualização será um dos principais diferenciais técnicos do DevAtlas.

Sua responsabilidade será apresentar representações visuais dos conceitos estudados.

A implementação deverá priorizar componentes reutilizáveis e configurações independentes do conteúdo editorial.

## 6.1. Tipos de visualização

### Type A — Static Diagrams

Diagramas estáticos utilizados para explicar estruturas, relacionamentos e fluxos.

Tecnologias:

- SVG.
- Mermaid.
- React.

Exemplos:

- Arquitetura de microsserviços.
- Estrutura de uma aplicação.
- Modelo OSI.
- Organização de uma árvore de dados.

### Type B — Animated Diagrams

Diagramas animados que demonstram processos ao longo do tempo.

Tecnologias:

- Motion.
- SVG.
- CSS Animations.

Exemplos:

- Concorrência.
- Paralelismo.
- Replicação.
- Comunicação entre serviços.

### Type C — Interactive Simulators

Simuladores que permitem alterar parâmetros e observar mudanças no comportamento do sistema.

Tecnologias:

- React.
- TypeScript.
- Motion.
- SVG ou Canvas.

Exemplos:

- Load Balancer.
- Cache Simulator.
- Thread Scheduler.
- Message Queue.
- Database Indexing.

### Type D — Architecture Playground

Ambientes para explorar componentes e relacionamentos de uma arquitetura.

Tecnologia principal:

- React Flow.

Exemplos:

- Construção de uma arquitetura de microsserviços.
- Fluxo de requisições.
- Distribuição de serviços.
- Comunicação entre componentes.

## 6.2. Estrutura de um laboratório visual

Todo laboratório deverá seguir uma estrutura consistente.

```text
+--------------------------------------------------+
| VISUAL LAB                                       |
|                                                  |
| Title                                            |
| Short description                                |
|                                                  |
| +----------------------------------------------+ |
| |                                              | |
| |                                              | |
| |          VISUALIZATION AREA                  | |
| |                                              | |
| |                                              | |
| +----------------------------------------------+ |
|                                                  |
| [ Play ] [ Pause ] [ Reset ]                     |
|                                                  |
| PARAMETERS                                       |
|                                                  |
| Configuration controls                          |
|                                                  |
| EXPLANATION                                      |
|                                                  |
| Description of current behavior                  |
+--------------------------------------------------+
```

### Comportamentos esperados

- Reproduzir.
- Pausar.
- Reiniciar.
- Avançar etapas, quando aplicável.
- Alterar parâmetros.
- Visualizar mudanças.
- Consultar explicações.

Os simuladores deverão distinguir claramente o que é uma representação conceitual e o que corresponde a uma simulação tecnicamente fiel.

Nem todos os conceitos precisarão de um simulador. Um diagrama estático bem construído poderá ser suficiente em determinados casos.

# 7. Responsividade

A aplicação deverá funcionar em três faixas principais.

## Desktop

- Sidebar permanentemente disponível.
- Header completo.
- Coluna principal de conteúdo.
- Table of Contents lateral em artigos.
- Laboratórios com maior área de visualização.

## Tablet

- Sidebar recolhível.
- Conteúdo com largura adaptável.
- Table of Contents recolhível.
- Laboratórios adaptados à área disponível.

## Mobile

- Navegação através de menu lateral ou drawer.
- Header compacto.
- Conteúdo em coluna única.
- Table of Contents em menu expansível.
- Diagramas com controles de zoom e rolagem quando necessário.
- Controles de simuladores acessíveis ao toque.

A experiência mobile não deverá ser apenas uma redução do desktop. Os componentes deverão ser projetados considerando interação por toque.

# 8. Stack tecnológica

A stack deverá privilegiar produtividade, manutenção e capacidade de expansão.

Não existe necessidade de construir um backend próprio na primeira versão.

## 8.1. Frontend

**Next.js + React + TypeScript**

Responsabilidades:

- Estrutura da aplicação.
- Roteamento.
- Renderização das páginas.
- Componentização.
- Integração dos conteúdos.
- SEO.
- Responsividade.

O Next.js será utilizado com App Router.

A preferência será por renderização estática dos conteúdos sempre que possível, evitando processamento desnecessário em tempo de execução.

## 8.2. Styling

**Tailwind CSS + shadcn/ui**

Tailwind CSS será responsável pela estilização.

shadcn/ui será utilizado como base para componentes de interface, permitindo personalização sem depender de uma biblioteca visual fechada.

Componentes esperados:

- Buttons.
- Inputs.
- Dropdowns.
- Tabs.
- Dialogs.
- Tooltips.
- Navigation Menus.
- Accordions.
- Cards.

Os componentes deverão seguir os tokens visuais definidos neste documento.

## 8.3. Animation

**Motion (antigo Framer Motion)**

Responsável por:

- Transições.
- Animações de elementos.
- Movimentação de diagramas.
- Animações de estados.
- Feedback visual dos simuladores.

Animações deverão ter finalidade explicativa ou funcional.

Não utilizar animações decorativas excessivas.

## 8.4. Interactive Diagrams

**React Flow (@xyflow/react)**

Responsável pela criação de diagramas interativos e fluxos arquiteturais.

Aplicações:

- Componentes de sistemas.
- Conexões entre serviços.
- Arquiteturas.
- Fluxos de requisições.
- Topologias distribuídas.

Para diagramas simples, SVG ou Mermaid deverão ser priorizados. React Flow não deverá ser utilizado indiscriminadamente em todos os artigos.

## 8.5. Documentation Engine

**MDX**

Responsável pelo armazenamento e apresentação dos conteúdos.

MDX permitirá combinar Markdown com componentes React.

Exemplo:

Um artigo poderá possuir explicações textuais, blocos de código, tabelas e um laboratório interativo no mesmo documento.

A organização inicial será baseada em arquivos versionados no repositório.

Sugestão de ferramentas complementares:

- gray-matter: leitura de frontmatter.
- Zod: validação dos metadados.
- Integração MDX do Next.js: compilação e renderização dos documentos.

## 8.6. Search Engine

**Pagefind ou Orama**

Responsável pela busca global.

A implementação inicial deverá utilizar indexação local dos conteúdos, sem exigir um serviço externo.

A escolha final deverá considerar integração com Next.js, suporte a filtros e facilidade de atualização do índice durante o build.

## 8.7. Data Layer

Inicialmente, não haverá banco de dados.

Os conteúdos serão mantidos em arquivos MDX, com metadados estruturados.

Vantagens:

- Versionamento através do Git.
- Facilidade de revisão.
- Baixo custo operacional.
- Publicação simplificada.
- Ausência de infraestrutura adicional.

PostgreSQL poderá ser introduzido futuramente quando houver necessidade de armazenar usuários, favoritos, progresso e outros dados persistentes.

## 8.8. Deployment

**Vercel**

Responsável pela hospedagem e publicação da aplicação Next.js.

A plataforma deverá possuir:

- Ambiente de desenvolvimento.
- Ambiente de preview.
- Ambiente de produção.
- Integração com Git.
- Build automatizado.

---

# 9. Arquitetura técnica da aplicação

A arquitetura inicial será modular e baseada em uma aplicação única.

Não utilizaremos microsserviços.

A separação de responsabilidades ocorrerá dentro do próprio projeto.

## 9.1. Visão arquitetural

```text
                    USER
                      |
                      v
              NEXT.JS APPLICATION
                      |
          +-----------+-----------+
          |                       |
          v                       v
     PRESENTATION             CONTENT ENGINE
          |                       |
    +-----+------+           +----+------+
    |            |           |           |
    v            v           v           v
  UI SYSTEM   VISUAL LABS    MDX      METADATA
    |            |
    |       +----+---------+
    |       |              |
    |       v              v
    |     MOTION         REACT FLOW
    |       |              |
    +-------+--------------+
                      |
                      v
               SEARCH ENGINE
                      |
                      v
                STATIC BUILD
                      |
                      v
                  VERCEL
```

## 9.2. Separação de responsabilidades

**Presentation Layer**

Responsável pelos layouts, componentes e experiência de navegação.

**Content Layer**

Responsável pela leitura, validação, organização e disponibilização dos conteúdos.

**Visualization Layer**

Responsável pelos diagramas, animações e simuladores.

**Search Layer**

Responsável pela indexação e localização de conteúdos.

**Build Layer**

Responsável pela geração das páginas e preparação dos arquivos para publicação.

## 9.3. Organização de diretórios

Estrutura sugerida:

```text
dev-atlas/
|
+-- public/
|   +-- images/
|   +-- icons/
|   +-- diagrams/
|
+-- content/
|   |
|   +-- computer-science/
|   +-- concurrency/
|   +-- system-design/
|   +-- software-architecture/
|   +-- design-patterns/
|   +-- distributed-systems/
|   +-- infrastructure/
|   +-- databases/
|   +-- networking/
|   +-- security/
|
+-- src/
|   |
|   +-- app/
|   |   +-- page.tsx
|   |   +-- explore/
|   |   +-- categories/
|   |   +-- topics/
|   |   +-- search/
|   |   +-- layout.tsx
|   |
|   +-- components/
|   |   +-- layout/
|   |   +-- navigation/
|   |   +-- content/
|   |   +-- ui/
|   |
|   +-- features/
|   |   +-- search/
|   |   +-- categories/
|   |   +-- topics/
|   |
|   +-- visualizations/
|   |   +-- primitives/
|   |   +-- animations/
|   |   +-- simulators/
|   |   +-- architecture/
|   |
|   +-- lib/
|   |   +-- content/
|   |   +-- metadata/
|   |   +-- search/
|   |   +-- utils/
|   |
|   +-- styles/
|       +-- globals.css
|
+-- tests/
|
+-- package.json
+-- tsconfig.json
+-- next.config.ts
```

A organização poderá ser refinada durante a implementação, mantendo as responsabilidades separadas.

# 10. Modelo de conteúdo

Cada tópico deverá possuir um formato de metadados padronizado.

Exemplo de frontmatter:

```yaml
---
title: "Concurrency vs Parallelism"
slug: "concurrency-vs-parallelism"

category: "concurrency"
subcategory: "execution-models"

description: >
  Understand the differences between
  concurrent and parallel execution.

difficulty: "beginner"

readingTime: 8

tags:
  - concurrency
  - parallelism
  - threads

related:
  - race-conditions
  - multithreading
  - event-loop

published: true
---
```

O corpo do arquivo conterá as seções editoriais definidas no Documento 01.

Os metadados deverão ser validados durante o build.

A aplicação não deverá depender de informações duplicadas em diferentes arquivos.

# 11. Arquitetura dos componentes visuais

Os componentes deverão ser agrupados em três níveis.

## 11.1. UI Components

Componentes básicos de interface:

- Button.
- Badge.
- Card.
- Input.
- Tabs.
- Tooltip.
- Dialog.
- Accordion.

## 11.2. Content Components

Componentes utilizados nos artigos:

- ArticleHeader.
- ArticleSection.
- CodeBlock.
- Callout.
- ComparisonTable.
- RelatedConcepts.
- ReferencesList.
- TableOfContents.

## 11.3. Visualization Components

Componentes especializados:

- ExecutionTimeline.
- ThreadScheduler.
- RequestFlow.
- MessageQueueVisualizer.
- CacheVisualizer.
- LoadBalancerSimulator.
- DatabaseIndexVisualizer.
- ArchitectureDiagram.

Cada visualização deverá receber propriedades tipadas e manter sua lógica independente do artigo que a utiliza.

O objetivo é permitir que o mesmo componente seja utilizado em diferentes tópicos.

# 12. Estratégia de qualidade e manutenção

## 12.1. TypeScript

O projeto deverá utilizar TypeScript em modo estrito.

## 12.2. Validação de conteúdo

Metadados e referências deverão ser validados durante o build.

## 12.3. Acessibilidade

Seguir boas práticas de WCAG 2.2 AA, considerando:

- Contraste.
- Navegação por teclado.
- Foco visível.
- Descrições alternativas.
- Semântica HTML.
- Respeito à preferência por movimento reduzido.

## 12.4. Performance

Prioridades:

- Renderização estática quando possível.
- Carregamento sob demanda de simuladores pesados.
- Otimização de imagens.
- Evitar JavaScript desnecessário.
- Divisão de código por funcionalidade.
- Evitar dependências excessivas.

## 12.5. Testes

Estratégia recomendada:

- Vitest para testes unitários.
- Testing Library para componentes.
- Playwright para testes end-to-end.

Os simuladores deverão possuir testes para os comportamentos e regras que representam.

---

# 13. Planejamento de implementação

A implementação técnica seguirá esta sequência.

## Etapa 01 — Project Setup

- Inicialização do Next.js.
- Configuração do TypeScript.
- Configuração do Tailwind CSS.
- Integração do shadcn/ui.
- Configuração de fontes.
- Configuração dos tokens visuais.
- Estrutura inicial de diretórios.

## Etapa 02 — Design System

- Cores.
- Tipografia.
- Espaçamento.
- Bordas.
- Superfícies.
- Componentes básicos.
- Tema claro e escuro.

## Etapa 03 — Application Shell

- Header.
- Sidebar.
- Navegação.
- Breadcrumbs.
- Layout responsivo.

## Etapa 04 — Pages

- Homepage.
- Página de categorias.
- Página de tópico.
- Página de busca.

## Etapa 05 — Content Engine

- Integração MDX.
- Modelo de metadados.
- Validação com Zod.
- Organização dos conteúdos.
- Relacionamento entre tópicos.

## Etapa 06 — Visual Learning Engine

- Componentes SVG.
- Animações com Motion.
- Primeiros simuladores.
- Diagramas interativos.
- Controles de execução.

## Etapa 07 — Search and Refinement

- Indexação.
- Busca global.
- Filtros.
- Responsividade.
- Acessibilidade.
- Otimização de performance.
- Testes.

## Etapa 08 — Initial Publication

- Revisão dos conteúdos.
- Verificação dos links.
- Testes de navegação.
- Build de produção.
- Deploy.

---

# 14. Diretrizes para futuras expansões

A arquitetura deverá permitir que novas funcionalidades sejam incorporadas sem comprometer a aplicação inicial.

Possíveis expansões:

### User System

- Autenticação.
- Perfis.
- Favoritos.
- Progresso de aprendizado.
- Histórico.

### AI Knowledge Assistant

- Integração com LLMs.
- Pipeline RAG.
- Indexação vetorial.
- Recuperação contextual.
- Respostas com referências.

### Community

- Contribuição de conteúdos.
- Revisões.
- Publicação de laboratórios.
- Sistema de colaboração.

Essas funcionalidades não deverão ser implementadas agora.

A arquitetura inicial deverá apenas evitar decisões que tornem essas evoluções excessivamente custosas.

---

# 15. Critérios de conclusão da primeira versão

A implementação será considerada alinhada à especificação quando:

- A identidade visual estiver aplicada de forma consistente.
- A homepage apresentar a proposta da plataforma.
- As dez categorias estiverem disponíveis.
- Os usuários conseguirem navegar entre categorias e tópicos.
- Os artigos seguirem o padrão editorial.
- Os diagramas e simuladores estiverem integrados aos conteúdos.
- A busca global funcionar.
- O tema claro e escuro estiverem disponíveis.
- A aplicação estiver responsiva.
- Os conteúdos forem independentes da camada visual.
- A inclusão de novos tópicos não exigir alterações estruturais.
- A aplicação estiver publicada e acessível.

---

# 16. Decisões técnicas consolidadas

| Camada | Tecnologia |
|---|---|
| Framework | Next.js |
| UI | React |
| Linguagem | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Animações | Motion |
| Diagramas interativos | React Flow |
| Diagramas estáticos | SVG / Mermaid |
| Conteúdo | MDX |
| Metadados | gray-matter + Zod |
| Busca | Pagefind ou Orama |
| Testes unitários | Vitest |
| Testes E2E | Playwright |
| Deploy | Vercel |
| Persistência inicial | Arquivos versionados no Git |
| Banco de dados futuro | PostgreSQL |

---

# 17. Definição final

O DevAtlas deverá ser desenvolvido como uma plataforma de documentação técnica com experiência visual e interativa.

Sua interface será inspirada nas melhores práticas de ferramentas de documentação e desenvolvimento, priorizando clareza, organização e consistência.

Sua arquitetura será baseada em uma aplicação modular, com conteúdo independente da apresentação e componentes reutilizáveis para demonstrações visuais.

A primeira versão deverá permanecer simples, sem autenticação, banco de dados ou inteligência artificial.

O foco será construir uma base sólida de conhecimento, capaz de crescer continuamente através da inclusão de novos conceitos, artigos e laboratórios.

**Diretriz central de design e engenharia: cada novo tópico deverá aproveitar o mesmo sistema de conteúdo, navegação e visualização, mantendo a experiência consistente em toda a plataforma.**
