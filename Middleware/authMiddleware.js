// // authMiddleware.js
// import jwt from 'jsonwebtoken';

// export const authenticateJWT = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user; // Attach user information to the request
//     next();
//   });
// };

// export const authorizeRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     const { role } = req.user; // Extract role from JWT payload

//     if (allowedRoles.includes(role)) {
//       next();
//     } else {
//       res.sendStatus(403); // Forbidden
//     }
//   };
// };

import jwt from 'jsonwebtoken';
import Personal from '../models/Personal.js'; // Your user model

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Attach user information to the request
    next();
  });
};

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Fetch the latest user data from the database
      const user = await Personal.findOne({ Email: req.user.email });

      if (user && allowedRoles.includes(user.Role)) {
        next();
      } else {
        res.sendStatus(403); // Forbidden
      }
    } catch (err) {
      res.status(500).json({ message: 'Error checking user role', err });
    }
  };
};

