import { WebcastPushConnection } from 'tiktok-live-connector';
import express from 'express';

const app = express();
app.use(express.json());

let latestGift = {};
let allGifts = [];

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

    latestGift = {
        gift: data.giftName,
        sender: data.uniqueId,
        timestamp: Date.now()
    };
    allGifts.push(latestGift);
});

// ===== API Routes =====

// 1. ทดสอบเซิร์ฟเวอร์
app.get("/", (req, res) => {
    res.json({ status: "OK", message: "TikTok → Roblox API ทำงานปกติ" });
});

// 2. เอาของขวัญล่าสุด
app.get("/latestgift", (req, res) => {
    res.json(latestGift);
});

// 3. เอาของขวัญทั้งหมด
app.get("/allgifts", (req, res) => {
    res.json(allGifts);
});

// 4. ล้างข้อมูล
app.post("/clear", (req, res) => {
    latestGift = {};
    allGifts = [];
    res.json({ status: "cleared" });
});

// เริ่มเซิร์ฟเวอร์
app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Server started");
});
