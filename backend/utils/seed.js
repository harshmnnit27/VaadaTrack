const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const Party = require('../models/Party');
const PromiseModel = require('../models/Promise');
const Manifesto = require('../models/Manifesto');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vaadatrack';

const parties = [
  { name: 'Bharatiya Janata Party', abbreviation: 'BJP', founded: 1980, ideology: 'Hindu nationalism, Conservatism', color: '#FF6B00', state: 'National', description: 'Centre-right political party, currently ruling at national level.' },
  { name: 'Indian National Congress', abbreviation: 'INC', founded: 1885, ideology: 'Liberalism, Social democracy', color: '#00A651', state: 'National', description: 'One of the two major political parties of India, historically dominant.' },
  { name: 'Aam Aadmi Party', abbreviation: 'AAP', founded: 2012, ideology: 'Anti-corruption, Social liberalism', color: '#00AEEF', state: 'National', description: 'Centre political party founded by social activist Arvind Kejriwal.' },
  { name: 'Samajwadi Party', abbreviation: 'SP', founded: 1992, ideology: 'Socialism, Secularism', color: '#E31E24', state: 'Uttar Pradesh', description: 'Regional party based primarily in Uttar Pradesh.' },
  { name: 'Bahujan Samaj Party', abbreviation: 'BSP', founded: 1984, ideology: 'Ambedkarism, Social justice', color: '#0070C0', state: 'Uttar Pradesh', description: 'Party focused on rights of Dalits and other marginalized communities.' },
];

const samplePromises = [
  { partyIndex: 0, election: 'Lok Sabha 2019', year: 2019, title: 'Double farmers income by 2022', description: 'The party promised to double the income of farmers by 2022 through various agricultural reforms and MSP increases.', category: 'Agriculture', status: 'Partially Fulfilled' },
  { partyIndex: 0, election: 'Lok Sabha 2019', year: 2019, title: 'Build 2 crore houses under PMAY', description: 'Complete 2 crore houses under Pradhan Mantri Awas Yojana for rural poor by 2022.', category: 'Infrastructure', status: 'In Progress' },
  { partyIndex: 0, election: 'Lok Sabha 2019', year: 2019, title: 'Ayushman Bharat for 50 crore citizens', description: 'Provide health insurance coverage of Rs 5 lakh per family per year to 10 crore poor families.', category: 'Health', status: 'Fulfilled' },
  { partyIndex: 0, election: 'Lok Sabha 2014', year: 2014, title: 'Create 1 crore jobs per year', description: 'Generate 1 crore employment opportunities every year through industrial growth and MSME support.', category: 'Employment', status: 'Broken' },
  { partyIndex: 0, election: 'Lok Sabha 2014', year: 2014, title: 'Bring back black money within 100 days', description: 'Bring back all black money stashed in foreign accounts within 100 days of coming to power.', category: 'Economy', status: 'Broken' },
  { partyIndex: 1, election: 'Lok Sabha 2019', year: 2019, title: 'NYAY scheme - Rs 72,000 per year to poor', description: 'Nyuntam Aay Yojana: guaranteed minimum income of Rs 6,000 per month to the poorest 20% households.', category: 'Social Welfare', status: 'Pending' },
  { partyIndex: 1, election: 'Lok Sabha 2019', year: 2019, title: 'Separate budget for farmers', description: 'Introduce a separate budget for agriculture to address rural distress and farmer suicide crisis.', category: 'Agriculture', status: 'Pending' },
  { partyIndex: 2, election: 'Delhi Assembly 2020', year: 2020, title: '200 units free electricity', description: 'Provide 200 units of free electricity per month to all Delhi households.', category: 'Governance', status: 'Fulfilled' },
  { partyIndex: 2, election: 'Delhi Assembly 2020', year: 2020, title: 'Free water supply 20kl per month', description: 'Provide 20,000 litres of free water per month to every household in Delhi.', category: 'Governance', status: 'Fulfilled' },
  { partyIndex: 2, election: 'Delhi Assembly 2020', year: 2020, title: 'World class mohalla clinics', description: 'Establish 1000 Mohalla Clinics providing free primary healthcare near people\'s homes.', category: 'Health', status: 'Partially Fulfilled' },
  { partyIndex: 3, election: 'UP Assembly 2022', year: 2022, title: 'Rs 25 lakh to families of riot victims', description: 'Provide Rs 25 lakh compensation to families of those killed in state-sponsored riots.', category: 'Social Welfare', status: 'Pending' },
  { partyIndex: 3, election: 'UP Assembly 2022', year: 2022, title: 'Unemployment allowance Rs 1500/month', description: 'Give Rs 1500 monthly unemployment allowance to educated unemployed youth in UP.', category: 'Employment', status: 'Pending' },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Party.deleteMany({});
  await PromiseModel.deleteMany({});
  await User.deleteMany({});

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@vaadatrack.com',
    password: 'admin123',
    role: 'admin'
  });
  console.log('Admin created: admin@vaadatrack.com / admin123');

  // Create parties
  const createdParties = await Party.insertMany(parties);
  console.log(`Created ${createdParties.length} parties`);

  // Create promises
  const promisesWithPartyIds = samplePromises.map(p => ({
    ...p,
    party: createdParties[p.partyIndex]._id,
    partyIndex: undefined
  }));

  await PromiseModel.insertMany(promisesWithPartyIds);
  console.log(`Created ${promisesWithPartyIds.length} promises`);

  // Update party stats
  for (const party of createdParties) {
    const promises = await PromiseModel.find({ party: party._id });
    await Party.findByIdAndUpdate(party._id, {
      totalPromises: promises.length,
      fulfilledPromises: promises.filter(p => p.status === 'Fulfilled').length,
      partialPromises: promises.filter(p => p.status === 'Partially Fulfilled').length,
      pendingPromises: promises.filter(p => p.status === 'Pending').length,
    });
  }

  console.log('Party stats updated');
  console.log('\n✅ Seed complete!');
  mongoose.disconnect();
}

seed().catch(e => { console.error(e); mongoose.disconnect(); });
