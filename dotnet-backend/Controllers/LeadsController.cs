using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CrmApi.Models;
using CrmApi.Services;

namespace CrmApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LeadsController : ControllerBase
{
    private readonly ILeadService _leadService;

    public LeadsController(ILeadService leadService)
    {
        _leadService = leadService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Lead>>> GetAll()
    {
        var leads = await _leadService.GetAllAsync();
        return Ok(leads);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Lead>> GetById(int id)
    {
        var lead = await _leadService.GetByIdAsync(id);
        if (lead == null)
        {
            return NotFound();
        }
        return Ok(lead);
    }

    [HttpPost]
    public async Task<ActionResult<Lead>> Create([FromBody] Lead lead)
    {
        var created = await _leadService.CreateAsync(lead);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Lead>> Update(int id, [FromBody] Lead lead)
    {
        var updated = await _leadService.UpdateAsync(id, lead);
        if (updated == null)
        {
            return NotFound();
        }
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _leadService.DeleteAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}
