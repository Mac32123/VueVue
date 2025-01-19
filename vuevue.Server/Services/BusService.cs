using Microsoft.EntityFrameworkCore;
using vuevue.Server.Database;
using vuevue.Server.Models;

namespace vuevue.Server.Services
{
    public class BusService : IBusService
    {
        private readonly AppDbContext _context;

        public BusService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<string>> GetBusStopsForUser(string userId)
        {
            // Wyszukaj przystanki dla danego użytkownika
            var busStops = await _context.UserBusStops
                .Where(ubs => ubs.UserId.ToString() == userId)
                .Select(ubs => ubs.ExternalBusStopId) // Możesz też użyć Int, jeśli potrzebujesz ID w formie int
                .ToListAsync();

            // Jeżeli chcesz zwrócić int, upewnij się, że ExternalBusStopId jest typu int
            return busStops;
        }

        public string DeleteBusForUser(string userId, string id)
        {
            try
            {
                var toDelete = _context.UserBusStops.Where(e => e.UserId == userId && e.ExternalBusStopId == id).First();
                _context.UserBusStops.Remove(toDelete);
                _context.SaveChanges();
                return "OK";
            }
            catch(Exception _)
            {
                return "NotOK";
            }
            
        }

        public async Task AddBusStopsForUser(string userId, List<string> busStopIds)
        {
            if (busStopIds == null || busStopIds.Count == 0)
            {
                throw new ArgumentException("Lista przystanków nie może być pusta.");
            }

            // Pobieramy użytkownika z bazy danych
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("Użytkownik o podanym identyfikatorze nie istnieje.");
            }

            // Tworzymy listę obiektów UserBusStop
            var userBusStops = busStopIds.Select(busStopId => new UserBusStop
            {
                UserId = userId, // Załóżmy, że userId jest typu int
                ExternalBusStopId = busStopId
            }).ToList();

            // Zapisujemy przystanki w bazie danych
            await _context.UserBusStops.AddRangeAsync(userBusStops);
            await _context.SaveChangesAsync();
        }
    }

}
