using CrmApi.DTOs;

namespace CrmApi.Services;

public interface IDashboardService
{
    Task<DashboardStats> GetStatsAsync();
    Task<IEnumerable<object>> GetSalesDataAsync();
    Task<IEnumerable<object>> GetRecentActivitiesAsync();
}
