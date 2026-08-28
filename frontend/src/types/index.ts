export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  organizationId: string;
  role: string;
  user: UserSummary;
}

export interface Organization {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxNumber?: string;
  currency: string;
  invoicePrefix: string;
}

export interface UpdateOrganizationRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxNumber?: string;
  currency: string;
  invoicePrefix: string;
}

export interface Client {
  id: string;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
}

export interface CreateClientRequest {
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
}

export const QuoteStatus = {
  Draft: 0,
  Sent: 1,
  Accepted: 2,
  Rejected: 3,
  Converted: 4,
} as const;

export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];

export interface QuoteItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount?: number;
  total?: number;
}

export interface Quote {
  id: string;
  clientId: string;
  clientName: string;
  quoteNumber: string;
  quoteDate: string;
  expiryDate: string;
  status: QuoteStatus;
  subtotal: number;
  discount: number;
  taxAmount: number;
  total: number;
  items: QuoteItem[];
}

export interface CreateQuoteRequest {
  clientId: string;
  quoteNumber: string;
  quoteDate: string;
  expiryDate: string;
  status: QuoteStatus;
  items: QuoteItem[];
}

export const InvoiceStatus = {
  Draft: 0,
  Sent: 1,
  PartiallyPaid: 2,
  Paid: 3,
  Overdue: 4,
  Cancelled: 5,
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount?: number;
  total?: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotal: number;
  discount: number;
  taxAmount: number;
  total: number;
  paidAmount: number;
  balance: number;
  items: InvoiceItem[];
}

export interface CreateInvoiceRequest {
  clientId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
}

export interface CreatePaymentRequest {
  amount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  paymentDate: string;
}

export const ExpenseCategory = {
  Rent: 0,
  Salary: 1,
  Utilities: 2,
  Marketing: 3,
  Transport: 4,
  Software: 5,
  Equipment: 6,
  Other: 7,
} as const;

export type ExpenseCategory = (typeof ExpenseCategory)[keyof typeof ExpenseCategory];

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: string;
  description?: string;
}

export interface CreateExpenseRequest {
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: string;
  description?: string;
}

export interface DashboardPoint {
  label: string;
  value: number;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalExpenses: number;
  outstandingInvoices: number;
  overdueInvoices: number;
  netProfit: number;
  revenueByMonth: DashboardPoint[];
  expenseByMonth: DashboardPoint[];
  invoiceStatusBreakdown: DashboardPoint[];
}
