using System.ComponentModel.DataAnnotations;

namespace OlgaxInvoice.API.Models;

public class User
{
    public Guid Id { get; set; }

    [Required]
    public Guid OrganizationId { get; set; }

    [Required]
    public Guid RoleId { get; set; }

    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Organization? Organization { get; set; }
    public Role? Role { get; set; }
}
