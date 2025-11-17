import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NFT from './models/NFTModel.js';
import IP from './models/IPModel.js';
import User from './models/UserModel.js';

dotenv.config();

async function checkNFTs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Count all NFTs
    const totalNFTs = await NFT.countDocuments();
    console.log(`\n📊 Total NFTs in database: ${totalNFTs}`);

    // Get all NFTs
    const allNFTs = await NFT.find();
    
    console.log('\n🎨 All NFTs:');
    allNFTs.forEach((nft, index) => {
      console.log(`\n--- NFT #${index + 1} ---`);
      console.log(`Token ID: ${nft.tokenId}`);
      console.log(`Title: ${nft.title}`);
      console.log(`Description: ${nft.description}`);
      console.log(`Creator ID: ${nft.creator}`);
      console.log(`Owner ID: ${nft.owner}`);
      console.log(`Is Listed: ${nft.isListed}`);
      console.log(`Status: ${nft.status}`);
      console.log(`Price ETH: ${nft.priceETH}`);
      console.log(`IP Type: ${nft.ipType}`);
      console.log(`Category: ${nft.category}`);
      console.log(`Verified: ${nft.isVerified}`);
      console.log(`Minted At: ${nft.mintedAt}`);
    });

    // Check marketplace query
    const marketplaceNFTs = await NFT.find({
      isListed: true,
      status: 'active'
    });
    
    console.log(`\n🏪 Marketplace NFTs (isListed=true, status=active): ${marketplaceNFTs.length}`);

    // Check IPs with NFT token IDs
    const ipsWithNFTs = await IP.find({ nftTokenId: { $ne: null } });
    console.log(`\n📝 IPs with NFT Token IDs: ${ipsWithNFTs.length}`);
    ipsWithNFTs.forEach((ip, index) => {
      console.log(`\n--- IP #${index + 1} ---`);
      console.log(`Title: ${ip.title}`);
      console.log(`NFT Token ID: ${ip.nftTokenId}`);
      console.log(`Eligible for NFT: ${ip.isEligibleForNFT}`);
      console.log(`Status: ${ip.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkNFTs();
