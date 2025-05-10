import Razorpay from 'razorpay';
import crypto from 'crypto';
import ErrorWrapper from '../utils/ErrorWrapper.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import User from '../models/user.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_TEST_KEY_ID,
    key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
});

const calculateCartTotal = async (cart) => {
    let total = 0;
    if (!Array.isArray(cart)) {
        return 0;
    }
    for (const item of cart) {
        if (item && item.food && typeof item.food.price === 'number' && typeof item.quantity === 'number' && item.restaurant_name && item.category) {
             total += item.food.price * item.quantity;
        }
    }
    return total;
};

export const createOrder = ErrorWrapper(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id }).populate('cart.food');

    if (!user || !user.cart || user.cart.length === 0) {
        return next(new ErrorHandler(400, "Cart is empty or user not found"));
    }

    const totalAmountRupees = await calculateCartTotal(user.cart);
    const totalAmountPaise = Math.round(totalAmountRupees * 100);

    if (totalAmountPaise <= 0) {
         return next(new ErrorHandler(400, "Invalid cart total amount"));
    }

    const shortTimestamp = Date.now().toString().slice(-6);
    const receiptId = `rcpt_${user._id}_${shortTimestamp}`;

    const options = {
        amount: totalAmountPaise,
        currency: "INR",
        receipt: receiptId,
        payment_capture: 1
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(201).json({
            success: true,
            order_id: order.id,
            amount: totalAmountPaise,
            currency: order.currency
        });
    } catch (error) {
        next(new ErrorHandler(500, "Failed to create payment order"));
    }
});

export const verifyPayment = ErrorWrapper(async (req, res, next) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return next(new ErrorHandler(400, "Missing payment verification details"));
    }

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_TEST_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');
    const isAuthentic = digest === razorpay_signature;

    if (isAuthentic) {
        try {
            const user = await User.findOne({ _id: req.user._id }).populate('cart.food');

            if (!user) {
                 return next(new ErrorHandler(404, "User not found after authentication"));
            }

            const historyItems = user.cart.map(cartItem => {
                if (cartItem && cartItem.food) {
                    return {
                        name: cartItem.food.name,
                        price: cartItem.food.price,
                        quantity: cartItem.quantity,
                    };
                }
                return null;
            }).filter(item => item !== null);

            const newOrder = {
                items: historyItems,
                totalAmount: await calculateCartTotal(user.cart),
                payment: {
                    order_id: razorpay_order_id,
                    payment_id: razorpay_payment_id,
                    signature: razorpay_signature,
                    status: 'paid',
                    method: 'razorpay',
                },
                createdAt: new Date(),
            };

            user.orderHistory.unshift(newOrder);
            user.cart = [];
            try {
                 await user.save();
            } catch (saveError) {
                 throw saveError;
            }

            res.status(200).json({
                success: true,
                message: "Payment successful and order confirmed",
            });

        } catch (processError) {
            next(processError);
        }

    } else {
        next(new ErrorHandler(400, "Payment verification failed"));
    }
});

export const getOrderHistory = ErrorWrapper(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id }).select('orderHistory');

    if (!user) {
        return next(new ErrorHandler(404, "User not found"));
    }

    res.status(200).json({
        success: true,
        orderHistory: user.orderHistory
    });
});
