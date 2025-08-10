import { WebcastPushConnection } from 'tiktok-live-connector';
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

// Roblox Webhook URL (ฝั่ง Roblox จะต้องทำ Endpoint รอรับข้อมูลตรงนี้)
const ROBLOX_WEBHOOK = "https://YOUR_ROBLOX_API_URL";

// TikTok username
const TIKTOK_USERNAME = "haleeplaygame";

// เชื่อมต่อ TikTok Live
let tiktokLiveConnection = new WebcastPushConnection(TIKTOK_USERNAME);

tiktokLiveConnection.connect().then(state => {
    console.log(`✅ Connected to roomId ${state.roomId}`);
}).catch(err => {
    console.error('❌ Failed to connect', err);
});

// เมื่อมีคนส่งของขวัญ
tiktokLiveConnection.on('gift', data => {
    console.log(`${data.uniqueId} ส่งของขวัญ: ${data.giftName}`);
    
    // ส่งข้อมูลไป Roblox
    fetch(ROBLOX_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            gift: data.giftName,
            sender: data.uniqueId
        })
    }).then(() => console.log("✅ ส่งข้อมูลไป Roblox แล้ว"))
      .catch(err => console.error("❌ ส่งข้อมูลไป Roblox ล้มเหลว", err));
});

// Route ทดสอบ
app.get("/", (req, res) => {
    res.send("TikTok → Roblox Server ทำงานอยู่แล้ว!");
});

// รันเซิร์ฟเวอร์
app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Server started");
});
