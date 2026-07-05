const mongoose = require('mongoose');
const Manifesto = require('./models/Manifesto');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vaadatrack').then(async () => {
  const manifestos = await Manifesto.find({});
  console.log(`Found ${manifestos.length} manifestos`);
  for (const m of manifestos) {
    console.log(`ID: ${m._id}, Party: ${m.party}, chunks length: ${m.chunks ? m.chunks.length : 'undefined'}`);
  }
  process.exit(0);
});
