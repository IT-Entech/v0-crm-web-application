using CrmApi.Models;

namespace CrmApi.Services;

public interface IContactService
{
    Task<IEnumerable<Contact>> GetAllAsync();
    Task<Contact?> GetByIdAsync(int id);
    Task<Contact> CreateAsync(Contact contact);
    Task<Contact?> UpdateAsync(int id, Contact contact);
    Task<bool> DeleteAsync(int id);
}
