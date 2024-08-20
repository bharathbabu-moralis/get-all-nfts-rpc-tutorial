import React, { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const [address, setAddress] = useState('');
  const [limit, setLimit] = useState('');
  const [cursor, setCursor] = useState('');
  const [excludeSpam, setExcludeSpam] = useState(false);
  const [normalizeMetadata, setNormalizeMetadata] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [cursorResponse, setCursorResponse] = useState(null);

  // Define the provider
  const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_MORALIS_NODE_URL);

  const fetchNFTs = async () => {
    try {
      const params = [{
        "address": address,
        "limit": limit || undefined,
        "cursor": cursor || undefined,
        "excludeSpam": excludeSpam || undefined,
        "normalizeMetadata": normalizeMetadata || undefined
      }];

      // Fetch the NFTs using ethers.js
      const response = await provider.send("eth_getNFTBalances", params);

      // Parse response and set state
      setNfts(response.result || []);
      setCursorResponse(response.cursor || null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cursorResponse);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="https://admin.moralis.io/assets/moralisLogo-DnjUHa6D.svg"
          className="App-logo"
          alt="Moralis Logo"
        />
        <h1>Moralis Extended RPC Demo</h1>
        <p><a href="https://docs.moralis.io/rpc-nodes/reference/extended-rpc/eth_getNFTBalances" target="_blank" rel="noopener noreferrer">RPC API: eth_getNFTBalances</a></p>
      </header>
      
      <div className="input-container">
        <input
          type="text"
          placeholder="Address (required)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Limit (optional)"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cursor (optional)"
          value={cursor}
          onChange={(e) => setCursor(e.target.value)}
        />
        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              checked={excludeSpam}
              onChange={(e) => setExcludeSpam(e.target.checked)}
            />
            Exclude Spam
          </label>
          <label>
            <input
              type="checkbox"
              checked={normalizeMetadata}
              onChange={(e) => setNormalizeMetadata(e.target.checked)}
            />
            Normalize Metadata
          </label>
        </div>
        <button onClick={fetchNFTs}>Fetch NFTs</button>
      </div>

      <div className="nft-container">
        {nfts.map((nft, index) => {
          const metadata = normalizeMetadata && nft.normalized_metadata
            ? nft.normalized_metadata
            : JSON.parse(nft.metadata || '{}');
            return (
              <div className="nft-card" key={index}>
                <img src={metadata.image || ''} alt={metadata.name || 'No name available'} />
                <h3>{metadata.name || 'No name available'}</h3>
                <p>{metadata.description ? `${metadata.description.slice(0, 100)}...` : 'No description available'}</p>
                <div className="token-info">
                  <p><strong>Token Address:</strong> {nft.token_address}</p>
                  <p><strong>Token ID:</strong> {nft.token_id}</p>
                </div>
              </div>
            );
            
        })}
      </div>

      {cursorResponse && (
        <div className="cursor-container">
          <p><strong>Cursor:</strong></p>
          <textarea value={cursorResponse} readOnly></textarea>
          <button onClick={handleCopy}>Copy Cursor</button>
        </div>
      )}
    </div>
  );
}

export default App;