import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NFT from './models/NFTModel.js';
import IP from './models/IPModel.js';
import User from './models/UserModel.js';
import { ethers } from 'ethers';

dotenv.config();

async function fixNFTs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Get all NFTs
    const nfts = await NFT.find();
    console.log(`\n📊 Found ${nfts.length} NFTs to fix`);

    for (const nft of nfts) {
      console.log(`\n🔧 Fixing NFT Token ID: ${nft.tokenId}`);
      
      // Get the IP registration
      const ip = await IP.findById(nft.ipRegistration);
      
      if (!ip) {
        console.log(`  ⚠️  No IP registration found for NFT ${nft.tokenId}`);
        continue;
      }

      // Update NFT with missing fields
      nft.title = nft.title || ip.title;
      nft.description = nft.description || ip.description;
      nft.ipType = nft.ipType || ip.ipType;
      nft.category = nft.category || ip.category;
      
      // Generate metadataHash if missing
      if (!nft.metadataHash) {
        const metadataString = JSON.stringify({
          title: nft.title || ip.title,
          description: nft.description || ip.description,
          ipType: ip.ipType,
          category: ip.category
        });
        nft.metadataHash = ethers.keccak256(ethers.toUtf8Bytes(metadataString)).replace('0x', '');
      }
      
      // Ensure metadata is populated
      if (!nft.metadata || Object.keys(nft.metadata).length === 0) {
        nft.metadata = {
          name: ip.title,
          description: ip.description,
          attributes: [
            { trait_type: 'IP Type', value: ip.ipType },
            { trait_type: 'Category', value: ip.category },
            { trait_type: 'Registration Date', value: ip.registrationDate.toISOString().split('T')[0] }
          ],
          properties: {
            ipId: ip._id.toString(),
            category: ip.category,
            ipType: ip.ipType,
            tags: ip.tags || []
          }
        };
      }

      await nft.save();
      
      console.log(`  ✅ Updated NFT ${nft.tokenId}:`);
      console.log(`     Title: ${nft.title}`);
      console.log(`     Description: ${nft.description}`);
      console.log(`     IP Type: ${nft.ipType}`);
      console.log(`     Category: ${nft.category}`);
      console.log(`     Is Listed: ${nft.isListed}`);
      console.log(`     Status: ${nft.status}`);
    }

    // Verify the fix
    console.log('\n\n🔍 Verifying marketplace query...');
    const marketplaceNFTs = await NFT.find({
      isListed: true,
      status: 'active'
    });
    
    console.log(`\n✅ Marketplace query now returns ${marketplaceNFTs.length} NFTs`);
    
    marketplaceNFTs.forEach((nft, index) => {
      console.log(`\n--- NFT #${index + 1} ---`);
      console.log(`Token ID: ${nft.tokenId}`);
      console.log(`Title: ${nft.title}`);
      console.log(`IP Type: ${nft.ipType}`);
      console.log(`Category: ${nft.category}`);
      console.log(`Price: ${nft.priceETH} ETH`);
    });

    console.log('\n✅ All NFTs fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixNFTs();
