require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const port = 3000;

// OpenAI API 키 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// CORS 설정
const corsOptions = {
  origin: [
    "https://port-0-kcal-back-lxlts66g89582f3b.sel5.cloudtype.app",
    "https://web-kcal-front-lxlts66g89582f3b.sel5.cloudtype.app",
    "http://localhost:3000",
    "http://127.0.0.1:5500",
  ], // 허용할 도메인들
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // 허용할 HTTP 메서드
  credentials: true, // 쿠키 허용 여부
  optionsSuccessStatus: 204, // 사전 요청에 대한 성공 상태 코드
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/analyze-image', async (req, res) => {
  const imageUrl = req.body.imageUrl;

  if (!imageUrl) {
    return res.status(400).send({ error: 'Image URL is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: '음식 사진을 분석하여 각 재료의 칼로리가 얼마이고 총 칼로리가 얼마인지 알려줘야해. 문단 분리와 마크다운 문법으로 보기 좋게 결과를 전달해줘. 음식이 아닌 다른 사진이 올라오면 이 사진은 음식이 아니기 때문에 분석할 수 없습니다.라고 말해줘야해. '},
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
    });

    const analysis = response.choices[0].message.content;
    res.send({ analysis });
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).send({ error: 'Failed to analyze image' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
