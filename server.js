const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const feedbackFile = path.join(__dirname, 'feedback.json');

// Endpoint za primanje feedbacka
app.post('/api/feedback', (req, res) => {
  const feedback = req.body;

  if (!feedback || !feedback.problem || !feedback.message) {
    return res.status(400).json({ error: 'Neispravan zahtjev, nedostaju podaci.' });
  }

  let feedbacks = [];
  if (fs.existsSync(feedbackFile)) {
    try {
      const data = fs.readFileSync(feedbackFile, 'utf-8');
      if (data) {
        feedbacks = JSON.parse(data);
      }
    } catch (err) {
      console.error('Greška pri čitanju feedback datoteke:', err);
      // nastavi sa praznim nizom
    }
  }

  feedback.timestamp = new Date().toISOString();
  feedbacks.push(feedback);

  try {
    fs.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2));
  } catch (err) {
    console.error('Greška pri pisanju u feedback datoteku:', err);
    return res.status(500).json({ error: 'Greška pri spremanju podataka.' });
  }

  res.json({ message: 'Feedback je zaprimljen, hvala!' });
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
