const User = require("../models/users");
const jwt = require("jsonwebtoken");
const redis_client = require("../redis_connection");

const register = async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  try {
    const saved_user = await user.save();
    return res.json({
      success: true,
      message: "User Registered successfully",
      data: saved_user,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Something went wrong",
      data: error.message,
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      username: username,
      password: password,
    }).exec();

    if (user === null) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const access_token = jwt.sign(
      { sub: user._id },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_TIME,
      }
    );
    const refresh_token = GenerateRefreshToken(user._id);

    return res.json({
      success: true,
      message: "Login successful",
      tokens: { access_token, refresh_token },
    });
  } catch (error) {
    console.log("Login error", error)
    return res.status(400).json({ error: error.message });
  }
};

const token = async (req, res) => {
  const user_id = req.userData.sub;
  const access_token = jwt.sign(
    { sub: user_id },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TIME,
    }
  );

  const refresh_token = GenerateRefreshToken(user_id);

  return res.json({
    success: true,
    message: "Successful",
    tokens: { access_token, refresh_token },
  });
};

const logout = async (req, res) => {
  const user_id = req.userData.sub;

  await redis_client.del(user_id.toString());

  //blacklist current access token
  await redis_client.set("BL_" + user_id.toString(), token);
  return res.json({
    success: true,
    message: "Success",
  });
};

function GenerateRefreshToken(user_id) {
  const refresh_token = jwt.sign(
    { sub: user_id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_TIME,
    }
  );

  redis_client.get(user_id.toString(), (err, data) => {
    if (err) throw err;

    redis_client.set(
      user_id.toString(),
      JSON.stringify({ token: refresh_token })
    );
  });

  return refresh_token;
}

module.exports = { register, login, token, logout };
