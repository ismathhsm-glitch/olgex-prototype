using Microsoft.EntityFrameworkCore;
using OlgaxInvoice.API.Data;
using OlgaxInvoice.API.Dtos;
using OlgaxInvoice.API.Models;

namespace OlgaxInvoice.API.Services;

public interface IClientService
{
    Task<List<ClientDto>> GetClientsAsync(Guid organizationId);
    Task<ClientDto> GetClientAsync(Guid organizationId, Guid clientId);
    Task<ClientDto> CreateClientAsync(Guid organizationId, CreateClientRequest request);
    Task<ClientDto> UpdateClientAsync(Guid organizationId, Guid clientId, CreateClientRequest request);
    Task DeleteClientAsync(Guid organizationId, Guid clientId);
}

public class ClientService : IClientService
{
    private readonly AppDbContext _context;

    public ClientService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ClientDto>> GetClientsAsync(Guid organizationId)
    {
        return await _context.Clients
            .Where(c => c.OrganizationId == organizationId)
            .OrderBy(c => c.Name)
            .Select(c => new ClientDto
            {
                Id = c.Id,
                Name = c.Name,
                CompanyName = c.CompanyName,
                Email = c.Email,
                Phone = c.Phone,
                Address = c.Address,
                TaxNumber = c.TaxNumber
            })
            .ToListAsync();
    }

    public async Task<ClientDto> GetClientAsync(Guid organizationId, Guid clientId)
    {
        var client = await _context.Clients.FirstOrDefaultAsync(c => c.OrganizationId == organizationId && c.Id == clientId)
            ?? throw new KeyNotFoundException("Client not found.");

        return new ClientDto
        {
            Id = client.Id,
            Name = client.Name,
            CompanyName = client.CompanyName,
            Email = client.Email,
            Phone = client.Phone,
            Address = client.Address,
            TaxNumber = client.TaxNumber
        };
    }

    public async Task<ClientDto> CreateClientAsync(Guid organizationId, CreateClientRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name)) throw new InvalidOperationException("Client name is required.");

        var client = new Client
        {
            Id = Guid.NewGuid(),
            OrganizationId = organizationId,
            Name = request.Name.Trim(),
            CompanyName = request.CompanyName,
            Email = request.Email,
            Phone = request.Phone,
            Address = request.Address,
            TaxNumber = request.TaxNumber,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Clients.Add(client);
        await _context.SaveChangesAsync();

        return new ClientDto
        {
            Id = client.Id,
            Name = client.Name,
            CompanyName = client.CompanyName,
            Email = client.Email,
            Phone = client.Phone,
            Address = client.Address,
            TaxNumber = client.TaxNumber
        };
    }

    public async Task<ClientDto> UpdateClientAsync(Guid organizationId, Guid clientId, CreateClientRequest request)
    {
        var client = await _context.Clients.FirstOrDefaultAsync(c => c.OrganizationId == organizationId && c.Id == clientId)
            ?? throw new KeyNotFoundException("Client not found.");

        client.Name = request.Name.Trim();
        client.CompanyName = request.CompanyName;
        client.Email = request.Email;
        client.Phone = request.Phone;
        client.Address = request.Address;
        client.TaxNumber = request.TaxNumber;
        client.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return await GetClientAsync(organizationId, clientId);
    }

    public async Task DeleteClientAsync(Guid organizationId, Guid clientId)
    {
        var client = await _context.Clients.FirstOrDefaultAsync(c => c.OrganizationId == organizationId && c.Id == clientId)
            ?? throw new KeyNotFoundException("Client not found.");

        _context.Clients.Remove(client);
        await _context.SaveChangesAsync();
    }
}
