using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OlgaxInvoice.API.Dtos;
using OlgaxInvoice.API.Services;

namespace OlgaxInvoice.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpenseController : ControllerBase
{
    private readonly IExpenseService _expenseService;

    public ExpenseController(IExpenseService expenseService)
    {
        _expenseService = expenseService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ExpenseDto>>> GetAll()
    {
        var organizationId = GetOrganizationId();
        return Ok(await _expenseService.GetExpensesAsync(organizationId));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExpenseDto>> GetById(Guid id)
    {
        var organizationId = GetOrganizationId();
        return Ok(await _expenseService.GetExpenseAsync(organizationId, id));
    }

    [HttpPost]
    public async Task<ActionResult<ExpenseDto>> Create([FromBody] CreateExpenseRequest request)
    {
        var organizationId = GetOrganizationId();
        var expense = await _expenseService.CreateExpenseAsync(organizationId, request);
        return CreatedAtAction(nameof(GetById), new { id = expense.Id }, expense);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ExpenseDto>> Update(Guid id, [FromBody] CreateExpenseRequest request)
    {
        var organizationId = GetOrganizationId();
        return Ok(await _expenseService.UpdateExpenseAsync(organizationId, id, request));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var organizationId = GetOrganizationId();
        await _expenseService.DeleteExpenseAsync(organizationId, id);
        return NoContent();
    }

    private Guid GetOrganizationId()
    {
        var organizationIdClaim = User.FindFirst("organizationId");
        return organizationIdClaim != null && Guid.TryParse(organizationIdClaim.Value, out var id)
            ? id
            : throw new UnauthorizedAccessException("Invalid organization context.");
    }
}
