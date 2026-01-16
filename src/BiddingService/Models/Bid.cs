using MongoDB.Entities;

namespace BiddingService.Models
{
    public class Bid : Entity
    {
        public string AutionId { get; set; } = default!;
        public string Bidder { get; set; } = default!;
        public DateTime BidTime { get; set; } = DateTime.UtcNow;
        public int Amount { get; set; }
        public BidStatus BidStatus { get; set; }
    }
}
