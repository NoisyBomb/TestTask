using Microsoft.EntityFrameworkCore;
using TestApp.Models;

namespace TestApp.Data;


public class AppDbContext : DbContext
{
    public AppDbContext (DbContextOptions<AppDbContext> options) :  base (options){}
    
    public DbSet<Order> Orders => Set<Order>();
}