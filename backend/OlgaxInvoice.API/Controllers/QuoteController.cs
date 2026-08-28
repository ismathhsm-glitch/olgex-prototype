using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OlgaxInvoice.API.Dtos;
using OlgaxInvoice.API.Services;

namespace OlgaxInvoice.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuoteController : ControllerBase
{
    private readonly IQuoteService _quoteService;

    public QuoteController(IQuoteService quoteService)
    {
        _quoteService = quoteService;
    }

    [HttpGet]
    public async Task<ActionResult<List<QuoteDto>>> GetAll()
    {
        var organizationId = GetOrganizationId();
        return Ok(await _quoteService.GetQuotesAsync(organizationId));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<QuoteDto>> GetById(Guid id)
    {
        var organizationId = GetOrganizationId();
        return Ok(await _quoteService.GetQuoteAsync(organizationId, id));
    }

    [HttpPost]
    public async Task<ActionResult<QuoteDto>> Create([FromBody] CreateQuoteRequest request)
    {
        var organizationId = GetOrganizationId();
        var quote = await _quoteService.CreateQuoteAsync(organizationId, request);
        return CreatedAtAction(nameof(GetById), new { id = quote.Id }, quote);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<QuoteDto>> Update(Guid id, [FromBody] CreateQuoteRequest request)
    {
        var organizationId = GetOrganizationId();
        return Ok(await _quoteService.UpdateQuoteAsync(organizationId, id, request));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var organizationId = GetOrganizationId();
        await _quoteService.DeleteQuoteAsync(organizationId, id);
        return NoContent();
    }

    [HttpPost("{id:guid}/convert-to-invoice")]
    public async Task<ActionResult<InvoiceDto>> ConvertToInvoice(Guid id)
    {
        var organizationId = GetOrganizationId();
        var invoice = await _quoteService.ConvertQuoteToInvoiceAsync(organizationId, id);
        return Ok(invoice);
    }

    private Guid GetOrganizationId()
    {
        var organizationIdClaim = User.FindFirst("organizationId");
        return organizationIdClaim != null && Guid.TryParse(organizationIdClaim.Value, out var id)
            ? id
            : throw new UnauthorizedAccessException("Invalid organization context.");
    }
}
