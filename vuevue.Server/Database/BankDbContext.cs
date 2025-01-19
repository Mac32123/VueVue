using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using vuevue.Server.Models;

namespace vuevue.Server.Database
{

    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<UserBusStop> UserBusStops { get; set; }
    }

    public class ApplicationUser : IdentityUser
    {

    }
}