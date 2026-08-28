using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OlgaxInvoice.API.Dtos;
using OlgaxInvoice.API.Services;

namespace OlgaxInvoice.API.Controllers;

[ApiController]
[Route("api/organizations")]
[Authorize]
public class OrganizationController : ControllerBase
{
    private readonly IOrganizationService _organizationService;

    public OrganizationController(IOrganizationService organizationService)
    {
        _organizationService = organizationService;
    }

    [HttpGet("current")]
    public async Task<ActionResult<OrganizationDto>> GetCurrent()
    {
        var organizationId = GetOrganizationId();
        var organization = await _organizationService.GetCurrentOrganizationAsync(organizationId);
        return Ok(organization);
    }

    [HttpPut("current")]
    public async Task<ActionResult<OrganizationDto>> UpdateCurrent([FromBody] UpdateOrganizationRequest request)
    {
        var organizationId = GetOrganizationId();
        var organization = await _organizationService.UpdateCurrentOrganizationAsync(organizationId, request);
        return Ok(organization);
    }

    private Guid GetOrganizationId()
    {
        var claim = User.Claims.FirstOrDefault(c => c.Type == "organizationId");
        if (claim == null || !Guid.TryParse(claim.Value, out var organizationId))
        {
            throw new UnauthorizedAccessException("Organization context missing.");
        }

        return organizationId;
    }
}
