using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CrmApi.Services;

namespace CrmApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("stats")]
    public async Task<ActionResult> GetStats()
    {
        var stats = await _dashboardService.GetStatsAsync();
        return Ok(stats);
    }

    [HttpGet("sales-data")]
    public async Task<ActionResult> GetSalesData()
    {
        var data = await _dashboardService.GetSalesDataAsync();
        return Ok(data);
    }

    [HttpGet("recent-activities")]
    public async Task<ActionResult> GetRecentActivities()
    {
        var activities = await _dashboardService.GetRecentActivitiesAsync();
        return Ok(activities);
    }
}
