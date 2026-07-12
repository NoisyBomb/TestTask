using System.ComponentModel.DataAnnotations;

namespace TestApp.Models;

public class Order
{
    public int Id { get; set; }
    [Required]
    public string SenderCity { get; set; } = string.Empty;
    [Required]
    public string SenderAddress { get; set; } = string.Empty;
    [Required]
    public string ReceiverCity { get; set; } = string.Empty;
    [Required]
    public string ReceiverAddress { get; set; } = string.Empty;
    [Required]
    public decimal Weight { get; set; }
    [Required]
    public DateOnly OrderPickupDate { get; set;}
}