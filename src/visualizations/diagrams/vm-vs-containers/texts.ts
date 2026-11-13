import type { Locale } from '@/lib/i18n/types'

const en = {
  title: 'Virtual machines and containers on the same hardware',
  description:
    'Both isolate applications from each other. What differs is the layer that is virtualized, and therefore where the kernel is.',
  stacks: {
    vms: {
      title: 'Virtual machines',
      note: 'isolated by the hypervisor',
      unit: 'VM {n}',
      svgTitle: 'Layers of a host running two virtual machines',
      svgDescription:
        'Bottom to top: hardware, then a hypervisor, then two virtual machines. Each virtual machine contains a guest operating system with its own kernel, libraries and one application.',
    },
    containers: {
      title: 'Containers',
      note: 'isolated by namespaces + cgroups',
      unit: 'Container {n}',
      svgTitle: 'Layers of a host running three containers',
      svgDescription:
        'Bottom to top: hardware, then the host operating system with the single kernel shared by every container, then the container runtime, then three containers. Each container contains only libraries and one application.',
    },
  },
  layers: {
    hardware: 'Hardware',
    hypervisor: 'Hypervisor',
    hostOs: 'Host OS',
    runtime: 'Container runtime',
    guestOs: 'Guest OS',
    libs: 'Libs',
    app: 'App',
  },
  kernelNotes: {
    hostOs: 'one kernel, shared by all',
    guestOs: 'its own kernel',
  },
  legend: {
    kernel: 'Operating system with a kernel',
    app: 'Application',
    libs: 'Its libraries and dependencies',
    boundary: 'Isolation boundary',
  },
  explanation:
    'Look for the kernel in each stack. Every virtual machine boots a complete guest operating system, with its own kernel, on hardware virtualized by the hypervisor. A container is a process of the host: all of them call the same kernel, which uses namespaces to restrict what each one can see and cgroups to limit how much it can use. The runtime prepares that context and starts the process; once the container runs, its system calls go straight to the shared kernel. Without a guest operating system per application, more containers than virtual machines fit on the same hardware.',
}

const pt: typeof en = {
  title: 'Máquinas virtuais e containers no mesmo hardware',
  description:
    'Ambos isolam as aplicações umas das outras. O que muda é a camada que é virtualizada e, por isso, onde está o kernel.',
  stacks: {
    vms: {
      title: 'Máquinas virtuais',
      note: 'isoladas pelo hypervisor',
      unit: 'VM {n}',
      svgTitle: 'Camadas de um host executando duas máquinas virtuais',
      svgDescription:
        'De baixo para cima: hardware, depois um hypervisor, depois duas máquinas virtuais. Cada máquina virtual contém um sistema operacional convidado com seu próprio kernel, bibliotecas e uma aplicação.',
    },
    containers: {
      title: 'Containers',
      note: 'isolados por namespaces + cgroups',
      unit: 'Container {n}',
      svgTitle: 'Camadas de um host executando três containers',
      svgDescription:
        'De baixo para cima: hardware, depois o sistema operacional do host com o único kernel compartilhado por todos os containers, depois o container runtime, depois três containers. Cada container contém apenas bibliotecas e uma aplicação.',
    },
  },
  layers: {
    hardware: 'Hardware',
    hypervisor: 'Hypervisor',
    hostOs: 'SO do host',
    runtime: 'Container runtime',
    guestOs: 'SO convidado',
    libs: 'Libs',
    app: 'App',
  },
  kernelNotes: {
    hostOs: 'um kernel, compartilhado por todos',
    guestOs: 'kernel próprio',
  },
  legend: {
    kernel: 'Sistema operacional com kernel',
    app: 'Aplicação',
    libs: 'Suas bibliotecas e dependências',
    boundary: 'Fronteira de isolamento',
  },
  explanation:
    'Procure o kernel em cada pilha. Cada máquina virtual inicializa um sistema operacional convidado completo, com seu próprio kernel, sobre hardware virtualizado pelo hypervisor. Um container é um processo do host: todos chamam o mesmo kernel, que usa namespaces para restringir o que cada um pode ver e cgroups para limitar quanto cada um pode consumir. O runtime prepara esse contexto e inicia o processo; com o container rodando, suas chamadas de sistema vão direto ao kernel compartilhado. Sem um sistema operacional convidado por aplicação, cabem mais containers do que máquinas virtuais no mesmo hardware.',
}

export const texts: Record<Locale, typeof en> = { en, pt }
