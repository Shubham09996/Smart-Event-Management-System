const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const fixIndex = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    console.log('Checking indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    const indexName = 'registeredEvents.registrationCode_1';
    
    if (indexes.some(idx => idx.name === indexName)) {
      console.log(`Dropping index: ${indexName}...`);
      await collection.dropIndex(indexName);
      console.log('Index dropped successfully.');
    } else {
      console.log(`Index ${indexName} not found. Searching by key...`);
      // Sometimes index names vary, let's try to find it by key
      const duplicateIndex = indexes.find(idx => idx.key && idx.key['registeredEvents.registrationCode']);
      if (duplicateIndex) {
         console.log(`Found index by key: ${duplicateIndex.name}. Dropping...`);
         await collection.dropIndex(duplicateIndex.name);
         console.log('Index dropped successfully.');
      } else {
         console.log('No such index found.');
      }
    }

    console.log('Process complete. Mongoose will recreate the index with "sparse: true" when the server restarts.');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing index:', error);
    process.exit(1);
  }
};

fixIndex();
