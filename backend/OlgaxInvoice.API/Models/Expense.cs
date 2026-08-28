using System.ComponentModel.DataAnnotations;

namespace OlgaxInvoice.API.Models;

public enum ExpenseCategory
{
    Rent,
    Salary,
    Utilities,
    Marketing,
    Transport,
    Software,
    Equipment,
    Other
}

public class Expense
{
    public Guid Id { get; set; }

    [Required]
    public Guid OrganizationId { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public ExpenseCategory Category { get; set; } = ExpenseCategory.Other;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string PaymentMethod { get; set; } = "Cash";
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Organization? Organization { get; set; }
}
