using Microsoft.EntityFrameworkCore;
using OlgaxInvoice.API.Data;
using OlgaxInvoice.API.Dtos;
using OlgaxInvoice.API.Models;

namespace OlgaxInvoice.API.Services;

public interface IOrganizationService
{
    Task<OrganizationDto> GetCurrentOrganizationAsync(Guid organizationId);
    Task<OrganizationDto> UpdateCurrentOrganizationAsync(Guid organizationId, UpdateOrganizationRequest request);
}

public class OrganizationService : IOrganizationService
{
    private readonly AppDbContext _context;

    public OrganizationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<OrganizationDto> GetCurrentOrganizationAsync(Guid organizationId)
    {
        var organization = await _context.Organizations.FirstOrDefaultAsync(o => o.Id == organizationId)
            ?? throw new KeyNotFoundException("Organization not found.");

        return MapToDto(organization);
    }

    public async Task<OrganizationDto> UpdateCurrentOrganizationAsync(Guid organizationId, UpdateOrganizationRequest request)
    {
        var organization = await _context.Organizations.FirstOrDefaultAsync(o => o.Id == organizationId)
            ?? throw new KeyNotFoundException("Organization not found.");

        organization.Name = request.Name.Trim();
        organization.Email = request.Email;
        organization.Phone = request.Phone;
        organization.Address = request.Address;
        organization.Website = request.Website;
        organization.TaxNumber = request.TaxNumber;
        organization.Currency = request.Currency;
        organization.InvoicePrefix = request.InvoicePrefix;
        organization.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToDto(organization);
    }

    private static OrganizationDto MapToDto(Organization organization)
    {
        return new OrganizationDto
        {
            Id = organization.Id,
            Name = organization.Name,
            Email = organization.Email,
            Phone = organization.Phone,
            Address = organization.Address,
            Website = organization.Website,
            TaxNumber = organization.TaxNumber,
            Currency = organization.Currency,
            InvoicePrefix = organization.InvoicePrefix
        };
    }
}
