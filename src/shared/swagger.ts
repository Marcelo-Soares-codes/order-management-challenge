import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Order Management API",
      version: "1.0.0",
      description: "API para gestão de pedidos com autenticação JWT",
    },
    servers: [
      {
        url: "http://localhost:3333",
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT obtido através do login",
        },
      },
      schemas: {
        RegisterDTO: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
          },
        },
        LoginDTO: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              example:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzhmYWJjZGUxMjM0NTY3ODkwIiwiaWF0IjoxNzAwMDAwMDAwfQ.example",
            },
          },
        },
        ServiceItem: {
          type: "object",
          required: ["name", "value"],
          properties: {
            name: {
              type: "string",
              example: "Exame de Sangue",
            },
            value: {
              type: "number",
              minimum: 0,
              example: 150.0,
            },
            status: {
              type: "string",
              enum: ["PENDING", "DONE"],
              example: "PENDING",
            },
          },
        },
        CreateOrderDTO: {
          type: "object",
          required: ["lab", "patient", "customer", "services"],
          properties: {
            lab: {
              type: "string",
              example: "Laboratório ABC",
            },
            patient: {
              type: "string",
              example: "João Silva",
            },
            customer: {
              type: "string",
              example: "Maria Santos",
            },
            services: {
              type: "array",
              minItems: 1,
              items: {
                $ref: "#/components/schemas/ServiceItem",
              },
            },
            state: {
              type: "string",
              enum: ["CREATED", "ANALYSIS", "COMPLETED"],
              example: "CREATED",
            },
            status: {
              type: "string",
              enum: ["ACTIVE", "DELETED"],
              example: "ACTIVE",
            },
          },
        },
        OrderResponse: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "678fabcd1234567890",
            },
            lab: {
              type: "string",
              example: "Laboratório ABC",
            },
            patient: {
              type: "string",
              example: "João Silva",
            },
            customer: {
              type: "string",
              example: "Maria Santos",
            },
            state: {
              type: "string",
              enum: ["CREATED", "ANALYSIS", "COMPLETED"],
              example: "CREATED",
            },
            status: {
              type: "string",
              enum: ["ACTIVE", "DELETED"],
              example: "ACTIVE",
            },
            services: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ServiceItem",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: {
              type: "number",
              example: 1,
            },
            limit: {
              type: "number",
              example: 10,
            },
            total: {
              type: "number",
              example: 100,
            },
            totalPages: {
              type: "number",
              example: 10,
            },
          },
        },
        ListOrdersResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderResponse",
              },
            },
            meta: {
              $ref: "#/components/schemas/PaginationMeta",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Endpoints de autenticação",
      },
      {
        name: "Orders",
        description: "Endpoints de gestão de pedidos",
      },
    ],
    paths: {
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Registrar novo usuário",
          description: "Cria um novo usuário e retorna um token JWT",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterDTO",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Usuário criado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AuthResponse",
                  },
                },
              },
            },
            "409": {
              description: "Email já cadastrado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "400": {
              description: "Dados inválidos",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Fazer login",
          description: "Autentica um usuário e retorna um token JWT",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginDTO",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Login realizado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AuthResponse",
                  },
                },
              },
            },
            "401": {
              description: "Credenciais inválidas",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "400": {
              description: "Dados inválidos",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/orders": {
        post: {
          tags: ["Orders"],
          summary: "Criar novo pedido",
          description:
            "Cria um novo pedido com state=CREATED e status=ACTIVE. Requer autenticação.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateOrderDTO",
                },
                example: {
                  lab: "Laboratório ABC",
                  patient: "João Silva",
                  customer: "Maria Santos",
                  services: [
                    {
                      name: "Exame de Sangue",
                      value: 150.0,
                      status: "PENDING",
                    },
                  ],
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Pedido criado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/OrderResponse",
                  },
                },
              },
            },
            "400": {
              description:
                "Dados inválidos (sem serviços ou valor total zerado)",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "401": {
              description: "Token de autenticação inválido ou ausente",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
        get: {
          tags: ["Orders"],
          summary: "Listar pedidos",
          description:
            "Lista pedidos com paginação e filtro opcional por state. Requer autenticação.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "page",
              in: "query",
              description: "Número da página",
              required: false,
              schema: {
                type: "number",
                minimum: 1,
                default: 1,
                example: 1,
              },
            },
            {
              name: "limit",
              in: "query",
              description: "Itens por página",
              required: false,
              schema: {
                type: "number",
                minimum: 1,
                maximum: 100,
                default: 10,
                example: 10,
              },
            },
            {
              name: "state",
              in: "query",
              description: "Filtrar por estado do pedido",
              required: false,
              schema: {
                type: "string",
                enum: ["CREATED", "ANALYSIS", "COMPLETED"],
                example: "CREATED",
              },
            },
          ],
          responses: {
            "200": {
              description: "Lista de pedidos retornada com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ListOrdersResponse",
                  },
                },
              },
            },
            "401": {
              description: "Token de autenticação inválido ou ausente",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/orders/{id}/advance": {
        patch: {
          tags: ["Orders"],
          summary: "Avançar estado do pedido",
          description:
            "Avança o estado do pedido seguindo o fluxo: CREATED → ANALYSIS → COMPLETED. Requer autenticação.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID do pedido",
              schema: {
                type: "string",
                example: "678fabcd1234567890",
              },
            },
          ],
          responses: {
            "200": {
              description: "Estado do pedido avançado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/OrderResponse",
                  },
                },
              },
            },
            "404": {
              description: "Pedido não encontrado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "409": {
              description: "Pedido já está no estado final (COMPLETED)",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            "401": {
              description: "Token de autenticação inválido ou ausente",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
