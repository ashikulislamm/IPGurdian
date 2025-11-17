import NFT from '../models/NFTModel.js';
import User from '../models/UserModel.js';
import IP from '../models/IPModel.js';

export const seedNFTs = async () => {
  try {
    console.log('🌱 Seeding sample NFTs...');

    // Find or create sample user
    let sampleUser = await User.findOne({ email: 'nft@sample.com' });
    if (!sampleUser) {
      sampleUser = await User.create({
        name: 'NFT Sample User',
        email: 'nft@sample.com',
        password: 'sample123',
        walletAddress: '0x1234567890123456789012345678901234567890'
      });
    }

    // Clear existing sample NFTs
    await NFT.deleteMany({ tokenId: { $in: [101, 102, 103] } });

    const sampleNFTs = [
      {
        tokenId: 101,
        title: 'Innovative Algorithm NFT',
        description: 'A revolutionary sorting algorithm that improves efficiency',
        creator: sampleUser._id,
        owner: sampleUser._id,
        tokenURI: 'ipfs://QmSample1',
        metadataHash: 'QmSample1',
        metadata: {
          name: 'Innovative Algorithm NFT',
          description: 'A revolutionary sorting algorithm',
          attributes: [
            { trait_type: 'IP Type', value: 'patent' },
            { trait_type: 'Category', value: 'Software' }
          ]
        },
        category: 'Software',
        ipType: 'patent',
        isListed: true,
        currentPrice: '0.5',
        priceETH: 0.5,
        marketValue: 1.0,
        status: 'active'
      },
      {
        tokenId: 102,
        title: 'Digital Art Collection',
        description: 'Unique digital artwork with blockchain verification',
        creator: sampleUser._id,
        owner: sampleUser._id,
        tokenURI: 'ipfs://QmSample2',
        metadataHash: 'QmSample2',
        metadata: {
          name: 'Digital Art Collection',
          description: 'Unique digital artwork',
          attributes: [
            { trait_type: 'IP Type', value: 'copyright' },
            { trait_type: 'Category', value: 'Art' }
          ]
        },
        category: 'Art',
        ipType: 'copyright',
        isListed: true,
        currentPrice: '0.3',
        priceETH: 0.3,
        marketValue: 0.6,
        status: 'active',
        views: 150,
        favorites: 25
      },
      {
        tokenId: 103,
        title: 'Music Composition Rights',
        description: 'Original music composition with full rights',
        creator: sampleUser._id,
        owner: sampleUser._id,
        tokenURI: 'ipfs://QmSample3',
        metadataHash: 'QmSample3',
        metadata: {
          name: 'Music Composition Rights',
          description: 'Original music composition',
          attributes: [
            { trait_type: 'IP Type', value: 'copyright' },
            { trait_type: 'Category', value: 'Music' }
          ]
        },
        category: 'Music',
        ipType: 'copyright',
        isListed: true,
        currentPrice: '0.8',
        priceETH: 0.8,
        marketValue: 1.6,
        status: 'active',
        views: 200,
        favorites: 45,
        isFeatured: true
      }
    ];

    for (const nftData of sampleNFTs) {
      await NFT.create(nftData);
    }

    console.log('✅ Sample NFTs created successfully');
    return { success: true, count: sampleNFTs.length };

  } catch (error) {
    console.error('❌ Error seeding NFTs:', error);
    throw error;
  }
};

export default { seedNFTs };
