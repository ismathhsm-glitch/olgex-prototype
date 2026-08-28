namespace OlgaxInvoice.API.Dtos;

public class OrganizationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Website { get; set; }
    public string? TaxNumber { get; set; }
    public string Currency { get; set; } = "USD";
    public string InvoicePrefix { get; set; } = "INV";
}

public class UpdateOrganizationRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Website { get; set; }
    public string? TaxNumber { get; set; }
    public string Currency { get; set; } = "USD";
    public string InvoicePrefix { get; set; } = "INV";
}
