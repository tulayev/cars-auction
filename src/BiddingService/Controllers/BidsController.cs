using AutoMapper;
using BiddingService.DTOs;
using BiddingService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BidsController : ControllerBase
    {
        private readonly DB _db;
        private readonly IMapper _mapper;

        public BidsController(DB db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpGet("{auctionId}")]
        public async Task<ActionResult<IEnumerable<BidDto>>> GetBidsForAuction(string auctionId)
        {
            var bids = await _db.Find<Bid>()
                .Match(x => x.AutionId == auctionId)
                .Sort(x => x.Descending(x => x.BidTime))
                .ExecuteAsync();

            return bids.Select(_mapper.Map<BidDto>).ToList();
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BidDto>> PlaceBid(string auctionId, int amount)
        {
            var auction = await _db.Find<Auction>().OneAsync(auctionId);

            if (auction is null)
            {
                return NotFound();
            }

            if (auction.Seller == User.Identity!.Name)
            {
                return BadRequest("You cannot bid on your own auction");
            }

            var bid = new Bid
            {
                Amount = amount,
                AutionId = auctionId,
                Bidder = User.Identity.Name!
            };

            if (auction.AuctionEnd < DateTime.UtcNow)
            {
                bid.BidStatus = BidStatus.Finished;
            }
            else 
            {
                var highBid = await _db.Find<Bid>()
                   .Match(x => x.AutionId == auctionId)
                   .Sort(x => x.Descending(x => x.Amount))
                   .ExecuteFirstAsync();

                if (highBid is not null && amount > highBid.Amount || highBid is null)
                {
                    bid.BidStatus = amount > auction.ReservePrice
                        ? BidStatus.Accepted
                        : BidStatus.AcceptedBelowReserve;
                }

                if (highBid is not null && bid.Amount <= highBid.Amount)
                {
                    bid.BidStatus = BidStatus.TooLow;
                }
            }

            await _db.SaveAsync(bid);

            return Ok(_mapper.Map<BidDto>(bid));
        }
    }
}
