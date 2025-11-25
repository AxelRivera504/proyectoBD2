using Comercializadora.WebApi.Features.Products;
using Comercializadora.WebApi.Infrastructure.Comercializadora;
using Microsoft.EntityFrameworkCore;

namespace Comercializadora.WebApi.Common
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDataAccess(this IServiceCollection service, IConfiguration configuration)
        {
            var connectionTestAxelRiveraBD = configuration.GetConnectionString("proyectoBd2");
            service.AddDbContext<ProyectoBd2Context>(options => options.UseSqlServer(connectionTestAxelRiveraBD)
            .LogTo(Console.WriteLine, new[] { DbLoggerCategory.Database.Command.Name }, LogLevel.Information).EnableSensitiveDataLogging());
            return service;
        }

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            return services.AddScoped<ProyectoBd2Context>()
                           .AddScoped<IProductService, ProductService>();

        }
    }
}
