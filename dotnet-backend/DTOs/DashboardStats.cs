namespace CrmApi.DTOs;

public class DashboardStats
{
    public int TotalContacts { get; set; }
    public int TotalLeads { get; set; }
    public int TotalOpportunities { get; set; }
    public decimal TotalRevenue { get; set; }
    public int ActiveTasks { get; set; }
    public decimal ConversionRate { get; set; }
}
