using System.ComponentModel.DataAnnotations;

namespace TestApp.Dtos;

public class CreateOrderDto
{
    [Required]
    public string SenderCity { get; set; } = string.Empty;
    [Required]
    public string SenderAddress { get; set; } =  string.Empty;
    [Required]
    public string ReceiverCity { get; set; } = string.Empty;
    [Required]
    public string ReceiverAddress { get; set; } = string.Empty;
    [Range(0.01, double.MaxValue, ErrorMessage = "Weight must be greater than 0")]
    public decimal Weight { get; set; }
    [Required]
    public DateOnly OrderPickupDate { get; set; }
}