using Microsoft.EntityFrameworkCore;
using TestApp.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));
var app = builder.Build();


app.UseHttpsRedirection();
app.MapControllers();
app.Run();
