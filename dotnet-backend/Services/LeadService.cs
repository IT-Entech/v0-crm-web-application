using Microsoft.EntityFrameworkCore;
using CrmApi.Data;
using CrmApi.Models;

namespace CrmApi.Services;

public class LeadService : ILeadService
{
    private readonly ApplicationDbContext _context;

    public LeadService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Lead>> GetAllAsync()
    {
        return await _context.Leads.ToListAsync();
    }

    public async Task<Lead?> GetByIdAsync(int id)
    {
        return await _context.Leads.FindAsync(id);
    }

    public async Task<Lead> CreateAsync(Lead lead)
    {
        lead.CreatedAt = DateTime.UtcNow;
        _context.Leads.Add(lead);
        await _context.SaveChangesAsync();
        return lead;
    }

    public async Task<Lead?> UpdateAsync(int id, Lead lead)
    {
        var existingLead = await _context.Leads.FindAsync(id);
        if (existingLead == null) return null;

        existingLead.Name = lead.Name;
        existingLead.Email = lead.Email;
        existingLead.Phone = lead.Phone;
        existingLead.Company = lead.Company;
        existingLead.Status = lead.Status;
        existingLead.Source = lead.Source;
        existingLead.Score = lead.Score;
        existingLead.EstimatedValue = lead.EstimatedValue;
        existingLead.Notes = lead.Notes;
        existingLead.AssignedToId = lead.AssignedToId;
        existingLead.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existingLead;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var lead = await _context.Leads.FindAsync(id);
        if (lead == null) return false;

        _context.Leads.Remove(lead);
        await _context.SaveChangesAsync();
        return true;
    }
}
