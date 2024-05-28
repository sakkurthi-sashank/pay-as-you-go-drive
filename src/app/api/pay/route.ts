import { NextResponse } from 'next/server';

interface PaymentData {
    amount: number;
}

interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
}

export async function POST(request: Request): Promise<Response> {
    try {
        const requestData: PaymentData = await request.json();
        const { amount } = requestData;
 
        const Razorpay = require("razorpay");
        const instance = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID || "",
            key_secret: process.env.RAZOR_PAY_KEY_SECRET || "",
        });

        const orderOptions = {
            amount: amount * 100,
            currency: "INR",
            receipt: `order_${Date.now()}`,
        };

        const order: RazorpayOrder = await new Promise((resolve, reject) => {
            instance.orders.create(orderOptions, (err: any, order: RazorpayOrder) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(order);
                }
            });
        });

        console.log("Order created: ", order);

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Error creating order: ", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" });
    }
}
