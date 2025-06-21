import React from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from "react";
import CountdownTimer from "../CountdownTimer"; 

const ExploreItems = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8); 
  const [data, setData] = useState(null);
  const [allData, setAllData] = useState([])
  
  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
       setData({ data });
       setIsLoading(false);
    }, 2000);
 }, []);

  const [collections, setCollections] = useState([]);

  async function getData() {
    try {
      const { data } = await axios.get(`https://us-central1-nft-cloud-functions.cloudfunctions.net/explore`);
      // Important: Assuming the API provides an 'expiryDate' for each item.
      // If not, you'll need to add a placeholder or generate one for demonstration.
      // Example of adding a placeholder expiry date if your API doesn't provide it:
      const collectionsWithExpiry = data.map(item => ({
        ...item,
        // Example: Add 24 hours to the current time for demonstration
        // In a real application, this would come from your API
        expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).getTime() // Example: 24 hours from now
        
      }));
      setAllData(data);
      setCollections(data.slice(0, visibleCount));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false); // Set loading to false after fetch completes
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleLoadMore = () => {
    const newVisibleCount = visibleCount + 4;
    setVisibleCount(newVisibleCount);
    setCollections(allData.slice(0, newVisibleCount))
  };

  return (
    <>
      <div>
        <select id="filter-items" defaultValue="">
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      {collections && collections.map((collection, index) => (
        <div
          key={index.id}
          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          style={{ display: "block", backgroundSize: "cover" }}
        >
          <div className="nft__item">
            <div className="author_list_pp">
              <Link
                to={`/author/${collection.authorId}`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
              >
                <img className="lazy" src={collection.authorImage} alt="" />
                <i className="fa fa-check"></i>
              </Link>
            </div>
            {collection.expiryDate && (
                      <CountdownTimer expiryDate={new Date(collection.expiryDate).getTime()} />
                    )}

            <div className="nft__item_wrap">
              <div className="nft__item_extra">
                <div className="nft__item_buttons">
                  <button>Buy Now</button>
                  <div className="nft__item_share">
                    <h4>Share</h4>
                    <a href="" target="_blank" rel="noreferrer">
                      <i className="fa fa-facebook fa-lg"></i>
                    </a>
                    <a href="" target="_blank" rel="noreferrer">
                      <i className="fa fa-twitter fa-lg"></i>
                    </a>
                    <a href="">
                      <i className="fa fa-envelope fa-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
              <Link to={`/item-details/${collection.nftId}`}>
                <img src={collection.nftImage} className="lazy nft__item_preview" alt="" />
              </Link>
            </div>
            <div className="nft__item_info">
              <Link to={`/item-details/${collection.nftId}`}>
                <h4>{collection.title}</h4>
              </Link>
              <div className="nft__item_price">{collection.price} ETH</div>
              <div className="nft__item_like">
                <i className="fa fa-heart"></i>
                <span>{collection.likes}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="col-md-12 text-center">
        <Link to="" id="loadmore" className="btn-main lead">
          {collections.map(collection => (
          <div key={collections.id}>{collections.name}</div> // Adjust according to your data structure
        ))}
        {visibleCount < allData.length && (
          <button onClick={handleLoadMore}>Load More</button>
        )}
        </Link>
      </div>
    </>
  );
};

export default ExploreItems;
