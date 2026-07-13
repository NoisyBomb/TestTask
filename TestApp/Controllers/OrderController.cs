using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestApp.Data;
using TestApp.Models;
using TestApp.Dtos;

namespace TestApp.Controllers;
[ApiController]
[Route("api/orders")]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrderController(AppDbContext context)
    {
        _context = context;
    }

    private static OrderDto ToDto(Order order) => new()
    {
        Id = order.Id,
        SenderCity = order.SenderCity,
        SenderAddress = order.SenderAddress,
        ReceiverCity = order.ReceiverCity,
        ReceiverAddress = order.ReceiverAddress,
        Weight = order.Weight,
        OrderPickupDate = order.OrderPickupDate
    };
    
    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _context.Orders.OrderByDescending(x => x.Id).Select(order => ToDto(order)).ToListAsync();
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(int id)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(x => x.Id == id);
        if (order == null) return NotFound();
        return Ok(ToDto(order));
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
    {
        var order = new Order()
        {
            SenderAddress = dto.SenderAddress,
            SenderCity = dto.SenderCity,
            ReceiverAddress = dto.ReceiverAddress,
            ReceiverCity = dto.ReceiverCity,
            Weight = dto.Weight,
            OrderPickupDate = dto.OrderPickupDate,
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, ToDto(order));
    }
}