# Customer Manager

Aplicação frontend para gerenciamento de clientes desenvolvida como teste técnico utilizando Angular 20, com foco em arquitetura moderna, componentização, performance e boas práticas de engenharia de software.

---

# Objetivo do Projeto

O projeto simula um sistema de gestão de clientes, permitindo operações completas de CRUD com persistência local, validações customizadas e experiência de usuário otimizada.

A proposta foi desenvolver uma aplicação organizada, escalável e preparada para evolução futura, seguindo padrões utilizados em aplicações corporativas.

---

# Tecnologias Utilizadas

- Angular 20
- TypeScript
- Angular Material
- RxJS
- Angular Signals
- Reactive Forms
- SCSS
- localStorage

---

# Principais Funcionalidades

- Listagem de clientes
- Cadastro de clientes
- Edição reutilizando o mesmo formulário
- Exclusão com confirmação via dialog
- Busca em tempo real por nome ou e-mail
- Validação de CPF/CNPJ com algoritmo oficial
- Persistência de dados com localStorage
- Feedback visual com Snackbar
- Interface responsiva
- Lazy loading nas rotas

---

# Como Executar o Projeto

## Pré-requisitos

- Node.js 18+
- Angular CLI 20+

## Instalação

```bash
git clone https://github.com/devjeverson/customer-manager.git

cd customer-manager

npm install
```

## Executando em ambiente de desenvolvimento

```bash
ng serve
```

Acesse:

```bash
http://localhost:4200
```

---

# Estrutura do Projeto

```bash
src/app/
├── core/
│   └── services/
│       └── customer.service.ts
│
├── models/
│   └── customer.model.ts
│
├── shared/
│   ├── components/
│   │   └── confirm-dialog/
│   ├── validators/
│   │   └── document.validator.ts
│   └── pipes/
│       └── document-mask.pipe.ts
│
├── features/
│   ├── customer-list/
│   └── customer-form/
│
└── app.routes.ts
```

---

# Decisões Técnicas

## Angular Standalone

A aplicação utiliza standalone components, eliminando a necessidade de NgModules e reduzindo boilerplate da aplicação.

## Reactive Forms

Escolhido para proporcionar maior controle sobre validações, estado do formulário e escalabilidade.

## Signals + RxJS

A combinação de `BehaviorSubject`, `toSignal()` e `computed()` foi utilizada para criar um fluxo reativo simples, performático e de fácil manutenção.

## localStorage

Utilizado como camada de persistência para o contexto do teste técnico, mantendo a arquitetura preparada para futura integração com API REST.

## Angular Material

Adotado para garantir consistência visual, acessibilidade e maior produtividade no desenvolvimento da interface.

---

# Diferenciais Implementados

- Arquitetura organizada por features
- Componentes reutilizáveis
- Dialog genérico de confirmação
- Filtro reativo com debounce
- Separação de responsabilidades
- Código preparado para escalabilidade
- Validação manual de CPF/CNPJ sem dependências externas

---

# Melhorias Futuras

- Integração com API REST
- Paginação e ordenação
- Filtro por status
- Máscara automática para CPF/CNPJ
- Testes unitários e E2E
- Dockerização
- Pipeline CI/CD
- Exportação CSV/PDF
- Autenticação e autorização

---

# Autor

Jeverson Oliveira  
Pós-graduando em Engenharia de Software  
Desenvolvedor Frontend e Full Stack