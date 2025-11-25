using Microsoft.EntityFrameworkCore;
using CrmApi.Data;

namespace CrmApi.Services;

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _context;

    public ReportService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<object> GetSalesReportAsync(DateTime startDate, DateTime endDate)
    {
        var opportunities = await _context.Opportunities
            .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate)
            .ToListAsync();

        return new
        {
            TotalValue = opportunities.Sum(o => o.Value),
            WonValue = opportunities.Where(o => o.Stage == "Closed Won").Sum(o => o.Value),
            Count = opportunities.Count,
            WonCount = opportunities.Count(o => o.Stage == "Closed Won"),
            ByStage = opportunities.GroupBy(o => o.Stage)
                .Select(g => new { Stage = g.Key, Count = g.Count(), Value = g.Sum(o => o.Value) })
        };
    }

    public async Task<object> GetLeadsReportAsync(DateTime startDate, DateTime endDate)
    {
        var leads = await _context.Leads
            .Where(l => l.CreatedAt >= startDate && l.CreatedAt <= endDate)
            .ToListAsync();

        return new
        {
            TotalLeads = leads.Count,
            ByStatus = leads.GroupBy(l => l.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() }),
            BySource = leads.GroupBy(l => l.Source)
                .Select(g => new { Source = g.Key, Count = g.Count() }),
            AverageScore = leads.Average(l => l.Score)
        };
    }

    public async Task<object> GetActivityReportAsync(DateTime startDate, DateTime endDate)
    {
        var activities = await _context.Activities
            .Where(a => a.CreatedAt >= startDate && a.CreatedAt <= endDate)
            .ToListAsync();

        return new
        {
            TotalActivities = activities.Count,
            ByType = activities.GroupBy(a => a.Type)
                .Select(g => new { Type = g.Key, Count = g.Count() })
        };
    }
}
