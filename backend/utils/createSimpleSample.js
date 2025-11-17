import NFT from '../models/NFTModel.js';
import IP from '../models/IPModel.js';
import User from '../models/UserModel.js';

/**
 * Create simple sample data for quick testing
 */
export const createSimpleSample = async () => {
  try {
    console.log('🚀 Creating simple sample data...');

    // Create or find sample user
    let user = await User.findOne({ email: 'demo@ipguardian.com' });
    if (!user) {
      user = await User.create({
        name: 'Demo User',
        email: 'demo@ipguardian.com',
        password: 'demo123456',
        walletAddress: '0xDEMO1234567890123456789012345678901234'
      });
      console.log('✅ Created demo user');
    }

    // Create sample IP
    const sampleIP = await IP.create({
      title: 'Demo Software Project',
      description: 'A demonstration software project for testing the platform',
      ipType: 'copyright',
      category: 'Software',
      tags: 'Demo, Testing, Software',
      userId: user._id,
      creator: user.walletAddress,
      status: 'confirmed',
      isEligibleForNFT: true,
      isPublic: true,
      transactionHash: '0xDEMOTRANSACTION',
      blockNumber: 99999
    });
    console.log('✅ Created demo IP registration');

    // Create sample NFT
    const lastNFT = await NFT.findOne().sort({ tokenId: -1 });
    const nextTokenId = lastNFT ? lastNFT.tokenId + 1 : 1;

    const sampleNFT = await NFT.create({
      tokenId: nextTokenId,
      title: sampleIP.title,
      description: sampleIP.description,
      creator: user._id,
      owner: user._id,
      tokenURI: 'ipfs://QmDemoHash',
      metadataHash: 'QmDemoHash',
      metadata: {
        name: sampleIP.title,
        description: sampleIP.description,
        attributes: [
          { trait_type: 'IP Type', value: sampleIP.ipType },
          { trait_type: 'Category', value: sampleIP.category }
        ]
      },
      ipRegistration: sampleIP._id,
      category: sampleIP.category,
      ipType: sampleIP.ipType,
      isListed: true,
      currentPrice: '0.1',
      priceETH: 0.1,
      marketValue: 0.2,
      status: 'active'
    });
    console.log('✅ Created demo NFT');

    // Link IP to NFT
    sampleIP.nftTokenId = sampleNFT._id;
    sampleIP.isEligibleForNFT = false;
    await sampleIP.save();

    console.log('✅ Simple sample data created successfully');
    return {
      success: true,
      user,
      ip: sampleIP,
      nft: sampleNFT
    };

  } catch (error) {
    console.error('❌ Error creating simple sample:', error);
    throw error;
  }
};

export default { createSimpleSample };
