import IP from '../models/IPModel.js';
import User from '../models/UserModel.js';

export const seedIPs = async () => {
  try {
    console.log('🌱 Seeding sample IP registrations...');

    // Find or create sample user
    let sampleUser = await User.findOne({ email: 'sample@ipguardian.com' });
    if (!sampleUser) {
      sampleUser = await User.create({
        name: 'Sample IP User',
        email: 'sample@ipguardian.com',
        password: 'sample123',
        walletAddress: '0x0987654321098765432109876543210987654321'
      });
    }

    const sampleIPs = [
      {
        title: 'Machine Learning Model for Prediction',
        description: 'Advanced ML model for predictive analytics in healthcare',
        ipType: 'patent',
        category: 'Technology',
        tags: 'AI, Machine Learning, Healthcare',
        userId: sampleUser._id,
        creator: sampleUser.walletAddress,
        status: 'confirmed',
        isEligibleForNFT: true,
        isPublic: true,
        transactionHash: '0xsample1',
        blockNumber: 12345
      },
      {
        title: 'Brand Logo Design',
        description: 'Unique brand identity and logo design for tech startup',
        ipType: 'trademark',
        category: 'Design',
        tags: 'Branding, Logo, Design',
        userId: sampleUser._id,
        creator: sampleUser.walletAddress,
        status: 'confirmed',
        isEligibleForNFT: true,
        isPublic: true,
        transactionHash: '0xsample2',
        blockNumber: 12346
      },
      {
        title: 'Novel Writing Manuscript',
        description: 'Original fiction novel manuscript with unique storyline',
        ipType: 'copyright',
        category: 'Literature',
        tags: 'Novel, Fiction, Writing',
        userId: sampleUser._id,
        creator: sampleUser.walletAddress,
        status: 'confirmed',
        isEligibleForNFT: true,
        isPublic: true,
        transactionHash: '0xsample3',
        blockNumber: 12347
      }
    ];

    for (const ipData of sampleIPs) {
      await IP.create(ipData);
    }

    console.log('✅ Sample IPs created successfully');
    return { success: true, count: sampleIPs.length };

  } catch (error) {
    console.error('❌ Error seeding IPs:', error);
    throw error;
  }
};

export default { seedIPs };
