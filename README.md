# Order Management API

API REST para gestão de pedidos de laboratório com autenticação JWT, desenvolvida como desafio técnico backend.

## 🚀 Tecnologias

- **Runtime:** [Bun](https://bun.sh) 1.2.19
- **Linguagem:** TypeScript 5
- **Framework:** Express 5.2.1
- **Banco de Dados:** MongoDB com Mongoose 9.0.2
- **Autenticação:** JWT (jsonwebtoken 9.0.3)
- **Hash de Senha:** bcryptjs 3.0.3
- **Testes:** Vitest 4.0.16
- **Documentação:** Swagger (swagger-ui-express 5.0.1, swagger-jsdoc 6.2.8)

## 📋 Pré-requisitos

- Bun instalado ([instalação](https://bun.sh/docs/installation))
- MongoDB em execução (local ou remoto)
- Node.js 18+ (caso não use Bun)

## 🔧 Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd order-management-challenge

# Instale as dependências
bun install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações
```

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3333

# MongoDB
MONGO_URI=mongodb://localhost:27017/order-management

# JWT
JWT_SECRET=your-secret-key-here
```

## 🏃 Executando o Projeto

```bash
# Modo desenvolvimento
bun run dev

# O servidor estará disponível em http://localhost:3333
```

## 🧪 Executando os Testes

```bash
# Executar todos os testes
bun test

# Executar testes em modo watch
bunx vitest watch
```

## 📚 Documentação Swagger

A documentação interativa da API está disponível em:

```
http://localhost:3333/docs
```

No Swagger UI você pode:

- Visualizar todos os endpoints
- Testar requisições diretamente
- Autenticar usando JWT Bearer Token
- Ver exemplos de requisições e respostas

## 🏗️ Arquitetura

Este projeto utiliza **arquitetura por domínio** (Domain-Driven Design), organizando o código em módulos independentes que representam contextos delimitados do negócio.

### Por que Arquitetura por Domínio?

A escolha por arquitetura por domínio ao invés de arquitetura por camadas tradicionais (controllers → services → repositories) traz benefícios práticos para projetos que crescem em complexidade:

**1. Coesão e Acoplamento**

- Cada módulo (auth, orders, users) agrupa todas as suas responsabilidades relacionadas
- Reduz acoplamento entre diferentes contextos de negócio
- Facilita identificação de onde cada regra de negócio está implementada

**2. Escalabilidade**

- Novos domínios podem ser adicionados sem impactar módulos existentes
- Equipes podem trabalhar em módulos diferentes com menor risco de conflitos
- Facilita a evolução independente de cada contexto

**3. Manutenibilidade**

- Código relacionado fica próximo, seguindo o princípio de proximidade
- Mudanças em um domínio não afetam outros domínios
- Facilita refatorações e testes isolados

**4. Clareza de Responsabilidades**

- Cada módulo expõe claramente suas dependências externas
- Regras de negócio ficam encapsuladas dentro do seu contexto
- Facilita onboarding de novos desenvolvedores

**Estrutura de um módulo:**

```
src/modules/{domain}/
├── {domain}.types.ts      # Tipos e interfaces
├── {domain}.model.ts      # Schema Mongoose
├── {domain}.repository.ts # Acesso a dados
├── {domain}.service.ts    # Lógica de negócio
├── {domain}.controller.ts  # Handlers HTTP
├── {domain}.routes.ts     # Definição de rotas
└── tests/                 # Testes do módulo
```

Esta estrutura permite que cada módulo seja auto-contido e possa evoluir independentemente, enquanto mantém a separação clara de responsabilidades dentro do próprio módulo.

## 📦 Estrutura do Projeto

```
src/
├── modules/
│   ├── auth/              # Módulo de autenticação
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.middleware.ts
│   │   ├── auth.routes.ts
│   │   └── auth.types.ts
│   ├── orders/            # Módulo de pedidos
│   │   ├── order.controller.ts
│   │   ├── order.service.ts
│   │   ├── order.repository.ts
│   │   ├── order.model.ts
│   │   ├── order.state-machine.ts
│   │   ├── order.routes.ts
│   │   ├── order.types.ts
│   │   └── tests/
│   └── users/             # Módulo de usuários
│       ├── user.model.ts
│       ├── user.repository.ts
│       └── user.types.ts
├── shared/                # Código compartilhado
│   ├── errors/
│   ├── swagger.ts
│   └── database.ts
├── app.ts                 # Configuração do Express
└── index.ts              # Entry point
```

## 📝 Regras de Negócio

### Autenticação

- Usuários são criados com email único e senha hasheada (bcrypt)
- Login retorna token JWT válido por 24 horas
- Rotas de pedidos exigem autenticação via Bearer Token

### Pedidos (Orders)

**Criação:**

- Todo pedido é criado com `state: CREATED` e `status: ACTIVE`
- Deve conter pelo menos um serviço
- Valor total dos serviços deve ser maior que zero
- Campos obrigatórios: `lab`, `patient`, `customer`, `services[]`

**Fluxo de Estados:**

- Transição estrita: `CREATED` → `ANALYSIS` → `COMPLETED`
- Não é possível pular etapas ou retroceder
- Pedidos em `COMPLETED` não podem avançar (erro 409)

**Serviços:**

- Cada serviço possui: `name`, `value`, `status`
- Status padrão: `PENDING`
- Status permitidos: `PENDING` | `DONE`

## 🔌 Endpoints

### Autenticação

#### `POST /auth/register`

Registra um novo usuário.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `POST /auth/login`

Autentica um usuário existente.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Pedidos (Requer Autenticação)

#### `POST /orders`

Cria um novo pedido.

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "lab": "Laboratório ABC",
  "patient": "João Silva",
  "customer": "Maria Santos",
  "services": [
    {
      "name": "Exame de Sangue",
      "value": 150.0,
      "status": "PENDING"
    }
  ]
}
```

**Response (201):**

```json
{
  "id": "678fabcd1234567890",
  "lab": "Laboratório ABC",
  "patient": "João Silva",
  "customer": "Maria Santos",
  "state": "CREATED",
  "status": "ACTIVE",
  "services": [
    {
      "name": "Exame de Sangue",
      "value": 150.0,
      "status": "PENDING"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /orders`

Lista pedidos com paginação e filtro opcional.

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `page` (number, opcional): Número da página (padrão: 1)
- `limit` (number, opcional): Itens por página (padrão: 10, máximo: 100)
- `state` (string, opcional): Filtrar por estado (`CREATED`, `ANALYSIS`, `COMPLETED`)

**Exemplo:**

```
GET /orders?page=1&limit=10&state=CREATED
```

**Response (200):**

```json
{
  "data": [
    {
      "id": "678fabcd1234567890",
      "lab": "Laboratório ABC",
      "patient": "João Silva",
      "customer": "Maria Santos",
      "state": "CREATED",
      "status": "ACTIVE",
      "services": [...],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### `PATCH /orders/:id/advance`

Avança o estado do pedido seguindo o fluxo: `CREATED` → `ANALYSIS` → `COMPLETED`.

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "id": "678fabcd1234567890",
  "state": "ANALYSIS",
  ...
}
```

**Erros:**

- `404`: Pedido não encontrado
- `409`: Pedido já está no estado final (COMPLETED)

## 🧪 Testes

O projeto inclui testes unitários para a lógica de transição de estados dos pedidos:

```bash
bun test
```

**Cobertura:**

- State Machine: Transições válidas e bloqueio de transições inválidas
- Validação de regras de negócio

Os testes são isolados, sem dependência de banco de dados ou Express.

## 📊 Modelos de Dados

### User

```typescript
{
  email: string; // único, lowercase
  password: string; // hasheado com bcrypt
  createdAt: Date;
  updatedAt: Date;
}
```

### Order

```typescript
{
  lab: string;
  patient: string;
  customer: string;
  state: "CREATED" | "ANALYSIS" | "COMPLETED";
  status: "ACTIVE" | "DELETED";
  services: ServiceItem[];
  createdAt: Date;
  updatedAt: Date;
}
```

### ServiceItem

```typescript
{
  name: string;
  value: number; // mínimo: 0
  status: "PENDING" | "DONE";
}
```

## 🔒 Segurança

- Senhas são hasheadas com bcrypt (10 rounds)
- Tokens JWT com expiração de 24 horas
- Rotas protegidas validam token via middleware
- Validação de dados de entrada nos endpoints

## 📄 Licença

Este projeto foi desenvolvido como desafio técnico.
