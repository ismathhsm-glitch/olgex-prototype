# OLGAX Invoice

## Invoicing, Billing & Payments System

**IN2901 – Software Development Project**
**Batch 24 – Level 2**
**Faculty of Information Technology – University of Moratuwa**

---

## 📌 Project Information

| Details      | Information                                          |
| ------------ | ---------------------------------------------------- |
| Project      | OLGAX Invoice – Invoicing, Billing & Payments System |
| Assigned By  | OLGAX – Open Launchpad for Growth and Execution      |
| Module       | IN2901 – Software Development Project                |
| Batch        | 24 – Level 2                                         |
| Group Number | 19 (IT)                                              |
| Group Name   | LogiCore                                             |
| Supervisor   | Ms. M N Chandimali                                   |
| Faculty      | Faculty of Information Technology                    |
| University   | University of Moratuwa                               |

---

# 📖 Project Overview

**OLGAX (Open Launchpad for Growth and Execution)** is an open-source initiative focused on developing free and self-hostable business software for small businesses, freelancers, and independent entrepreneurs.

Its goal is to provide affordable alternatives to expensive commercial business software while allowing organizations to maintain ownership and control of their data.

**Olgax POS** is the existing open-source Point of Sale system within the OLGAX ecosystem.

**OLGAX Invoice** extends this ecosystem by providing a modern invoicing, billing, payment, expense management, reporting, and client portal solution.

The system follows a clearly separated architecture consisting of:

```text
Frontend → REST API → Backend → Database
```

This separation allows the frontend, backend, and database layers to be developed, tested, and evaluated independently.

---

# 🎯 Project Objectives

The main objective of OLGAX Invoice is to develop a modern, secure, and user-friendly invoicing and financial management system that enables businesses to:

* Create and manage client information
* Generate quotations and invoices
* Receive and track payments
* Record and manage business expenses
* Generate tax summaries and financial reports
* Provide clients with a secure portal
* Allow clients to view and pay invoices
* Manage users and roles
* Manage organization settings securely
* Provide financial insights through an interactive dashboard

---

# 🧩 Project Modules

The project is divided into four major modules.

### 1. User & Organization Management

Responsible for authentication, authorization, users, roles, and organization settings.

**Main functionalities:**

* User registration
* User login
* Password reset
* User profile management
* User management
* Role management
* JWT authentication
* Role-Based Access Control (RBAC)
* Session management
* Organization settings

**Assigned Member:** Ismath H

---

### 2. Client, Quote & Invoice Management

Responsible for managing clients, quotations, invoices, taxes, discounts, and PDF generation.

**Main functionalities:**

* Client management
* Client CRUD operations
* Quotation management
* Invoice management
* Invoice builder
* Multi-line invoice items
* Tax calculation
* Discount calculation
* Quote-to-invoice conversion
* Invoice PDF generation
* Quotation PDF generation
* Invoice lifecycle management

**Assigned Member:** Dilshan WGA

---

### 3. Payments & Expense Management

Responsible for payment tracking, expense management, refunds, and payment reminders.

**Main functionalities:**

* Payment recording
* Payment history
* Partial payments
* Refund management
* Expense management
* Expense categories
* Receipt upload
* Payment reminders
* Payment gateway integration

**Planned Payment Gateways:**

* Stripe
* PayPal

**Assigned Member:** Jahan NS

---

### 4. Reports, Dashboard & Client Portal

Responsible for financial analytics, reports, tax summaries, client access, and notifications.

**Main functionalities:**

* Business dashboard
* Revenue analytics
* Expense analytics
* Financial reports
* Tax summaries
* Outstanding invoice reports
* Client portal
* Invoice viewing
* Online invoice payment
* Notification center

**Assigned Member:** Shifka MF

---

# ✨ Key Features

## 👤 User & Organization

* Secure authentication
* JWT-based authorization
* Role-Based Access Control
* User management
* Organization management
* Profile management

## 👥 Client Management

* Create clients
* Update clients
* Delete clients
* View client details
* Client invoice history
* Client quotation history

## 📝 Quotation Management

* Create quotations
* Edit quotations
* Delete quotations
* Add multiple items
* Apply discounts
* Calculate taxes
* Generate PDF
* Convert quotation to invoice

## 🧾 Invoice Management

* Create invoices
* Edit invoices
* Delete invoices
* Dynamic invoice builder
* Multiple invoice items
* Tax calculation
* Discount calculation
* Invoice status tracking
* PDF generation
* Overdue invoice tracking

## 💳 Payment Management

* Record payments
* View payment history
* Track outstanding payments
* Partial payment support
* Refund management
* Payment reminders
* Payment gateway integration

## 💰 Expense Management

* Create expenses
* Update expenses
* Delete expenses
* Expense categories
* Receipt upload
* Expense tracking

## 📊 Dashboard & Reports

* Total revenue
* Accounts receivable
* Outstanding balances
* Overdue balances
* Operating expenses
* Net profit
* Revenue charts
* Expense charts
* Financial reports
* Tax summaries

## 🌐 Client Portal

Clients can securely:

* Login to the client portal
* View their invoices
* View invoice details
* Check payment status
* Make invoice payments
* View payment history
* Receive notifications

---

# 🏗️ System Architecture

```text
┌─────────────────────────────┐
│          Frontend           │
│     React + TypeScript      │
│      Vite + Tailwind        │
└──────────────┬──────────────┘
               │
               │ REST API / HTTP
               ▼
┌─────────────────────────────┐
│          Backend            │
│       ASP.NET Core          │
│          REST API            │
│      JWT Authentication      │
└──────────────┬──────────────┘
               │
               │ Entity Framework Core
               ▼
┌─────────────────────────────┐
│          Database           │
│           SQLite            │
│      PostgreSQL Ready       │
└─────────────────────────────┘
```

---

# 🛠️ Technology Stack



* SQLite for current development
* PostgreSQL as the target production database

## Development Tools

* Git
* GitHub
* Visual Studio Code
* .NET CLI
* npm
* Postman

---

# 📂 Project Structure

```text
olgax-invoice/
│
├── backend/
│   └── OlgaxInvoice.API/
│       │
│       ├── Controllers/
│       ├── Services/
│       ├── Models/
│       ├── Data/
│       ├── DTOs/
│       ├── Migrations/
│       ├── Program.cs
│       └── OlgaxInvoice.API.csproj
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

# 🚀 Installation & Setup

## Prerequisites

Make sure the following are installed:

* .NET SDK
* Node.js
* npm
* Git

---

# ⚙️ Backend Setup

Navigate to the backend directory:

```bash
cd backend/OlgaxInvoice.API
```

Restore dependencies:

```bash
dotnet restore
```

Build the backend:

```bash
dotnet build
```

Run the API:

```bash
dotnet run
```

Backend API:

```text
http://localhost:5048
```

---

# 💻 Frontend Setup

Open a new terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Frontend application:

```text
http://localhost:5174
```

---

# 🧪 Build & Quality Checks

## Backend Build

The backend is verified using:

```bash
dotnet build
```

Current build status:

```text
✅ Build Passed
✅ 0 Warnings
✅ 0 Errors
```

---

## Frontend Build

The frontend is verified using:

```bash
npm run build
```

Current status:

```text
✅ TypeScript Check Passed
✅ Vite Build Passed
```

---

## Linting

Run:

```bash
npm run lint
```

Current status:

```text
✅ 0 Errors
⚠️ 11 Non-blocking React Compiler/Hook Warnings
```

---

# 🌐 Development URLs

| Service     | URL                           |
| ----------- | ------------------------------ |
| Frontend    | http://localhost:5174         |
| Backend API | http://localhost:5048         |
| Swagger API | http://localhost:5048/swagger |

> Swagger availability depends on the current backend environment configuration.

---

# 🔄 Application Workflow

```text
User Login
    │
    ▼
Dashboard
    │
    ├───────────────┐
    ▼               ▼
Clients          Organization
    │
    ▼
Quotations
    │
    │ Convert
    ▼
Invoices
    │
    ▼
Payments
    │
    ├── Full Payment
    ├── Partial Payment
    └── Refund
    │
    ▼
Financial Reports
    │
    ▼
Dashboard Analytics
```

---

# 🔐 Security

The system is designed with security as a core requirement.

Security mechanisms include:

* JWT Authentication
* Role-Based Access Control (RBAC)
* Authorized API endpoints
* Secure session handling
* Input validation
* Protected client portal
* Environment-based configuration
* Sensitive credential protection

Sensitive information such as:

```text
API Keys
Passwords
Database Credentials
JWT Secrets
Payment Gateway Credentials
```

must not be committed to the Git repository.

---

# 🗄️ Database

The system follows a relational database architecture.

Core entities include:

```text
User
Organization
Role
Client
Quotation
QuotationItem
Invoice
InvoiceItem
Payment
Expense
ExpenseCategory
Notification
```

The current development environment uses:

```text
SQLite
```

The system architecture is designed to support:

```text
PostgreSQL
```

for production deployment.

---

# 👨‍👩‍👧‍👦 Team Members

| No. | Index No. | Name        | Assigned Module                    |
| --: | --------- | ----------- | ----------------------------------- |
|   1 | 244080N   | Ismath H    | User & Organization Management     |
|   2 | 244198H   | Dilshan WGA | Client, Quote & Invoice Management |
|   3 | 244046R   | Jahan NS    | Payments & Expense Management      |
|   4 | 244081T   | Shifka MF   | Reports, Dashboard & Client Portal |

---

# 🎓 Academic Information

**Bachelor of Science Honours in Information Technology**

Faculty of Information Technology
University of Moratuwa

### Module

```text
IN2901 – Software Development Project
Batch 24 – Level 2
```

### Project

```text
OLGAX Invoice
Invoicing, Billing & Payments System
```

### Group

```text
Group 19 (IT)
LogiCore
```

### Supervisor

```text
Ms. M N Chandimali
```

---

# 📌 Project Development Goals

The project aims to deliver a complete business management solution covering:

```text
Authentication
      ↓
Organization Management
      ↓
Client Management
      ↓
Quotation Management
      ↓
Invoice Management
      ↓
Payment Management
      ↓
Expense Management
      ↓
Reports & Analytics
      ↓
Client Portal
```

The system is intended to become a reusable component of the **OLGAX open-source business software ecosystem**.

---

# 📈 Current Development Status

### Backend

```text
✅ ASP.NET Core REST API
✅ Backend build successful
✅ 0 build warnings
✅ 0 build errors
✅ API running successfully
```

### Frontend

```text
✅ React + TypeScript
✅ Vite
✅ Production build successful
✅ TypeScript validation successful
✅ ESLint: 0 errors
⚠️ 11 non-blocking React compiler/hook warnings
✅ Development server running
```

### Integration

```text
Frontend
   ↓
REST API
   ↓
Backend Services
   ↓
Entity Framework Core
   ↓
Database
```

---

# 📝 License

This project is developed as part of the **IN2901 – Software Development Project** at the **Faculty of Information Technology, University of Moratuwa**, under the OLGAX University Mentorship Program.

---

# ⭐ OLGAX Invoice

**Modern • Secure • Open Source • Self-Hostable**

A complete invoicing, billing, payment, expense, reporting, and client portal solution designed for small businesses, freelancers, and independent entrepreneurs.
