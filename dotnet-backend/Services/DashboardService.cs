using Microsoft.EntityFrameworkCore;
using CrmApi.Data;
using CrmApi.DTOs;

namespace CrmApi.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStats> GetStatsAsync()
    {
        var totalContacts = await _context.Contacts.CountAsync();
        var totalLeads = await _context.Leads.CountAsync();
        var totalOpportunities = await _context.Opportunities.CountAsync();
        var totalRevenue = await _context.Opportunities
            .Where(o => o.Stage == "Closed Won")
            .SumAsync(o => o.Value);
        var activeTasks = await _context.Tasks
            .CountAsync(t => t.Status != "Completed");

        var convertedLeads = await _context.Leads
            .CountAsync(l => l.Status == "Converted");
        var conversionRate = totalLeads > 0 
            ? (decimal)convertedLeads / totalLeads * 100 
            : 0;

        return new DashboardStats
        {
            TotalContacts = totalContacts,
            TotalLeads = totalLeads,
            TotalOpportunities = totalOpportunities,
            TotalRevenue = totalRevenue,
            ActiveTasks = activeTasks,
            ConversionRate = conversionRate
        };
    }

    public async Task<IEnumerable<object>> GetSalesDataAsync()
    {
        var salesData = await _context.Opportunities
            .Where(o => o.CreatedAt >= DateTime.UtcNow.AddMonths(-6))
            .GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
            .Select(g => new
            {
                Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                Revenue = g.Where(o => o.Stage == "Closed Won").Sum(o => o.Value),
                Count = g.Count()
            })
            .OrderBy(x => x.Month)
            .ToListAsync();

        return salesData;
    }

    public async Task<IEnumerable<object>> GetRecentActivitiesAsync()
    {
        return await _context.Activities
            .OrderByDescending(a => a.CreatedAt)
            .Take(10)
            .Select(a => new
            {
                a.Id,
                a.Type,
                a.Description,
                a.CreatedAt
            })
            .ToListAsync();
    }
}
