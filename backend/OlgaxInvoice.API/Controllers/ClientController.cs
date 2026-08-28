using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OlgaxInvoice.API.Dtos;
using OlgaxInvoice.API.Services;

namespace OlgaxInvoice.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClientController : ControllerBase
{
    private readonly IClientService _clientService;

    public ClientController(IClientService clientService)
    {
        _clientService = clientService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ClientDto>>> GetAll()
    {
        var organizationId = GetOrganizationId();
        var clients = await _clientService.GetClientsAsync(organizationId);
        return Ok(clients);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ClientDto>> GetById(Guid id)
    {
        var organizationId = GetOrganizationId();
        var client = await _clientService.GetClientAsync(organizationId, id);
        return Ok(client);
    }

    [HttpPost]
    public async Task<ActionResult<ClientDto>> Create([FromBody] CreateClientRequest request)
    {
        var organizationId = GetOrganizationId();
        var client = await _clientService.CreateClientAsync(organizationId, request);
        return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ClientDto>> Update(Guid id, [FromBody] CreateClientRequest request)
    {
        var organizationId = GetOrganizationId();
        var client = await _clientService.UpdateClientAsync(organizationId, id, request);
        return Ok(client);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var organizationId = GetOrganizationId();
        await _clientService.DeleteClientAsync(organizationId, id);
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
