using OlgaxInvoice.API.Models;

namespace OlgaxInvoice.API.Dtos;

public class ExpenseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public ExpenseCategory Category { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class CreateExpenseRequest
{
    public string Title { get; set; } = string.Empty;
    public ExpenseCategory Category { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string PaymentMethod { get; set; } = "Cash";
    public string? Description { get; set; }
}
