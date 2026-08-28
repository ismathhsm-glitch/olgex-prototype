using System.ComponentModel.DataAnnotations;

namespace OlgaxInvoice.API.Models;

public class Organization
{
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Website { get; set; }
    public string? TaxNumber { get; set; }
    public string Currency { get; set; } = "USD";
    public string InvoicePrefix { get; set; } = "INV";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Client> Clients { get; set; } = new List<Client>();
    public ICollection<Quote> Quotes { get; set; } = new List<Quote>();
    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
}
