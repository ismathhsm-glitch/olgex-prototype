using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OlgaxInvoice.API.Data;
using OlgaxInvoice.API.Dtos;
using OlgaxInvoice.API.Models;

namespace OlgaxInvoice.API.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<User?> GetCurrentUserAsync(Guid userId);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FirstName) ||
            string.IsNullOrWhiteSpace(request.LastName) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password) ||
            string.IsNullOrWhiteSpace(request.OrganizationName))
        {
            throw new InvalidOperationException("All fields are required.");
        }

        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == request.Email.Trim().ToLower()))
        {
            throw new InvalidOperationException("A user with this email already exists.");
        }

        var organization = new Organization
        {
            Id = Guid.NewGuid(),
            Name = request.OrganizationName.Trim(),
            Email = request.Email.Trim(),
            Currency = "USD",
            InvoicePrefix = "INV",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var adminRole = await _context.Roles.FirstAsync(r => r.Name == "Admin");

        var user = new User
        {
            Id = Guid.NewGuid(),
            OrganizationId = organization.Id,
            RoleId = adminRole.Id,
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = request.Email.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        organization.Users.Add(user);

        _context.Organizations.Add(organization);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return await BuildAuthResponseAsync(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Organization)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.Trim().ToLower());

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new InvalidOperationException("Invalid email or password.");
        }

        return await BuildAuthResponseAsync(user);
    }

    public async Task<User?> GetCurrentUserAsync(Guid userId)
    {
        return await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Organization)
            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    private async Task<AuthResponse> BuildAuthResponseAsync(User user)
    {
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == user.RoleId) ?? new Role { Name = "Admin" };

        var token = GenerateJwtToken(user, role.Name);

        return new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            OrganizationId = user.OrganizationId,
            Role = role.Name,
            User = new UserSummary
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = role.Name
            }
        };
    }

    private string GenerateJwtToken(User user, string role)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? "default-secret-key-for-demo-prototype";
        var issuer = _configuration["Jwt:Issuer"] ?? "OlgaxInvoice.API";
        var audience = _configuration["Jwt:Audience"] ?? "OlgaxInvoice.Client";

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, role),
            new Claim("organizationId", user.OrganizationId.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
