using Microsoft.EntityFrameworkCore;
using OlgaxInvoice.API.Data;
using OlgaxInvoice.API.Dtos;
using OlgaxInvoice.API.Models;

namespace OlgaxInvoice.API.Services;

public interface IExpenseService
{
    Task<List<ExpenseDto>> GetExpensesAsync(Guid organizationId);
    Task<ExpenseDto> GetExpenseAsync(Guid organizationId, Guid expenseId);
    Task<ExpenseDto> CreateExpenseAsync(Guid organizationId, CreateExpenseRequest request);
    Task<ExpenseDto> UpdateExpenseAsync(Guid organizationId, Guid expenseId, CreateExpenseRequest request);
    Task DeleteExpenseAsync(Guid organizationId, Guid expenseId);
}

public class ExpenseService : IExpenseService
{
    private readonly AppDbContext _context;

    public ExpenseService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ExpenseDto>> GetExpensesAsync(Guid organizationId)
    {
        return await _context.Expenses
            .Where(e => e.OrganizationId == organizationId)
            .OrderByDescending(e => e.Date)
            .Select(e => new ExpenseDto
            {
                Id = e.Id,
                Title = e.Title,
                Category = e.Category,
                Amount = e.Amount,
                Date = e.Date,
                PaymentMethod = e.PaymentMethod,
                Description = e.Description
            })
            .ToListAsync();
    }

    public async Task<ExpenseDto> GetExpenseAsync(Guid organizationId, Guid expenseId)
    {
        var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.OrganizationId == organizationId && e.Id == expenseId)
            ?? throw new KeyNotFoundException("Expense not found.");

        return new ExpenseDto
        {
            Id = expense.Id,
            Title = expense.Title,
            Category = expense.Category,
            Amount = expense.Amount,
            Date = expense.Date,
            PaymentMethod = expense.PaymentMethod,
            Description = expense.Description
        };
    }

    public async Task<ExpenseDto> CreateExpenseAsync(Guid organizationId, CreateExpenseRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title)) throw new InvalidOperationException("Expense title is required.");
        if (request.Amount <= 0) throw new InvalidOperationException("Expense amount must be greater than zero.");

        var expense = new Expense
        {
            Id = Guid.NewGuid(),
            OrganizationId = organizationId,
            Title = request.Title.Trim(),
            Category = request.Category,
            Amount = request.Amount,
            Date = request.Date,
            PaymentMethod = request.PaymentMethod,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return new ExpenseDto
        {
            Id = expense.Id,
            Title = expense.Title,
            Category = expense.Category,
            Amount = expense.Amount,
            Date = expense.Date,
            PaymentMethod = expense.PaymentMethod,
            Description = expense.Description
        };
    }

    public async Task<ExpenseDto> UpdateExpenseAsync(Guid organizationId, Guid expenseId, CreateExpenseRequest request)
    {
        var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.OrganizationId == organizationId && e.Id == expenseId)
            ?? throw new KeyNotFoundException("Expense not found.");

        expense.Title = request.Title.Trim();
        expense.Category = request.Category;
        expense.Amount = request.Amount;
        expense.Date = request.Date;
        expense.PaymentMethod = request.PaymentMethod;
        expense.Description = request.Description;
        expense.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return await GetExpenseAsync(organizationId, expenseId);
    }

    public async Task DeleteExpenseAsync(Guid organizationId, Guid expenseId)
    {
        var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.OrganizationId == organizationId && e.Id == expenseId)
            ?? throw new KeyNotFoundException("Expense not found.");

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();
    }
}
