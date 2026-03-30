# Money Wallet Service MVP

Production-ready backend wallet service for a mobile lending app. Built with Node.js, Express, and TypeScript, featuring atomic transactions, row-level locking, and strong financial controls.

## Features

- User onboarding with blacklist checks (Adjutor API)
- Wallet operations (fund, transfer, withdraw) with atomic transactions
- Row-level locking to prevent race conditions
- Idempotency to prevent duplicate transactions
- DECIMAL precision for money (no float rounding errors)
- Immutable transaction ledger as single source of truth
- Comprehensive error handling with semantic error codes
- Structured logging for monitoring
- Full test coverage (unit + integration tests)

## Architecture

### Layered Design

HTTP Request
↓
Routes (Express routing)
↓
Controllers (HTTP handlers - 5-10 lines each)
↓
Middlewares (Auth, validation, error handling)
↓
Services (Business logic - atomic transactions)
↓
Repositories (Data access - row-level locking)
↓
Database (MySQL with Knex.js)

### Key Design Decisions

| Aspect              | Choice                     | Reasoning                                |
| ------------------- | -------------------------- | ---------------------------------------- |
| Transaction Scoping | Service Layer              | Business logic controls atomicity        |
| Row Locking         | Pessimistic (FOR UPDATE)   | Race-condition free, simple              |
| Money Storage       | DECIMAL(12,2) + Decimal.js | No float rounding errors                 |
| Idempotency         | Unique reference field     | Prevents duplicate transactions on retry |
| Auth                | Mock JWT (Bearer <userId>) | Fast MVP, extendable later               |
| Validation          | Joi/Zod at middleware      | Fail-fast, consistent errors             |
| Errors              | Custom error classes       | Semantic, type-safe responses            |

## Folder Structure

money-wallet/
├── src/
│ ├── server.ts
│ ├── app.ts
│ ├── config/env.ts
│ ├── database/
│ │ ├── knex.ts
│ │ └── migrations/
│ ├── enums/
│ ├── types/
│ ├── utils/
│ ├── middlewares/
│ ├── validators/
│ ├── services/
│ ├── repositories/
│ ├── controllers/
│ ├── routes/
│ └── tests/
├── package.json
├── tsconfig.json
├── jest.config.js
├── knexfile.ts
└── .env.example

## Quick Start

### Install Dependencies

```bash
pnpm install
```

### Setup Environment

```bash
cp .env.example .env
# Update .env with your database credentials
```

### Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE wallet_db;"

# Run migrations
pnpm run migrate
```

### Run Server

```bash
# Development (hot reload)
pnpm run dev

# Production
pnpm run build
pnpm start
```

Server will run on `http://localhost:3000`

### Run Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

---

## API Endpoints

### User Management

**Create User**

```
POST /api/users
```

Body:

```json
{
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Ken"
}
```

- Includes blacklist check via Adjutor API
- Auto-creates wallet on successful registration

**Get User**

```
GET /api/users/:userId
```

- Requires auth (Bearer token)
- Returns user details

---

### Wallet Operations

**Fund Wallet**

```
POST /api/wallet/fund
Authorization: Bearer <userId>
```

Body:

```json
{
  "amount": 5000,
  "reference": "fund-unique-123"
}
```

**Transfer Between Wallets**

```
POST /api/wallet/transfer
Authorization: Bearer <userId>
```

Body:

```json
{
  "toUserId": "recipient-user-id",
  "amount": 2000,
  "reference": "transfer-unique-456"
}
```

**Withdraw from Wallet**

```
POST /api/wallet/withdraw
Authorization: Bearer <userId>
```

Body:

```json
{
  "amount": 1000,
  "reference": "withdraw-unique-789"
}
```

**Get Wallet Balance**

```
GET /api/wallet/:userId
Authorization: Bearer <userId>
```

---

### Transactions

**Get Transaction History**

```
GET /api/transactions/:userId?page=1&limit=20&status=SUCCESS
Authorization: Bearer <userId>
```

**Get Transaction Statistics**

```
GET /api/transactions/:userId/statistics
Authorization: Bearer <userId>
```

---

### Health Check

```
GET /health
```

- No auth required
- Returns server status

---

## Authentication

Authentication for MVP is via a Bearer token:

```
Authorization: Bearer <userId>
```

Example:

```bash
curl -H "Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000, "reference": "fund-123"}' \
  http://localhost:3000/api/wallet/fund
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  is_blacklisted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Wallets Table

```sql
CREATE TABLE wallets (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  balance DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Transactions Table

```sql
CREATE TABLE transactions (
  id VARCHAR(36) PRIMARY KEY,
  type ENUM('FUND', 'TRANSFER', 'WITHDRAW') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL,
  reference VARCHAR(100) UNIQUE NOT NULL,
  sender_wallet_id VARCHAR(36),
  receiver_wallet_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_wallet_id) REFERENCES wallets(id),
  FOREIGN KEY (receiver_wallet_id) REFERENCES wallets(id)
);
```

---

## Core Services

### User Service

- User creation with blacklist check
- Wallet initialization
- Blacklist status verification

### Wallet Service

- Fund wallet with atomic transaction
- Transfer between wallets with row-level locking
- Withdraw wallet balance
- Balance retrieval

### Transaction Service

- Transaction creation and lookup
- Paginated transaction listing
- Statistics and reporting

### Adjutor Service

- Blacklist API integration
- Fail-safe handling for external API issues

---

## Financial Safety Guarantees

1. **Atomic Transactions**: All wallet operations wrapped in `knex.transaction()`
2. **Row-Level Locking**: `SELECT ... FOR UPDATE` to prevent concurrent balance modifications
3. **Idempotency**: Transactions with the same reference return the same result
4. **Decimal Precision**: All financial calculations use DECIMAL(12,2)

---

## Error Handling

All errors return a consistent JSON structure:

```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "details": {}
}
```

### Common Error Codes

| Code                  | HTTP Status | Meaning                  |
| --------------------- | ----------- | ------------------------ |
| VALIDATION_ERROR      | 400         | Invalid request data     |
| AUTHENTICATION_ERROR  | 401         | Invalid or missing token |
| AUTHORIZATION_ERROR   | 403         | Insufficient permissions |
| NOT_FOUND             | 404         | Resource not found       |
| DUPLICATE_EMAIL       | 409         | Email already exists     |
| BLACKLISTED_USER      | 409         | User blacklisted         |
| INSUFFICIENT_BALANCE  | 400         | Wallet balance too low   |
| WALLET_NOT_FOUND      | 404         | Wallet not found         |
| EXTERNAL_API_ERROR    | 503         | Adjutor API failure      |
| INTERNAL_SERVER_ERROR | 500         | Unexpected error         |

---

## Example Workflows

### User Onboarding

```bash
POST /api/users
Content-Type: application/json

{
  "email": "alice@example.com",
  "firstName": "Alice",
  "lastName": "Smith"
}
```

### Fund Wallet

```bash
POST /api/wallet/fund
Authorization: Bearer
Content-Type: application/json

{
  "amount": 5000,
  "reference": "fund-unique-id-123"
}
```

### Transfer Between Wallets

```bash
POST /api/wallet/transfer
Authorization: Bearer
Content-Type: application/json

{
  "toUserId": "",
  "amount": 2000,
  "reference": "transfer-unique-id-456"
}
```

---

## Development

```bash
# Run formatter
pnpm run format

# Type check
pnpm run build

# Development server
pnpm run dev
```

---

## Deployment

### Environment Variables

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=wallet_db
PORT=3000
NODE_ENV=production
ADJUTOR_API_URL=https://adjutor.lendsqr.com/v2/verification/karma
```

### Deployment Steps

1. Set up production database
2. Configure environment variables
3. Run migrations: `pnpm run migrate`
4. Build project: `pnpm run build`
5. Start server: `pnpm start`
6. Monitor logs for errors

---

## Testing

- **Unit Tests**: Services tested for all wallet operations, user onboarding, and blacklist handling
- **Integration Tests**: Full API flows including concurrency, idempotency, and error cases
- **Coverage**: Target 80%+ for critical services

---

## Author

**Chidera Nwogu**  
Backend engineer specializing in Node.js, TypeScript, and financial systems.

---

## License

MIT
