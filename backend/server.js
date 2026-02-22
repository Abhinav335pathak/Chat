const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const passport = require('passport');
const session = require('express-session');


const initWebSocket = require("./socket.js");
const { initStatusCleanup } = require("./utils/statusCleanup");

const connectDB = require("./config/db");




const googleauth =require('./routes/auth');


// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const statusRoutes = require("./routes/statusRoutes");
const callRoutes = require("./routes/callRoutes");
const cloudinary = require("./config/cloudinary");
const uploadRoutes = require("./routes/uploadRoutes");



const { errorHandler } = require("./models/middleware/errorHandler.js");
const { protect } = require("./models/middleware/authMiddleware.js");


dotenv.config();

const app = express();
const server = http.createServer(app);
initWebSocket(server);

app.use(cors({
  origin: process.env.VITE_FRONTEND_API_URL ,
  credentials: true,
}));



app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


connectDB();
cloudinary; 
initStatusCleanup(); 



app.use("/api/auth", authRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/api/messages", protect, messageRoutes);
app.use("/api/conversations", protect, conversationRoutes);
app.use("/api/media", protect, mediaRoutes);
app.use("/api/statuses", protect, statusRoutes);
app.use("/api/calls", protect, callRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api",googleauth);



app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Bad JSON:", err.message);
    return res.status(400).json({ message: "Invalid JSON body" });
  }
  next(err);
});


app.use(errorHandler);


app.get("/health", (_, res) => res.status(200).json({ status: "OK" }));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
