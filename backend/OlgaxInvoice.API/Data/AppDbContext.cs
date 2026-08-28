using Microsoft.EntityFrameworkCore;
using OlgaxInvoice.API.Models;

namespace OlgaxInvoice.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Organization> Organizations => Set<Organization>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Quote> Quotes => Set<Quote>();
    public DbSet<QuoteItem> QuoteItems => Set<QuoteItem>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceItem> InvoiceItems => Set<InvoiceItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Expense> Expenses => Set<Expense>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Role>().HasIndex(r => r.Name).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Organization>().HasIndex(o => o.Name).IsUnique();
        modelBuilder.Entity<Client>().HasIndex(c => new { c.OrganizationId, c.Email }).IsUnique();
        modelBuilder.Entity<Quote>().HasIndex(q => new { q.OrganizationId, q.QuoteNumber }).IsUnique();
        modelBuilder.Entity<Invoice>().HasIndex(i => new { i.OrganizationId, i.InvoiceNumber }).IsUnique();

        modelBuilder.Entity<Organization>()
            .Property(o => o.Name)
            .HasMaxLength(200)
            .IsRequired();

        modelBuilder.Entity<User>()
            .Property(u => u.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        modelBuilder.Entity<User>()
            .Property(u => u.LastName)
            .HasMaxLength(100)
            .IsRequired();

        modelBuilder.Entity<User>()
            .Property(u => u.Email)
            .HasMaxLength(150)
            .IsRequired();

        modelBuilder.Entity<User>()
            .Property(u => u.PasswordHash)
            .IsRequired();

        modelBuilder.Entity<Client>()
            .Property(c => c.Name)
            .HasMaxLength(200)
            .IsRequired();

        modelBuilder.Entity<QuoteItem>()
            .Property(q => q.UnitPrice)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<QuoteItem>()
            .Property(q => q.Discount)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<QuoteItem>()
            .Property(q => q.TaxAmount)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<QuoteItem>()
            .Property(q => q.Total)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<InvoiceItem>()
            .Property(i => i.UnitPrice)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<InvoiceItem>()
            .Property(i => i.Discount)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<InvoiceItem>()
            .Property(i => i.TaxAmount)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<InvoiceItem>()
            .Property(i => i.Total)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Invoice>()
            .Property(i => i.Subtotal)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Invoice>()
            .Property(i => i.Discount)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Invoice>()
            .Property(i => i.TaxAmount)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Invoice>()
            .Property(i => i.Total)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Invoice>()
            .Property(i => i.PaidAmount)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Invoice>()
            .Property(i => i.Balance)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Expense>()
            .Property(e => e.Amount)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Quote>()
            .Property(q => q.Subtotal)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Quote>()
            .Property(q => q.Discount)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Quote>()
            .Property(q => q.TaxAmount)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Quote>()
            .Property(q => q.Total)
            .HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Admin" },
            new Role { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Manager" },
            new Role { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Employee" }
        );
    }
}
