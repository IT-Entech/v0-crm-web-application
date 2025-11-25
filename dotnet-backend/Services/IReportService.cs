namespace CrmApi.Services;

public interface IReportService
{
    Task<object> GetSalesReportAsync(DateTime startDate, DateTime endDate);
    Task<object> GetLeadsReportAsync(DateTime startDate, DateTime endDate);
    Task<object> GetActivityReportAsync(DateTime startDate, DateTime endDate);
}
