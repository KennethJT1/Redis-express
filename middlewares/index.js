// const jwt = require("jsonwebtoken");
// const redis_client = require("../redis_connection")

// function verifyToken(req, res, next) {
//   try {
//     const token = req.headers.authorization.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

//     req.userData = decoded;
//     next();
//   } catch (error) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Unauthorized", data: error });
//   }
// }

// function verifyRefreshToken(req, res, next) {
//   const { token } = req.body;

//   if (token === null) {
//     return res.status(401).json({ success: false, message: "Invalid Request" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

//     req.userData = decoded;

//     //verify is token is in the store
//     redis_client.get(decoded.sub.toString(), (err, data) => {
//       if (err) throw err;

//       if (data === null) {
//         return res.status(401).json({
//           status: false,
//           message: "Invalid,Token is not in store",
//         });
//       }

//       if (JSON.parse(data).token != token) {
//         return res.status(401).json({
//           success: false,
//           message: "Token is not the same in store. Invalid request",
//         });
//       }
//       next();
//     });
//   } catch (error) {
//     return res
//       .status(401)
//       .json({
//         success: false,
//         message: "Your session is not valid",
//         data: error,
//       });
//   }
// }

// module.export = {
//   verifyRefreshToken,
//   verifyToken,
// };


const jwt = require("jsonwebtoken");
const redis_client = require("../redis_connection");

function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.userData = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized", data: error });
  }
}

function verifyRefreshToken(req, res, next) {
  const { token } = req.body;

  if (token === null) {
    return res.status(401).json({ success: false, message: "Invalid Request" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    req.userData = decoded;

    // Verify if the token is in the store
    redis_client.get(decoded.sub.toString(), (err, data) => {
      if (err) throw err;

      if (data === null) {
        return res.status(401).json({
          status: false,
          message: "Invalid, Token is not in store",
        });
      }

      if (JSON.parse(data).token != token) {
        return res.status(401).json({
          success: false,
          message: "Token is not the same in store. Invalid request",
        });
      }
      next();
    });
  } catch (error) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Your session is not valid",
        data: error,
      });
  }
}

module.exports = {
  verifyRefreshToken,
  verifyToken,
};

