using CrmApi.Models;

namespace CrmApi.Services;

public interface IOpportunityService
{
    Task<IEnumerable<Opportunity>> GetAllAsync();
    Task<Opportunity?> GetByIdAsync(int id);
    Task<Opportunity> CreateAsync(Opportunity opportunity);
    Task<Opportunity?> UpdateAsync(int id, Opportunity opportunity);
    Task<bool> DeleteAsync(int id);
}
