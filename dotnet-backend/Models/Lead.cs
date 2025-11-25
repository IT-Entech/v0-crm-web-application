namespace CrmApi.Models;

public class Lead
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Company { get; set; }
    public string Status { get; set; } = "New";
    public string? Source { get; set; }
    public int Score { get; set; }
    public decimal? EstimatedValue { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? AssignedToId { get; set; }
}
