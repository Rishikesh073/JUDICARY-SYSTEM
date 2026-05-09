const axios = require('axios');
async function run() {
  try {
    const res = await axios.post('http://localhost:5001/api/ask-lexagent', { query: "murder case committed by women" }, { responseType: 'stream' });
    res.data.on('data', chunk => {
      console.log('CHUNK:', chunk.toString());
    });
    res.data.on('end', () => console.log('DONE'));
  } catch(e) {
    console.error("ERROR", e.message);
  }
}
run();
