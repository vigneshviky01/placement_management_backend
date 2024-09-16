const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }
  
    try {
      const verified = jwt.verify(token, JWT_SECRET);  // Verify the token
      req.user = verified;  // Attach the decoded user data to the request
      next();  // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(400).json({ message: "Invalid Token" });
    }
  };
  
  export default verifyToken;
  