using OlgaxInvoice.API.Models;

namespace OlgaxInvoice.API.Dtos;

public class QuoteItemRequest
{
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Discount { get; set; }
    public decimal TaxRate { get; set; }
}

public class CreateQuoteRequest
{
    public Guid ClientId { get; set; }
    public string QuoteNumber { get; set; } = string.Empty;
    public DateTime QuoteDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public QuoteStatus Status { get; set; } = QuoteStatus.Draft;
    public List<QuoteItemRequest> Items { get; set; } = new();
}

public class QuoteDto
{
    public Guid Id { get; set; }
    public Guid ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string QuoteNumber { get; set; } = string.Empty;
    public DateTime QuoteDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public QuoteStatus Status { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal Total { get; set; }
    public List<QuoteItemDto> Items { get; set; } = new();
}

public class QuoteItemDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Discount { get; set; }
    public decimal TaxRate { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal Total { get; set; }
}
