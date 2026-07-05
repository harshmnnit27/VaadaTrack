const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Manifesto = require('./models/Manifesto');
const ragService = require('./services/ragService');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vaadatrack').then(async () => {
  // Find a manifesto with chunks
  const manifesto = await Manifesto.findOne({ "chunks.0": { $exists: true } }).populate('party', 'name');
  if (!manifesto) {
      console.log("No manifesto with chunks found");
      process.exit(0);
  }
  
  console.log(`Testing with Manifesto: ${manifesto.election} (ID: ${manifesto._id}), Chunks: ${manifesto.chunks.length}`);
  
  const query = "What are the economic promises?";
  
  try {
      const relevantChunks = ragService.retrieveRelevantChunks(
        query,
        manifesto.chunks,
        5
      );
      
      console.log(`Relevant chunks retrieved: ${relevantChunks.length}`);
      if (relevantChunks.length > 0) {
          console.log(`First chunk score: ${relevantChunks[0].score}`);
          console.log(`First chunk text: ${relevantChunks[0].text.substring(0, 50)}...`);
      }
      
      const context = relevantChunks
        .map((c) => c.text)
        .join("\n\n")
        .slice(0, 15000);
        
      console.log(`Context length: ${context.length}`);
      if (context.length === 0) {
          console.log("CONTEXT IS EMPTY!");
      }
  } catch (err) {
      console.log("Error during retrieval:", err);
  }
  
  process.exit(0);
});
