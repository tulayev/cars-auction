using BiddingService.Models;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace BiddingService.Consumers
{
    public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
    {
        private readonly DB _db;

        public AuctionCreatedConsumer(DB db)
        {
            _db = db;
        }

        public async Task Consume(ConsumeContext<AuctionCreated> context)
        {
            var auction = new Auction
            {
                ID = context.Message.Id.ToString(),
                AuctionEnd = context.Message.AuctionEnd,
                Seller = context.Message.Seller,
                ReservePrice = context.Message.ReservePrice,
            };

            await _db.SaveAsync(auction);
        }
    }
}
