using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using LebanonPriceMap.Server.Services;
using Microsoft.Extensions.DependencyInjection;

namespace LebanonPriceMap.Server.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class ApiKeyAttribute : Attribute, IAsyncActionFilter
{
    private const string APIKEYNAME = "X-Api-Key";

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.HttpContext.Request.Headers.TryGetValue(APIKEYNAME, out var extractedApiKey))
        {
            context.Result = new ContentResult()
            {
                StatusCode = 401,
                Content = "Api Key was not provided"
            };
            return;
        }

        var storeService = context.HttpContext.RequestServices.GetRequiredService<StoreService>();
        var storeId = await storeService.ValidateApiKeyAsync(extractedApiKey);

        if (storeId == null)
        {
            context.Result = new ContentResult()
            {
                StatusCode = 401,
                Content = "Api Key is not valid"
            };
            return;
        }

        // Store the StoreId in HttpContext for use in the controller
        context.HttpContext.Items["StoreId"] = storeId.Value;

        await next();
    }
}
