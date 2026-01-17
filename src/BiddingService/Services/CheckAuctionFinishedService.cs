using BiddingService.Models;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace BiddingService.Services
{
    public class CheckAuctionFinishedService : BackgroundService
    {
        private readonly DB _db;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<CheckAuctionFinishedService> _logger;

        public CheckAuctionFinishedService(DB db,
            IServiceProvider serviceProvider,
            ILogger<CheckAuctionFinishedService> logger)
        {
            _db = db;
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Starting check for finished auctions");

            stoppingToken.Register(() => _logger.LogInformation("==> Auction check is stopping!"));

            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckAuctions(stoppingToken);
                await Task.Delay(5000, stoppingToken);
            }
        }

        private async Task CheckAuctions(CancellationToken stoppingToken)
        {
            var finishedAuctions = await _db.Find<Auction>()
                .Match(x => x.AuctionEnd <= DateTime.UtcNow)
                .Match(x => !x.Finished)
                .ExecuteAsync(stoppingToken);

            if (finishedAuctions.Count == 0)
            {
                return;
            }

            _logger.LogInformation("==> Found {count} auctions that have completed.", finishedAuctions.Count);

            using var scope = _serviceProvider.CreateScope();
            var endpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

            foreach (var auction in finishedAuctions)
            {
                auction.Finished = true;
                await _db.SaveAsync(auction, stoppingToken);

                var winningBid = await _db.Find<Bid>()
                    .Match(x => x.AutionId == auction.ID)
                    .Match(x => x.BidStatus == BidStatus.Accepted)
                    .Sort(x => x.Descending(x => x.Amount))
                    .ExecuteFirstAsync(stoppingToken);

                await endpoint.Publish(new AuctionFinished 
                {
                    ItemSold = winningBid is not null,
                    AuctionId = auction.ID,
                    Winner = winningBid?.Bidder,
                    Amount = winningBid?.Amount,
                    Seller = auction.Seller
                }, stoppingToken);
            }
        }
    }
}
