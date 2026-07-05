const mongoose = require('mongoose');
const schema = new mongoose.Schema({ text: String });
const Model = mongoose.model('TestSpread', schema);
const doc = new Model({ text: 'hello world' });
const copy = { ...doc };
console.log('Original text:', doc.text);
console.log('Copy text:', copy.text);
console.log('Copy keys:', Object.keys(copy));
