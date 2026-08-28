using Microsoft.EntityFrameworkCore;
using OlgaxInvoice.API.Data;
using OlgaxInvoice.API.Dtos;
using OlgaxInvoice.API.Models;

namespace OlgaxInvoice.API.Services;

public interface IInvoiceService
{
    Task<List<InvoiceDto>> GetInvoicesAsync(Guid organizationId);
    Task<InvoiceDto> GetInvoiceAsync(Guid organizationId, Guid invoiceId);
    Task<InvoiceDto> CreateInvoiceAsync(Guid organizationId, CreateInvoiceRequest request);
    Task<InvoiceDto> UpdateInvoiceAsync(Guid organizationId, Guid invoiceId, CreateInvoiceRequest request);
    Task DeleteInvoiceAsync(Guid organizationId, Guid invoiceId);
    Task<InvoiceDto> RecordPaymentAsync(Guid organizationId, Guid invoiceId, decimal amount, string paymentMethod, string? reference, string? notes, DateTime paymentDate);
    Task<DashboardSummary> GetDashboardSummaryAsync(Guid organizationId);
}

public class InvoiceService : IInvoiceService
{
    private readonly AppDbContext _context;

    public InvoiceService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<InvoiceDto>> GetInvoicesAsync(Guid organizationId)
    {
        return await _context.Invoices
            .Where(i => i.OrganizationId == organizationId)
            .Include(i => i.Client)
            .Include(i => i.InvoiceItems)
            .OrderByDescending(i => i.InvoiceDate)
            .Select(i => new InvoiceDto
            {
                Id = i.Id,
                ClientId = i.ClientId,
                ClientName = i.Client != null ? i.Client.Name : string.Empty,
                InvoiceNumber = i.InvoiceNumber,
                InvoiceDate = i.InvoiceDate,
                DueDate = i.DueDate,
                Status = i.Status,
                Subtotal = i.Subtotal,
                Discount = i.Discount,
                TaxAmount = i.TaxAmount,
                Total = i.Total,
                PaidAmount = i.PaidAmount,
                Balance = i.Balance,
                Items = i.InvoiceItems.Select(item => new InvoiceItemDto
                {
                    Id = item.Id,
                    Description = item.Description,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Discount = item.Discount,
                    TaxRate = item.TaxRate,
                    TaxAmount = item.TaxAmount,
                    Total = item.Total
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<InvoiceDto> GetInvoiceAsync(Guid organizationId, Guid invoiceId)
    {
        var invoice = await _context.Invoices
            .Where(i => i.OrganizationId == organizationId && i.Id == invoiceId)
            .Include(i => i.Client)
            .Include(i => i.InvoiceItems)
            .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Invoice not found.");

        return MapToDto(invoice);
    }

    public async Task<InvoiceDto> CreateInvoiceAsync(Guid organizationId, CreateInvoiceRequest request)
    {
        var clientExists = await _context.Clients.AnyAsync(c => c.OrganizationId == organizationId && c.Id == request.ClientId);
        if (!clientExists) throw new KeyNotFoundException("Client not found.");
        if (!request.Items.Any()) throw new InvalidOperationException("At least one invoice item is required.");

        var now = DateTime.UtcNow;
        var items = request.Items.Select(item =>
        {
            var subtotalLine = item.Quantity * item.UnitPrice;
            var discountLine = item.Discount;
            var taxAmount = ((subtotalLine - discountLine) * item.TaxRate / 100m);
            var total = subtotalLine - discountLine + taxAmount;
            return new InvoiceItem
            {
                Id = Guid.NewGuid(),
                Description = item.Description,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Discount = item.Discount,
                TaxRate = item.TaxRate,
                TaxAmount = taxAmount,
                Total = total,
                CreatedAt = now,
                UpdatedAt = now
            };
        }).ToList();

        var subtotal = items.Sum(i => i.Quantity * i.UnitPrice);
        var discount = items.Sum(i => i.Discount);
        var taxAmountTotal = items.Sum(i => i.TaxAmount);
        var total = subtotal - discount + taxAmountTotal;

        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            OrganizationId = organizationId,
            ClientId = request.ClientId,
            InvoiceNumber = request.InvoiceNumber,
            InvoiceDate = request.InvoiceDate,
            DueDate = request.DueDate,
            Status = request.Status,
            Subtotal = subtotal,
            Discount = discount,
            TaxAmount = taxAmountTotal,
            Total = total,
            PaidAmount = 0,
            Balance = total,
            CreatedAt = now,
            UpdatedAt = now,
            InvoiceItems = items
        };

        _context.Invoices.Add(invoice);
        await _context.SaveChangesAsync();
        return await GetInvoiceAsync(organizationId, invoice.Id);
    }

    public async Task<InvoiceDto> UpdateInvoiceAsync(Guid organizationId, Guid invoiceId, CreateInvoiceRequest request)
    {
        var invoice = await _context.Invoices
            .Include(i => i.InvoiceItems)
            .FirstOrDefaultAsync(i => i.OrganizationId == organizationId && i.Id == invoiceId)
            ?? throw new KeyNotFoundException("Invoice not found.");

        if (invoice.Status != InvoiceStatus.Draft)
        {
            throw new InvalidOperationException("Only draft invoices can be updated.");
        }

        _context.InvoiceItems.RemoveRange(invoice.InvoiceItems);

        var now = DateTime.UtcNow;
        var items = request.Items.Select(item => new InvoiceItem
        {
            Id = Guid.NewGuid(),
            InvoiceId = invoice.Id,
            Description = item.Description,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            Discount = item.Discount,
            TaxRate = item.TaxRate,
            TaxAmount = ((item.Quantity * item.UnitPrice) - item.Discount) * (item.TaxRate / 100m),
            Total = (item.Quantity * item.UnitPrice) - item.Discount + (((item.Quantity * item.UnitPrice) - item.Discount) * (item.TaxRate / 100m)),
            CreatedAt = now,
            UpdatedAt = now
        }).ToList();

        var subtotal = items.Sum(i => i.Quantity * i.UnitPrice);
        var discount = items.Sum(i => i.Discount);
        var taxAmount = items.Sum(i => i.TaxAmount);
        var total = subtotal - discount + taxAmount;

        invoice.ClientId = request.ClientId;
        invoice.InvoiceNumber = request.InvoiceNumber;
        invoice.InvoiceDate = request.InvoiceDate;
        invoice.DueDate = request.DueDate;
        invoice.Status = request.Status;
        invoice.Subtotal = subtotal;
        invoice.Discount = discount;
        invoice.TaxAmount = taxAmount;
        invoice.Total = total;
        invoice.Balance = total - invoice.PaidAmount;
        invoice.UpdatedAt = now;

        _context.InvoiceItems.AddRange(items);
        await _context.SaveChangesAsync();
        return await GetInvoiceAsync(organizationId, invoice.Id);
    }

    public async Task DeleteInvoiceAsync(Guid organizationId, Guid invoiceId)
    {
        var invoice = await _context.Invoices
            .Include(i => i.InvoiceItems)
            .Include(i => i.Payments)
            .FirstOrDefaultAsync(i => i.OrganizationId == organizationId && i.Id == invoiceId)
            ?? throw new KeyNotFoundException("Invoice not found.");

        if (invoice.Payments.Any())
        {
            _context.Payments.RemoveRange(invoice.Payments);
        }

        _context.InvoiceItems.RemoveRange(invoice.InvoiceItems);
        _context.Invoices.Remove(invoice);
        await _context.SaveChangesAsync();
    }

    public async Task<InvoiceDto> RecordPaymentAsync(Guid organizationId, Guid invoiceId, decimal amount, string paymentMethod, string? reference, string? notes, DateTime paymentDate)
    {
        if (amount <= 0) throw new InvalidOperationException("Payment amount must be greater than zero.");

        var invoice = await _context.Invoices.FirstOrDefaultAsync(i => i.OrganizationId == organizationId && i.Id == invoiceId)
            ?? throw new KeyNotFoundException("Invoice not found.");

        var remainingBalance = invoice.Total - invoice.PaidAmount;
        if (amount > remainingBalance)
        {
            throw new InvalidOperationException("Payment exceeds the remaining balance.");
        }

        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            OrganizationId = organizationId,
            InvoiceId = invoice.Id,
            Amount = amount,
            PaymentDate = paymentDate,
            PaymentMethod = paymentMethod,
            Reference = reference,
            Notes = notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        invoice.PaidAmount += amount;
        invoice.Balance = invoice.Total - invoice.PaidAmount;

        if (invoice.PaidAmount == 0) invoice.Status = InvoiceStatus.Sent;
        else if (invoice.PaidAmount > 0 && invoice.PaidAmount < invoice.Total) invoice.Status = InvoiceStatus.PartiallyPaid;
        else if (invoice.PaidAmount >= invoice.Total) invoice.Status = InvoiceStatus.Paid;
        else if (invoice.DueDate < DateTime.UtcNow && invoice.Balance > 0) invoice.Status = InvoiceStatus.Overdue;

        invoice.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return await GetInvoiceAsync(organizationId, invoice.Id);
    }

    public async Task<DashboardSummary> GetDashboardSummaryAsync(Guid organizationId)
    {
        var invoices = await _context.Invoices.Where(i => i.OrganizationId == organizationId).ToListAsync();
        var expenses = await _context.Expenses.Where(e => e.OrganizationId == organizationId).ToListAsync();

        var totalRevenue = invoices.Sum(i => i.PaidAmount + i.Balance);
        var totalExpenses = expenses.Sum(e => e.Amount);
        var outstanding = invoices.Where(i => i.Balance > 0).Sum(i => i.Balance);
        var overdue = invoices
            .Where(i => i.DueDate < DateTime.UtcNow && i.Balance > 0)
            .Sum(i => i.Balance);
        var netProfit = totalRevenue - totalExpenses;

        return new DashboardSummary
        {
            TotalRevenue = totalRevenue,
            TotalExpenses = totalExpenses,
            OutstandingInvoices = outstanding,
            OverdueInvoices = overdue,
            NetProfit = netProfit,
            RevenueByMonth = new List<DashboardPoint>(),
            ExpenseByMonth = new List<DashboardPoint>(),
            InvoiceStatusBreakdown = new List<DashboardPoint>()
        };
    }

    private static InvoiceDto MapToDto(Invoice invoice)
    {
        return new InvoiceDto
        {
            Id = invoice.Id,
            ClientId = invoice.ClientId,
            ClientName = invoice.Client?.Name ?? string.Empty,
            InvoiceNumber = invoice.InvoiceNumber,
            InvoiceDate = invoice.InvoiceDate,
            DueDate = invoice.DueDate,
            Status = invoice.Status,
            Subtotal = invoice.Subtotal,
            Discount = invoice.Discount,
            TaxAmount = invoice.TaxAmount,
            Total = invoice.Total,
            PaidAmount = invoice.PaidAmount,
            Balance = invoice.Balance,
            Items = invoice.InvoiceItems.Select(item => new InvoiceItemDto
            {
                Id = item.Id,
                Description = item.Description,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Discount = item.Discount,
                TaxRate = item.TaxRate,
                TaxAmount = item.TaxAmount,
                Total = item.Total
            }).ToList()
        };
    }
}

public class DashboardSummary
{
    public decimal TotalRevenue { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal OutstandingInvoices { get; set; }
    public decimal OverdueInvoices { get; set; }
    public decimal NetProfit { get; set; }
    public List<DashboardPoint> RevenueByMonth { get; set; } = new();
    public List<DashboardPoint> ExpenseByMonth { get; set; } = new();
    public List<DashboardPoint> InvoiceStatusBreakdown { get; set; } = new();
}

public class DashboardPoint
{
    public string Label { get; set; } = string.Empty;
    public decimal Value { get; set; }
}
