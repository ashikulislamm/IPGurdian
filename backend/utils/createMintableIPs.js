import IP from '../models/IPModel.js';
import User from '../models/UserModel.js';

/**
 * Create mintable IP registrations for testing
 */
export const createMintableIPs = async (userId) => {
  try {
    console.log('🎨 Creating mintable IP registrations...');

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const mintableIPs = [
      {
        title: 'Blockchain Integration Library',
        description: 'Open-source library for seamless blockchain integration in web applications',
        ipType: 'copyright',
        category: 'Software',
        tags: 'Blockchain, Library, Open Source',
        userId: user._id,
        creator: user.walletAddress || user.email,
        status: 'confirmed',
        isEligibleForNFT: true,
        isPublic: true,
        transactionHash: `0x${Date.now().toString(16)}`,
        blockNumber: Math.floor(Math.random() * 100000)
      },
      {
        title: 'AI Image Generator Algorithm',
        description: 'Novel algorithm for generating high-quality images using AI',
        ipType: 'patent',
        category: 'Technology',
        tags: 'AI, Image Generation, Algorithm',
        userId: user._id,
        creator: user.walletAddress || user.email,
        status: 'confirmed',
        isEligibleForNFT: true,
        isPublic: true,
        transactionHash: `0x${Date.now().toString(16)}`,
        blockNumber: Math.floor(Math.random() * 100000)
      }
    ];

    const createdIPs = [];
    for (const ipData of mintableIPs) {
      const ip = await IP.create(ipData);
      createdIPs.push(ip);
    }

    console.log(`✅ Created ${createdIPs.length} mintable IPs for user ${user.name}`);
    return { success: true, ips: createdIPs };

  } catch (error) {
    console.error('❌ Error creating mintable IPs:', error);
    throw error;
  }
};

export default { createMintableIPs };
