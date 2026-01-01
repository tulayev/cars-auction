using Polly;
using Polly.Extensions.Http;
using System.Net;

namespace SearchService.Helpers
{
    public static class RetryPolicyHelper
    {
        public static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
        {
            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .OrResult(msg => msg.StatusCode == HttpStatusCode.NotFound)
                .WaitAndRetryForeverAsync(_ => TimeSpan.FromSeconds(3));
        }
    }
}
