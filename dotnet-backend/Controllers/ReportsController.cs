using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CrmApi.Services;

namespace CrmApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("sales")]
    public async Task<ActionResult> GetSalesReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var start = startDate ?? DateTime.UtcNow.AddMonths(-1);
        var end = endDate ?? DateTime.UtcNow;
        
        var report = await _reportService.GetSalesReportAsync(start, end);
        return Ok(report);
    }

    [HttpGet("leads")]
    public async Task<ActionResult> GetLeadsReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var start = startDate ?? DateTime.UtcNow.AddMonths(-1);
        var end = endDate ?? DateTime.UtcNow;
        
        var report = await _reportService.GetLeadsReportAsync(start, end);
        return Ok(report);
    }

    [HttpGet("activities")]
    public async Task<ActionResult> GetActivityReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var start = startDate ?? DateTime.UtcNow.AddMonths(-1);
        var end = endDate ?? DateTime.UtcNow;
        
        var report = await _reportService.GetActivityReportAsync(start, end);
        return Ok(report);
    }
}
