using System.ComponentModel.DataAnnotations;

namespace OlgaxInvoice.API.Models;

public enum QuoteStatus
{
    Draft,
    Sent,
    Accepted,
    Rejected,
    Converted
}

public class Quote
{
    public Guid Id { get; set; }

    [Required]
    public Guid OrganizationId { get; set; }

    [Required]
    public Guid ClientId { get; set; }

    [Required]
    public string QuoteNumber { get; set; } = string.Empty;

    public DateTime QuoteDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public QuoteStatus Status { get; set; } = QuoteStatus.Draft;
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal Total { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Organization? Organization { get; set; }
    public Client? Client { get; set; }
    public ICollection<QuoteItem> QuoteItems { get; set; } = new List<QuoteItem>();
}
