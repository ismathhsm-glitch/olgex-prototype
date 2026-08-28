using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OlgaxInvoice.API.Dtos;
using OlgaxInvoice.API.Services;

namespace OlgaxInvoice.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;

    public InvoiceController(IInvoiceService invoiceService)
    {
        _invoiceService = invoiceService;
    }

    [HttpGet]
    public async Task<ActionResult<List<InvoiceDto>>> GetAll()
    {
        var organizationId = GetOrganizationId();
        return Ok(await _invoiceService.GetInvoicesAsync(organizationId));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<InvoiceDto>> GetById(Guid id)
    {
        var organizationId = GetOrganizationId();
        return Ok(await _invoiceService.GetInvoiceAsync(organizationId, id));
    }

    [HttpPost]
    public async Task<ActionResult<InvoiceDto>> Create([FromBody] CreateInvoiceRequest request)
    {
        var organizationId = GetOrganizationId();
        var invoice = await _invoiceService.CreateInvoiceAsync(organizationId, request);
        return CreatedAtAction(nameof(GetById), new { id = invoice.Id }, invoice);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<InvoiceDto>> Update(Guid id, [FromBody] CreateInvoiceRequest request)
    {
        var organizationId = GetOrganizationId();
        return Ok(await _invoiceService.UpdateInvoiceAsync(organizationId, id, request));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var organizationId = GetOrganizationId();
        await _invoiceService.DeleteInvoiceAsync(organizationId, id);
        return NoContent();
    }

    [HttpPost("{id:guid}/payments")]
    public async Task<ActionResult<InvoiceDto>> RecordPayment(Guid id, [FromBody] CreatePaymentRequest request)
    {
        var organizationId = GetOrganizationId();
        var invoice = await _invoiceService.RecordPaymentAsync(
            organizationId,
            id,
            request.Amount,
            request.PaymentMethod,
            request.Reference,
            request.Notes,
            request.PaymentDate);

        return Ok(invoice);
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardSummary>> DashboardSummary()
    {
        var organizationId = GetOrganizationId();
        return Ok(await _invoiceService.GetDashboardSummaryAsync(organizationId));
    }

    private Guid GetOrganizationId()
    {
        var organizationIdClaim = User.FindFirst("organizationId");
        return organizationIdClaim != null && Guid.TryParse(organizationIdClaim.Value, out var id)
            ? id
            : throw new UnauthorizedAccessException("Invalid organization context.");
    }
}
