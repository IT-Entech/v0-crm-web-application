using CrmApi.Models;

namespace CrmApi.Services;

public interface ILeadService
{
    Task<IEnumerable<Lead>> GetAllAsync();
    Task<Lead?> GetByIdAsync(int id);
    Task<Lead> CreateAsync(Lead lead);
    Task<Lead?> UpdateAsync(int id, Lead lead);
    Task<bool> DeleteAsync(int id);
}
