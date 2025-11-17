import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { ResponsiveNavbar } from '../components/Navbar.jsx';
import { ResponsiveFooter } from '../components/Footer.jsx';
import './NFTMarketplace.css';

const NFTMarketplace = () => {
  const { user } = useContext(AuthContext);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sortBy: 'newest'
  });

  useEffect(() => {
    fetchMarketplaceNFTs();
  }, [filters]);

  const fetchMarketplaceNFTs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-');
        if (min) queryParams.append('minPrice', min);
        if (max) queryParams.append('maxPrice', max);
      }
      queryParams.append('sortBy', filters.sortBy);

      const response = await fetch(`http://localhost:5000/api/nft/marketplace?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setNfts(data.nfts || []);
      } else {
        setError(data.message || 'Failed to fetch NFTs');
      }
    } catch (err) {
      console.error('Error fetching marketplace NFTs:', err);
      setError('Failed to load marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <>
    <ResponsiveNavbar />
    <div className="nft-marketplace-container mt-16">
      <div className="marketplace-header">
        <h1>NFT Marketplace</h1>
        <p>Discover and trade intellectual property NFTs</p>
      </div>

      {/* Filters Section */}
      <div className="marketplace-filters">
        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={filters.category} 
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Software">Software</option>
            <option value="Music">Music</option>
            <option value="Art">Art</option>
            <option value="Literature">Literature</option>
            <option value="Patent">Patent</option>
            <option value="Trademark">Trademark</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Price Range:</label>
          <select 
            value={filters.priceRange} 
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="0-0.1">0 - 0.1 ETH</option>
            <option value="0.1-0.5">0.1 - 0.5 ETH</option>
            <option value="0.5-1">0.5 - 1 ETH</option>
            <option value="1-5">1 - 5 ETH</option>
            <option value="5-">5+ ETH</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select 
            value={filters.sortBy} 
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading NFTs...</p>
        </div>
      ) : nfts.length === 0 ? (
        <div className="empty-state">
          <h3>No NFTs Available</h3>
          <p>There are no NFTs listed in the marketplace yet.</p>
          <p>Be the first to mint and list your IP as an NFT!</p>
        </div>
      ) : (
        <div className="nft-grid">
          {nfts.map((nft) => (
            <div key={nft._id} className="nft-card">
              {/* Card Content - No Image Section */}
              <div className="nft-card-content">
                <div className="nft-header">
                  <span className="nft-type-badge">{nft.ipType}</span>
                  {nft.isVerified && (
                    <span className="verified-badge">✓ Verified</span>
                  )}
                </div>

                <h3 className="nft-title">{nft.title}</h3>
                <p className="nft-description">{nft.description}</p>

                <div className="nft-details">
                  <div className="detail-row">
                    <span className="label">CREATOR:</span>
                    <span className="value creator-name">
                      {nft.creator?.name || 'Unknown'}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="label">CURRENT PRICE</span>
                    <span className="value price">{nft.priceETH.toFixed(3)} ETH</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Market Value</span>
                    <span className="value market-value">
                      {(nft.priceETH * 2).toFixed(3)} ETH
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Token ID</span>
                    <span className="value">#{nft.tokenId}</span>
                  </div>
                </div>

                <div className="nft-stats">
                  <div className="stat">
                    <span className="stat-icon">👁️</span>
                    <span>{nft.views || 0} views</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">❤️</span>
                    <span>{nft.favorites || 0} favorites</span>
                  </div>
                </div>

                <div className="nft-actions">
                  <button className="btn-primary">
                    Buy Now
                  </button>
                  <button className="btn-secondary">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <ResponsiveFooter />
    </>
  );
};

export default NFTMarketplace;
