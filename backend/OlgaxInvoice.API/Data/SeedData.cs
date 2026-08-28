using Microsoft.EntityFrameworkCore;
using OlgaxInvoice.API.Models;

namespace OlgaxInvoice.API.Data;

public static class SeedData
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Organizations.AnyAsync())
        {
            return;
        }

        var organization = new Organization
        {
            Id = Guid.NewGuid(),
            Name = "OLGAX Demo Company",
            Email = "hello@olgax.com",
            Phone = "+1 (555) 010-2024",
            Address = "15 Business Avenue, Lagos",
            Website = "https://olgax.example",
            TaxNumber = "TAX-OLGAX-1001",
            Currency = "USD",
            InvoicePrefix = "INV",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var adminRole = await context.Roles.FirstAsync(r => r.Name == "Admin");

        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            OrganizationId = organization.Id,
            FirstName = "Admin",
            LastName = "User",
            Email = "admin@olgax.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo123!"),
            RoleId = adminRole.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var client1 = new Client
        {
            Id = Guid.NewGuid(),
            OrganizationId = organization.Id,
            Name = "ABC Technologies",
            CompanyName = "ABC Technologies",
            Email = "billing@abctech.com",
            Phone = "+1 (555) 010-3434",
            Address = "Lakeview Tower, Houston",
            TaxNumber = "ABC-1001",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var client2 = new Client
        {
            Id = Guid.NewGuid(),
            OrganizationId = organization.Id,
            Name = "XYZ Solutions",
            CompanyName = "XYZ Solutions",
            Email = "finance@xyzsolutions.com",
            Phone = "+1 (555) 010-8877",
            Address = "Oak Avenue, Seattle",
            TaxNumber = "XYZ-2002",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var quote = new Quote
        {
            Id = Guid.NewGuid(),
            OrganizationId = organization.Id,
            ClientId = client1.Id,
            QuoteNumber = "QT-001",
            QuoteDate = DateTime.UtcNow.AddDays(-10),
            ExpiryDate = DateTime.UtcNow.AddDays(15),
            Status = QuoteStatus.Accepted,
            Subtotal = 105000m,
            Discount = 5000m,
            TaxAmount = 10000m,
            Total = 110000m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            QuoteItems = new List<QuoteItem>
            {
                new QuoteItem
                {
                    Id = Guid.NewGuid(),
                    Description = "Website Development",
                    Quantity = 1,
                    UnitPrice = 100000m,
                    Discount = 5000m,
                    TaxRate = 10m,
                    TaxAmount = 10000m,
                    Total = 110000m,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            }
        };

        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            OrganizationId = organization.Id,
            ClientId = client1.Id,
            QuoteId = quote.Id,
            InvoiceNumber = "INV-001",
            InvoiceDate = DateTime.UtcNow.AddDays(-8),
            DueDate = DateTime.UtcNow.AddDays(20),
            Status = InvoiceStatus.PartiallyPaid,
            Subtotal = 105000m,
            Discount = 5000m,
            TaxAmount = 10000m,
            Total = 110000m,
            PaidAmount = 30000m,
            Balance = 80000m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            InvoiceItems = new List<InvoiceItem>
            {
                new InvoiceItem
                {
                    Id = Guid.NewGuid(),
                    Description = "Website Development",
                    Quantity = 1,
                    UnitPrice = 100000m,
                    Discount = 5000m,
                    TaxRate = 10m,
                    TaxAmount = 10000m,
                    Total = 110000m,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            }
        };

        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            OrganizationId = organization.Id,
            InvoiceId = invoice.Id,
            Amount = 30000m,
            PaymentDate = DateTime.UtcNow.AddDays(-7),
            PaymentMethod = "Bank Transfer",
            Reference = "BANK-2026-001",
            Notes = "Initial payment",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var expense1 = new Expense
        {
            Id = Guid.NewGuid(),
            OrganizationId = organization.Id,
            Title = "Office Rent",
            Category = ExpenseCategory.Rent,
            Amount = 2500m,
            Date = DateTime.UtcNow.AddDays(-5),
            PaymentMethod = "Bank Transfer",
            Description = "Monthly office rent",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var expense2 = new Expense
        {
            Id = Guid.NewGuid(),
            OrganizationId = organization.Id,
            Title = "Internet",
            Category = ExpenseCategory.Utilities,
            Amount = 180m,
            Date = DateTime.UtcNow.AddDays(-3),
            PaymentMethod = "Card",
            Description = "Internet service",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var expense3 = new Expense
        {
            Id = Guid.NewGuid(),
            OrganizationId = organization.Id,
            Title = "Software Subscription",
            Category = ExpenseCategory.Software,
            Amount = 350m,
            Date = DateTime.UtcNow.AddDays(-1),
            PaymentMethod = "Card",
            Description = "Cloud software subscriptions",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        organization.Users.Add(adminUser);
        organization.Clients.Add(client1);
        organization.Clients.Add(client2);
        organization.Quotes.Add(quote);
        organization.Invoices.Add(invoice);
        organization.Payments.Add(payment);
        organization.Expenses.Add(expense1);
        organization.Expenses.Add(expense2);
        organization.Expenses.Add(expense3);

        await context.Organizations.AddAsync(organization);
        await context.Users.AddAsync(adminUser);
        await context.Clients.AddRangeAsync(client1, client2);
        await context.Quotes.AddAsync(quote);
        await context.Invoices.AddAsync(invoice);
        await context.Payments.AddAsync(payment);
        await context.Expenses.AddRangeAsync(expense1, expense2, expense3);

        await context.SaveChangesAsync();
    }
}
