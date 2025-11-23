import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { ResponsiveNavbar } from '../components/Navbar.jsx';
import { ResponsiveFooter } from '../components/Footer.jsx';
import './NFTMinting.css';

const NFTMinting = () => {
  const { user } = useContext(AuthContext);
  const [eligibleIPs, setEligibleIPs] = useState([]);
  const [publicIPs, setPublicIPs] = useState([]);
  const [loadingEligible, setLoadingEligible] = useState(true);
  const [loadingPublic, setLoadingPublic] = useState(true);
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [prepared, setPrepared] = useState(null); // holds metadata from prepare step

  useEffect(() => {
    if (user) {
      fetchEligibleIPs();
      fetchPublicIPs();
    }
  }, [user]);

  const fetchEligibleIPs = async () => {
    try {
      setLoadingEligible(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/ip/nft-ready', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setEligibleIPs(data.ips || []);
      } else {
        setError(data.message || 'Failed to fetch NFT-ready IPs');
      }
    } catch (err) {
      console.error('Error fetching NFT-ready IPs:', err);
      setError('Failed to load your IP registrations');
    } finally {
      setLoadingEligible(false);
    }
  };

  const fetchPublicIPs = async () => {
    try {
      setLoadingPublic(true);
      const response = await fetch('http://localhost:5000/api/ip/marketplace');
      const data = await response.json();
      if (data.success) {
        setPublicIPs(data.ips || []);
      }
    } catch (err) {
      console.error('Public IP fetch error:', err);
    } finally {
      setLoadingPublic(false);
    }
  };

  const prepareAndMint = async (ipId) => {
    try {
      setMinting(true);
      setError('');
      setSuccess('');
      
      const token = localStorage.getItem('token');

      // Step 1: Prepare NFT metadata
      const prepareResponse = await fetch('http://localhost:5000/api/nft/prepare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ipRegistrationId: ipId })
      });

      const prepareData = await prepareResponse.json();

      if (!prepareData.success) {
        throw new Error(prepareData.message || 'Failed to prepare NFT metadata');
      }

      setPrepared(prepareData); // store for UI (optional future preview)

      // Step 2: Complete the minting
      const mintResponse = await fetch('http://localhost:5000/api/nft/complete-mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ipRegistrationId: ipId,
          metadata: prepareData.metadata,
          tokenURI: prepareData.tokenURI,
          metadataHash: prepareData.metadataHash,
          dataHash: prepareData.dataHash,
          priceETH: prepareData.pricing?.suggestedPrice || 0.1
        })
      });

      const mintData = await mintResponse.json();

      if (!mintData.success) {
        throw new Error(mintData.message || 'Failed to complete NFT minting');
      }

      setSuccess(`NFT minted successfully! Token ID: ${mintData.nft.tokenId}`);
      
      // Refresh the list
      setTimeout(() => {
        fetchEligibleIPs();
        setSuccess('');
      }, 3000);

    } catch (err) {
      console.error('Minting error:', err);
      setError(err.message || 'Failed to mint NFT');
    } finally {
      setMinting(false);
    }
  };

  if (!user) {
    return (
      <div className="nft-minting-container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to mint your IP registrations as NFTs</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <ResponsiveNavbar />
    <div className="nft-minting-container mb-8">
      <div className="minting-header mt-16">
        <h1>Mint Your IP as NFT</h1>
        <p>Convert your confirmed IP registrations into tradeable NFTs</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {loadingEligible ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your IP registrations...</p>
        </div>
      ) : eligibleIPs.length === 0 ? (
        <div className="empty-state">
          <h3>No IP Registrations Available</h3>
          <p>You need confirmed IP registrations that haven't been minted yet.</p>
          <p>Register your intellectual property first, then come back here to mint it as an NFT.</p>
        </div>
      ) : (
        <div className="ip-grid">
          {eligibleIPs.map((ip) => {
            const statusLabel = ip.status ? ip.status.charAt(0).toUpperCase() + ip.status.slice(1) : 'Pending';
            return (
              <div key={ip._id} className="ip-card">
                <div className="ip-card-header">
                  <span className="ip-type-badge">{ip.ipType}</span>
                  <span className={`ip-status-badge status-${ip.status || 'pending'}`}>{statusLabel}</span>
                </div>
                <div className="ip-card-body">
                  <h3>{ip.title}</h3>
                  <p className="ip-description">{ip.description}</p>
                  <div className="ip-details">
                    <div className="detail-item">
                      <span className="label">Category:</span>
                      <span className="value">{ip.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Registration Date:</span>
                      <span className="value">{new Date(ip.registrationDate).toLocaleDateString()}</span>
                    </div>
                    {ip.transactionHash && (
                      <div className="detail-item">
                        <span className="label">TX Hash:</span>
                        <span className="value hash">{ip.transactionHash.substring(0, 10)}...</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ip-card-footer">
                  <button
                    className="mint-button"
                    onClick={() => prepareAndMint(ip._id)}
                    disabled={minting}
                  >
                    {minting ? (
                      <>
                        <span className="spinner-small"></span>
                        Minting...
                      </>
                    ) : (
                      'Mint as NFT'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="public-section">
        <h2>Public IPs</h2>
        {loadingPublic ? (
          <p>Loading public IPs...</p>
        ) : publicIPs.length === 0 ? (
          <p>No public IPs available.</p>
        ) : (
          <div className="public-ip-grid">
            {publicIPs.slice(0, 6).map(ip => (
              <div key={ip._id} className="public-ip-card">
                <div className="public-ip-card-inner">
                  <h4>{ip.title}</h4>
                  <p className="public-ip-desc">{ip.description}</p>
                  <div className="public-meta">
                    <span className="chip chip-type">{ip.ipType}</span>
                    <span className="chip chip-date">{new Date(ip.registrationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="public-ip-footer">
                    <button className="mint-button mini" onClick={() => prepareAndMint(ip._id)} disabled={minting}>Mint</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="minting-info">
        <h3>About NFT Minting</h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>🎨 What is NFT Minting?</h4>
            <p>Converting your IP registration into a unique, tradeable NFT on the blockchain.</p>
          </div>
          <div className="info-item">
            <h4>💰 Marketplace Ready</h4>
            <p>Once minted, your NFT will be automatically listed in our marketplace.</p>
          </div>
          <div className="info-item">
            <h4>🔒 Ownership Proof</h4>
            <p>NFTs provide immutable proof of ownership and creation timestamp.</p>
          </div>
          <div className="info-item">
            <h4>💎 Royalties</h4>
            <p>Earn 5% royalties on every future sale of your NFT.</p>
          </div>
        </div>
      </div>
    </div>
    <ResponsiveFooter />
    </>
  );
};

export default NFTMinting;
