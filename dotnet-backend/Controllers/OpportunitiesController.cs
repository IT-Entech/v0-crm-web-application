using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CrmApi.Models;
using CrmApi.Services;

namespace CrmApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OpportunitiesController : ControllerBase
{
    private readonly IOpportunityService _opportunityService;

    public OpportunitiesController(IOpportunityService opportunityService)
    {
        _opportunityService = opportunityService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Opportunity>>> GetAll()
    {
        var opportunities = await _opportunityService.GetAllAsync();
        return Ok(opportunities);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Opportunity>> GetById(int id)
    {
        var opportunity = await _opportunityService.GetByIdAsync(id);
        if (opportunity == null)
        {
            return NotFound();
        }
        return Ok(opportunity);
    }

    [HttpPost]
    public async Task<ActionResult<Opportunity>> Create([FromBody] Opportunity opportunity)
    {
        var created = await _opportunityService.CreateAsync(opportunity);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Opportunity>> Update(int id, [FromBody] Opportunity opportunity)
    {
        var updated = await _opportunityService.UpdateAsync(id, opportunity);
        if (updated == null)
        {
            return NotFound();
        }
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _opportunityService.DeleteAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}
