using System.ComponentModel.DataAnnotations;

namespace OlgaxInvoice.API.Models;

public class Client
{
    public Guid Id { get; set; }

    [Required]
    public Guid OrganizationId { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? CompanyName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? TaxNumber { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Organization? Organization { get; set; }
    public ICollection<Quote> Quotes { get; set; } = new List<Quote>();
    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
