using System.ComponentModel.DataAnnotations;

namespace OlgaxInvoice.API.Models;

public class Payment
{
    public Guid Id { get; set; }

    [Required]
    public Guid OrganizationId { get; set; }

    [Required]
    public Guid InvoiceId { get; set; }

    [Required]
    public decimal Amount { get; set; }

    public DateTime PaymentDate { get; set; }
    public string PaymentMethod { get; set; } = "Cash";
    public string? Reference { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Organization? Organization { get; set; }
    public Invoice? Invoice { get; set; }
}
