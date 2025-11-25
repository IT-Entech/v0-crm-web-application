namespace CrmApi.Models;

public class Opportunity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Stage { get; set; } = "Prospecting";
    public decimal Value { get; set; }
    public decimal Probability { get; set; }
    public DateTime? ExpectedCloseDate { get; set; }
    public string? Description { get; set; }
    public int? ContactId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? AssignedToId { get; set; }
}
