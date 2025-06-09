const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


app.get('/api/variations', async (req, res) => {
  const { serviceID } = req.query;

  try {
    const response = await axios.get(`https://sandbox.vtpass.com/api/service-variations?serviceID=${serviceID}`, {
      headers: {
        'api-key': process.env.VTPASS_API_KEY,
        'secret-key': process.env.VTPASS_SECRET_KEY,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Variation fetch error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch variations" });
  }
});


app.post('/api/vtpass', async (req, res) => {
  const { 
    request_id,
    serviceID, 
    billersCode,
    variation_code,
    amount,
    phone,
   } = req.body;

  try {
    const response = await axios.post('https://sandbox.vtpass.com/api/pay', {
      request_id,
      serviceID,
      billersCode,
      variation_code,
      amount,
      phone
    }, {
      headers: {
        'api-key': process.env.VTPASS_API_KEY,
        'secret-key': process.env.VTPASS_SECRET_KEY,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Transaction failed" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
