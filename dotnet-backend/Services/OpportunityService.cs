using Microsoft.EntityFrameworkCore;
using CrmApi.Data;
using CrmApi.Models;

namespace CrmApi.Services;

public class OpportunityService : IOpportunityService
{
    private readonly ApplicationDbContext _context;

    public OpportunityService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Opportunity>> GetAllAsync()
    {
        return await _context.Opportunities.ToListAsync();
    }

    public async Task<Opportunity?> GetByIdAsync(int id)
    {
        return await _context.Opportunities.FindAsync(id);
    }

    public async Task<Opportunity> CreateAsync(Opportunity opportunity)
    {
        opportunity.CreatedAt = DateTime.UtcNow;
        _context.Opportunities.Add(opportunity);
        await _context.SaveChangesAsync();
        return opportunity;
    }

    public async Task<Opportunity?> UpdateAsync(int id, Opportunity opportunity)
    {
        var existing = await _context.Opportunities.FindAsync(id);
        if (existing == null) return null;

        existing.Name = opportunity.Name;
        existing.Stage = opportunity.Stage;
        existing.Value = opportunity.Value;
        existing.Probability = opportunity.Probability;
        existing.ExpectedCloseDate = opportunity.ExpectedCloseDate;
        existing.Description = opportunity.Description;
        existing.ContactId = opportunity.ContactId;
        existing.AssignedToId = opportunity.AssignedToId;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var opportunity = await _context.Opportunities.FindAsync(id);
        if (opportunity == null) return false;

        _context.Opportunities.Remove(opportunity);
        await _context.SaveChangesAsync();
        return true;
    }
}
