import User from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";


export const postSignup = ErrorWrapper(async function (req, res, next) {
    const { username, password, email, name } = req.body;
    const incomingFields = Object.keys(req.body);
    const requiredFields = ["username", "password", "email", "name"];
    const missingFields = requiredFields.filter((field) => !incomingFields.includes(field));
    if (missingFields.length > 0) {
        throw new ErrorHandler(401, `Provide missing fields ${missingFields.join(',')} to signup`);
    }

    let existingUser = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    if (existingUser) {
        throw new ErrorHandler(401, `User with username ${username} or email ${email} already exists`);
    }

    let cloudinaryResponse;
    try {
        cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    } catch (error) {
        throw new ErrorHandler(500, `Error while uploading image ${error.message}`);
    }

    try {
        const user = await User.create({
            username,
            password,
            email,
            name,
            image: cloudinaryResponse.secure_url
        });

        let newUser = await User.findOne({
            _id: user._id
        }).select("-password");

        res.status(201).json({
            success: true,
            user: newUser
        });

    } catch (error) {
        throw new ErrorHandler(500, `Error while creating new user`);
    }
})


const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        let user = await User.findOne({
            _id: userId
        });
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw new ErrorHandler(500, `Error while generating access token and refresh token`);
    }
}


export const postLogin = ErrorWrapper(async function (req, res, next) {
    const { username, email, password } = req.body;
    if (!username && !email) {
        throw new ErrorHandler(400, "Please enter either username or email");
    }
    if (!password) {
        throw new ErrorHandler(400, "Please enter password");
    }
    let user = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (!user) {
        throw new ErrorHandler(400, "Invalid username or email");
    }

    const passwordMatch = user.isPasswordCorrect(password);
    if (!passwordMatch) {
        throw new ErrorHandler(400, "Invalid password");
    }
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    user = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    }).select("-password -refreshToken")

    res.status(200)
        .cookie("RefreshToken", refreshToken)
        .cookie("AccessToken", accessToken)
        .json({
            success: true,
            message: "Login Successfull",
            user
        });
})


export const postLogout = ErrorWrapper(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id });
    if (user) {
        user.refreshToken = null; 
        await user.save(); 
    }
    res.cookie('AccessToken', null, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict', 
        expires: new Date(0)
    });

    res.cookie('RefreshToken', null, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        expires: new Date(0) 
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});


export const getOrderHistory = ErrorWrapper(async (req, res, next) => {

    const user = await User.findOne({ _id: req.user._id }).select('orderHistory').populate('orderHistory.items'); // Find user and select only orderHistory, populate items if needed based on how items are stored

    if (!user) {
        return next(new ErrorHandler(404, "User not found"));
    }

    res.status(200).json({
        success: true,
        orderHistory: user.orderHistory
    });
});
