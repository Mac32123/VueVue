using vuevue.Server.Models;

namespace vuevue.Server.Services
{
    public interface IBusService
    {
        Task<List<string>> GetBusStopsForUser(string userId);
        Task AddBusStopsForUser(string userId, List<string> busStopIds);
        public string DeleteBusForUser(string userId, string id);
    }
}
