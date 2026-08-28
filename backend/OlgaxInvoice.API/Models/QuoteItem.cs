using System.ComponentModel.DataAnnotations;

namespace OlgaxInvoice.API.Models;

public class QuoteItem
{
    public Guid Id { get; set; }

    [Required]
    public Guid QuoteId { get; set; }

    [Required]
    public string Description { get; set; } = string.Empty;

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Discount { get; set; }
    public decimal TaxRate { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal Total { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Quote? Quote { get; set; }
}
