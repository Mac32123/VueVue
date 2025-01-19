using Microsoft.AspNetCore.Identity;
using vuevue.Server.Database;

namespace vuevue.Server.Models
{
    public class UserBusStop
    {
        public int Id { get; set; }
        public string UserId { get; set; }  // Powiązanie z użytkownikiem
        public string ExternalBusStopId { get; set; }  // ID przystanku z zewnętrznej bazy
        public ApplicationUser User { get; set; } // Nawigacja do użytkownika
    }
}
