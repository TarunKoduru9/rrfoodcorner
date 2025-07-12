const db = require("../../config/db");
const bcrypt = require("bcrypt");
const { sendOtpEmail } = require("../../utils/mailer");
const { generateToken } = require("../../utils/jwt");
const { OAuth2Client } = require("google-auth-library");

// User Signup
const signup = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [existing] = await db.execute(
      "SELECT * FROM users WHERE email = ? OR mobile = ?",
      [email, mobile]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "Email or mobile already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (name, email, mobile, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, mobile, hashedPassword, "user"]
    );

    res
      .status(201)
      .json({ message: "User registered", userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User Login
const login = async (req, res) => {
  const { emailOrMobile, password } = req.body;
  if (!emailOrMobile || !password) {
    return res
      .status(400)
      .json({ message: "Email/mobile and password required" });
  }

  try {
    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ? OR mobile = ?",
      [emailOrMobile, emailOrMobile]
    );

    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = users[0];

    if (user.role !== "user") {
      return res.status(403).json({ message: "Access denied. Not an user." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = generateToken(user);
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Send OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const sendOtp = async (req, res) => {
  const { emailOrMobile } = req.body;

  try {
    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ? OR mobile = ?",
      [emailOrMobile, emailOrMobile]
    );

    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = users[0];

    if (user.role !== "user") {
      return res.status(403).json({ message: "Access denied. Not an user." });
    }
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await db.execute(
      "INSERT INTO otp_verifications (user_id, otp_code, expires_at) VALUES (?, ?, ?)",
      [user.id, otp, expiresAt]
    );

    if (emailOrMobile.includes("@")) {
      await sendOtpEmail(emailOrMobile, otp);
    } else {
      console.log(`Mock SMS to ${emailOrMobile}: ${otp}`);
    }

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { emailOrMobile, otp } = req.body;

  try {
    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ? OR mobile = ?",
      [emailOrMobile, emailOrMobile]
    );
    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = users[0];
    const [otps] = await db.execute(
      "SELECT * FROM otp_verifications WHERE user_id = ? ORDER BY expires_at DESC LIMIT 1",
      [user.id]
    );

    if (otps.length === 0)
      return res.status(404).json({ message: "No OTP found" });

    const latestOtp = otps[0];

    if (latestOtp.verified)
      return res.status(400).json({ message: "OTP already used" });

    if (new Date() > new Date(latestOtp.expires_at)) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (latestOtp.otp_code !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    await db.execute(
      "UPDATE otp_verifications SET verified = true WHERE id = ?",
      [latestOtp.id]
    );

    const token = generateToken(user);
    res.json({
      message: "OTP verified",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { emailOrMobile, password } = req.body;
  if (!emailOrMobile || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "UPDATE users SET password_hash = ? WHERE email = ? OR mobile = ?",
      [hashedPassword, emailOrMobile, emailOrMobile]
    );
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password" });
  }
};

// Google
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({ error: "Google account missing email" });
    }

    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    let user;
    if (existingUsers.length > 0) {
      user = existingUsers[0];
    } else {
      const [result] = await pool.query(
        "INSERT INTO users (name, email, role) VALUES (?, ?)",
        [name, email, "user"]
      );

      const [newUserRows] = await pool.query(
        "SELECT * FROM users WHERE id = ?",
        [result.insertId]
      );
      user = newUserRows[0];
    }

    const token = generateToken(user);

    res.status(200).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Google login failed" });
  }
};

// Get Current User Info
const getMe = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, mobile FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

// Update User Info
const updateUser = async (req, res) => {
  const userId = req.user.id;
  const { name, email, mobile, password } = req.body;

  try {
    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }

    if (email) {
      fields.push("email = ?");
      values.push(email);
    }

    if (mobile) {
      fields.push("mobile = ?");
      values.push(mobile);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push("password_hash = ?");
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(userId);

    await db.execute(sql, values);

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};


module.exports = {
  signup,
  login,
  sendOtp,
  verifyOtp,
  resetPassword,
  getMe,
  updateUser,
  googleLogin,
};
