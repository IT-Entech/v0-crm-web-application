using Microsoft.EntityFrameworkCore;
using CrmApi.Data;
using CrmApi.Models;

namespace CrmApi.Services;

public class ContactService : IContactService
{
    private readonly ApplicationDbContext _context;

    public ContactService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Contact>> GetAllAsync()
    {
        return await _context.Contacts.ToListAsync();
    }

    public async Task<Contact?> GetByIdAsync(int id)
    {
        return await _context.Contacts.FindAsync(id);
    }

    public async Task<Contact> CreateAsync(Contact contact)
    {
        contact.CreatedAt = DateTime.UtcNow;
        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync();
        return contact;
    }

    public async Task<Contact?> UpdateAsync(int id, Contact contact)
    {
        var existingContact = await _context.Contacts.FindAsync(id);
        if (existingContact == null) return null;

        existingContact.Name = contact.Name;
        existingContact.Email = contact.Email;
        existingContact.Phone = contact.Phone;
        existingContact.Company = contact.Company;
        existingContact.Position = contact.Position;
        existingContact.Status = contact.Status;
        existingContact.Notes = contact.Notes;
        existingContact.AssignedToId = contact.AssignedToId;
        existingContact.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existingContact;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var contact = await _context.Contacts.FindAsync(id);
        if (contact == null) return false;

        _context.Contacts.Remove(contact);
        await _context.SaveChangesAsync();
        return true;
    }
}
