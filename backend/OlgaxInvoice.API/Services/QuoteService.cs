using Microsoft.EntityFrameworkCore;
using OlgaxInvoice.API.Data;
using OlgaxInvoice.API.Dtos;
using OlgaxInvoice.API.Models;

namespace OlgaxInvoice.API.Services;

public interface IQuoteService
{
    Task<List<QuoteDto>> GetQuotesAsync(Guid organizationId);
    Task<QuoteDto> GetQuoteAsync(Guid organizationId, Guid quoteId);
    Task<QuoteDto> CreateQuoteAsync(Guid organizationId, CreateQuoteRequest request);
    Task<QuoteDto> UpdateQuoteAsync(Guid organizationId, Guid quoteId, CreateQuoteRequest request);
    Task DeleteQuoteAsync(Guid organizationId, Guid quoteId);
    Task<InvoiceDto> ConvertQuoteToInvoiceAsync(Guid organizationId, Guid quoteId);
}

public class QuoteService : IQuoteService
{
    private readonly AppDbContext _context;

    public QuoteService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<QuoteDto>> GetQuotesAsync(Guid organizationId)
    {
        return await _context.Quotes
            .Where(q => q.OrganizationId == organizationId)
            .Include(q => q.Client)
            .Include(q => q.QuoteItems)
            .OrderByDescending(q => q.QuoteDate)
            .Select(q => new QuoteDto
            {
                Id = q.Id,
                ClientId = q.ClientId,
                ClientName = q.Client != null ? q.Client.Name : string.Empty,
                QuoteNumber = q.QuoteNumber,
                QuoteDate = q.QuoteDate,
                ExpiryDate = q.ExpiryDate,
                Status = q.Status,
                Subtotal = q.Subtotal,
                Discount = q.Discount,
                TaxAmount = q.TaxAmount,
                Total = q.Total,
                Items = q.QuoteItems.Select(i => new QuoteItemDto
                {
                    Id = i.Id,
                    Description = i.Description,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    Discount = i.Discount,
                    TaxRate = i.TaxRate,
                    TaxAmount = i.TaxAmount,
                    Total = i.Total
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<QuoteDto> GetQuoteAsync(Guid organizationId, Guid quoteId)
    {
        var q = await _context.Quotes
            .Where(q => q.OrganizationId == organizationId && q.Id == quoteId)
            .Include(q => q.Client)
            .Include(q => q.QuoteItems)
            .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Quote not found.");

        return MapToDto(q);
    }

    public async Task<QuoteDto> CreateQuoteAsync(Guid organizationId, CreateQuoteRequest request)
    {
        var clientExists = await _context.Clients.AnyAsync(c => c.OrganizationId == organizationId && c.Id == request.ClientId);
        if (!clientExists) throw new KeyNotFoundException("Client not found.");

        if (!request.Items.Any()) throw new InvalidOperationException("At least one quote item is required.");

        var now = DateTime.UtcNow;
        var items = request.Items.Select(item =>
        {
            var subtotalLine = item.Quantity * item.UnitPrice;
            var discountLine = item.Discount;
            var taxAmountLine = ((subtotalLine - discountLine) * item.TaxRate / 100m);
            var totalLine = subtotalLine - discountLine + taxAmountLine;
            return new QuoteItem
            {
                Id = Guid.NewGuid(),
                Description = item.Description,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Discount = item.Discount,
                TaxRate = item.TaxRate,
                TaxAmount = taxAmountLine,
                Total = totalLine,
                CreatedAt = now,
                UpdatedAt = now
            };
        }).ToList();

        var subtotal = items.Sum(i => i.Quantity * i.UnitPrice);
        var discount = items.Sum(i => i.Discount);
        var taxAmount = items.Sum(i => i.TaxAmount);
        var total = subtotal - discount + taxAmount;

        var quote = new Quote
        {
            Id = Guid.NewGuid(),
            OrganizationId = organizationId,
            ClientId = request.ClientId,
            QuoteNumber = request.QuoteNumber,
            QuoteDate = request.QuoteDate,
            ExpiryDate = request.ExpiryDate,
            Status = request.Status,
            Subtotal = subtotal,
            Discount = discount,
            TaxAmount = taxAmount,
            Total = total,
            CreatedAt = now,
            UpdatedAt = now,
            QuoteItems = items
        };

        _context.Quotes.Add(quote);
        await _context.SaveChangesAsync();

        return await GetQuoteAsync(organizationId, quote.Id);
    }

    public async Task<QuoteDto> UpdateQuoteAsync(Guid organizationId, Guid quoteId, CreateQuoteRequest request)
    {
        var quote = await _context.Quotes
            .Include(q => q.QuoteItems)
            .FirstOrDefaultAsync(q => q.OrganizationId == organizationId && q.Id == quoteId)
            ?? throw new KeyNotFoundException("Quote not found.");

        if (!request.Items.Any()) throw new InvalidOperationException("At least one quote item is required.");

        _context.QuoteItems.RemoveRange(quote.QuoteItems);

        var now = DateTime.UtcNow;
        var items = request.Items.Select(item => new QuoteItem
        {
            Id = Guid.NewGuid(),
            QuoteId = quote.Id,
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

        quote.QuoteNumber = request.QuoteNumber;
        quote.QuoteDate = request.QuoteDate;
        quote.ExpiryDate = request.ExpiryDate;
        quote.Status = request.Status;
        quote.Subtotal = subtotal;
        quote.Discount = discount;
        quote.TaxAmount = taxAmount;
        quote.Total = total;
        quote.UpdatedAt = now;

        _context.QuoteItems.AddRange(items);
        await _context.SaveChangesAsync();

        return await GetQuoteAsync(organizationId, quote.Id);
    }

    public async Task DeleteQuoteAsync(Guid organizationId, Guid quoteId)
    {
        var quote = await _context.Quotes
            .Include(q => q.QuoteItems)
            .FirstOrDefaultAsync(q => q.OrganizationId == organizationId && q.Id == quoteId)
            ?? throw new KeyNotFoundException("Quote not found.");

        _context.QuoteItems.RemoveRange(quote.QuoteItems);
        _context.Quotes.Remove(quote);
        await _context.SaveChangesAsync();
    }

    public async Task<InvoiceDto> ConvertQuoteToInvoiceAsync(Guid organizationId, Guid quoteId)
    {
        var quote = await _context.Quotes
            .Include(q => q.Client)
            .Include(q => q.QuoteItems)
            .FirstOrDefaultAsync(q => q.OrganizationId == organizationId && q.Id == quoteId)
            ?? throw new KeyNotFoundException("Quote not found.");

        if (quote.Status == QuoteStatus.Converted)
        {
            throw new InvalidOperationException("This quote is already converted.");
        }

        var invoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
        var now = DateTime.UtcNow;

        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            OrganizationId = organizationId,
            ClientId = quote.ClientId,
            QuoteId = quote.Id,
            InvoiceNumber = invoiceNumber,
            InvoiceDate = now,
            DueDate = now.AddDays(30),
            Status = InvoiceStatus.Sent,
            Subtotal = quote.Subtotal,
            Discount = quote.Discount,
            TaxAmount = quote.TaxAmount,
            Total = quote.Total,
            PaidAmount = 0m,
            Balance = quote.Total,
            CreatedAt = now,
            UpdatedAt = now,
            InvoiceItems = quote.QuoteItems.Select(i => new InvoiceItem
            {
                Id = Guid.NewGuid(),
                Description = i.Description,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                Discount = i.Discount,
                TaxRate = i.TaxRate,
                TaxAmount = i.TaxAmount,
                Total = i.Total,
                CreatedAt = now,
                UpdatedAt = now
            }).ToList()
        };

        _context.Invoices.Add(invoice);
        quote.Status = QuoteStatus.Converted;
        quote.UpdatedAt = now;
        await _context.SaveChangesAsync();

        return await _context.Invoices
            .Where(i => i.Id == invoice.Id)
            .Include(i => i.Client)
            .Include(i => i.InvoiceItems)
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
            .FirstAsync();
    }

    private static QuoteDto MapToDto(Quote quote)
    {
        return new QuoteDto
        {
            Id = quote.Id,
            ClientId = quote.ClientId,
            ClientName = quote.Client?.Name ?? string.Empty,
            QuoteNumber = quote.QuoteNumber,
            QuoteDate = quote.QuoteDate,
            ExpiryDate = quote.ExpiryDate,
            Status = quote.Status,
            Subtotal = quote.Subtotal,
            Discount = quote.Discount,
            TaxAmount = quote.TaxAmount,
            Total = quote.Total,
            Items = quote.QuoteItems.Select(i => new QuoteItemDto
            {
                Id = i.Id,
                Description = i.Description,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                Discount = i.Discount,
                TaxRate = i.TaxRate,
                TaxAmount = i.TaxAmount,
                Total = i.Total
            }).ToList()
        };
    }
}
