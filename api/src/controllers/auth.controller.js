import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Hashing the password
    const hashedpwd = await bcrypt.hash(password, 10);

    //Creating a new user and save to database
    const newUser = await User.create({
      username,
      email,
      password: hashedpwd,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occured while registering user" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    //Check if user exist or not

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    //Send cookies to the user
    const age = 1000 * 60 * 60 * 24 * 7;
    const [pwd, ...userInfo] = user;
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: age,
      })
      .status(200)
      .json(  );

    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occured while logging in user",
    });
  }
};

const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "User logged out successfully" });
};

export { register, login, logout };
