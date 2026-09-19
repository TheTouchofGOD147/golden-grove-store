import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomUUID } from "crypto";

type CatalogProduct = {
  id?: number;
  name: string;
  price: number;
  unit: string;
  available: boolean;
};

const catalog: Record<number, CatalogProduct> = {
  1: {
    name: "Premium Long Grain Rice",
    price: 34.99,
    unit: "25 lb bag",
    available: true,
  },
  2: {
    name: "Yellow Corn",
    price: 24.99,
    unit: "25 lb bag",
    available: true,
  },
  3: {
    name: "White Corn",
    price: 25.99,
    unit: "25 lb bag",
    available: true,
  },
  4: {
    name: "Hard Red Wheat",
    price: 29.99,
    unit: "25 lb bag",
    available: true,
  },
  5: {
    name: "Whole Oats",
    price: 27.99,
    unit: "25 lb bag",
    available: true,
  },
  6: {
    name: "Pinto Beans",
    price: 32.99,
    unit: "20 lb bag",
    available: true,
  },
  7: {
    name: "Black Beans",
    price: 33.99,
    unit: "20 lb bag",
    available: true,
  },
  8: {
    name: "Red Kidney Beans",
    price: 35.99,
    unit: "20 lb bag",
    available: true,
  },
  9: {
    name: "Soybeans",
    price: 28.99,
    unit: "25 lb bag",
    available: true,
  },
  10: {
    name: "Raw Peanuts",
    price: 31.99,
    unit: "20 lb bag",
    available: true,
  },
  11: {
    name: "Sunflower Seeds",
    price: 26.99,
    unit: "20 lb bag",
    available: true,
  },
  12: {
    name: "Barley",
    price: 28.49,
    unit: "25 lb bag",
    available: true,
  },

  13: {
    id: 13,
    name: "Angus Cattle",
    price: 2200,
    unit: "per head",
    available: true,
  },
  14: {
    id: 14,
    name: "Hereford Cattle",
    price: 2000,
    unit: "per head",
    available: true,
  },
  15: {
    id: 15,
    name: "Holstein Dairy Cow",
    price: 2400,
    unit: "per head",
    available: true,
  },
  16: {
    id: 16,
    name: "Dorper Sheep",
    price: 375,
    unit: "per head",
    available: true,
  },
  17: {
    id: 17,
    name: "Suffolk Sheep",
    price: 450,
    unit: "per head",
    available: true,
  },
  18: {
    id: 18,
    name: "Yorkshire Pig",
    price: 400,
    unit: "per head",
    available: true,
  },
  19: {
    id: 19,
    name: "Berkshire Pig",
    price: 500,
    unit: "per head",
    available: true,
  },
  20: {
    id: 20,
    name: "Broiler Chicken",
    price: 18,
    unit: "per bird",
    available: true,
  },
  21: {
    id: 21,
    name: "Laying Hen",
    price: 25,
    unit: "per bird",
    available: true,
  },
  22: {
    id: 22,
    name: "Broad Breasted Turkey",
    price: 65,
    unit: "per bird",
    available: true,
  },
  23: {
    id: 23,
    name: "Mini Cultivator",
    price: 650,
    unit: "per unit",
    available: true,
  },
  24: {
    id: 24,
    name: "Power Tiller",
    price: 1100,
    unit: "per unit",
    available: true,
  },
  25: {
    id: 25,
    name: "Walk-Behind Tractor",
    price: 2400,
    unit: "per unit",
    available: true,
  },
  26: {
    id: 26,
    name: "Compact Mini Tractor",
    price: 8500,
    unit: "per unit",
    available: true,
  },
  27: {
    id: 27,
    name: "Compact Utility Tractor",
    price: 14500,
    unit: "per unit",
    available: true,
  },
  28: {
    id: 28,
    name: "Small Farm Tractor",
    price: 21500,
    unit: "per unit",
    available: true,
  },
  29: {
    id: 29,
    name: "Rotary Tiller Attachment",
    price: 1850,
    unit: "per unit",
    available: true,
  },};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function clean(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return "";

  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, maxLength);
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createOrderNumber() {
  const now = new Date();

  const date = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
  ].join("");

  const suffix = randomUUID()
    .replace(/-/g, "")
    .slice(0, 6)
    .toUpperCase();

  return `GH-${date}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customer = body?.customer;
    const incomingItems = body?.items;

    if (!customer || !Array.isArray(incomingItems)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order information.",
        },
        { status: 400 }
      );
    }

    const firstName = clean(customer.firstName, 80);
    const lastName = clean(customer.lastName, 80);
    const email = clean(customer.email, 160).toLowerCase();
    const phone = clean(customer.phone, 50);
    const company = clean(customer.company, 120);
    const address = clean(customer.address, 200);
    const city = clean(customer.city, 100);
    const state = clean(customer.state, 100);
    const zip = clean(customer.zip, 30);
    const paymentMethod = clean(customer.paymentMethod, 80);
    const  deliveryNotes = clean(customer.deliveryNotes, 1000);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !zip
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    const allowedPaymentMethods = [
      "Credit / Debit Card",
      "Bank Transfer / ACH",
      "Invoice",
    ];

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid payment method.",
        },
        { status: 400 }
      );
    }

    if (!validEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    if (
      incomingItems.length === 0 ||
      incomingItems.length > 50
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Your order does not contain valid products.",
        },
        { status: 400 }
      );
    }

    const orderItems: {
      id: number;
      name: string;
      unit: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }[] = [];

    for (const incomingItem of incomingItems) {
      const id = Number(incomingItem?.id);
      const quantity = Number(incomingItem?.quantity);

      if (
        !Number.isInteger(id) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 100
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "One or more product quantities are invalid.",
          },
          { status: 400 }
        );
      }

      const product = catalog[id];

      if (!product || !product.available) {
        return NextResponse.json(
          {
            success: false,
            message:
              "One or more products are no longer available.",
          },
          { status: 400 }
        );
      }

      const lineTotal = Number(
        (product.price * quantity).toFixed(2)
      );

      orderItems.push({
        id,
        name: product.name,
        unit: product.unit,
        quantity,
        unitPrice: product.price,
        lineTotal,
      });
    }

    const total = Number(
      orderItems
        .reduce((sum, item) => sum + item.lineTotal, 0)
        .toFixed(2)
    );

    const orderNumber = createOrderNumber();

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const orderEmail = process.env.ORDER_EMAIL;

    if (
      !smtpHost ||
      !smtpUser ||
      !smtpPass ||
      !orderEmail
    ) {
      console.error(
        "Golden Harvest SMTP environment variables are incomplete."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Order processing is temporarily unavailable. Please try again later.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const itemLines = orderItems
      .map(
        (item) =>
          `${item.name}
Quantity: ${item.quantity}
Unit: ${item.unit}
Unit price: ${money(item.unitPrice)}
Line total: ${money(item.lineTotal)}`
      )
      .join("\n\n");

    const businessMessage = `
NEW GOLDEN HARVEST ORDER

Order Number: ${orderNumber}
Order Status: Received / Processing

CUSTOMER
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Company: ${company || "Not provided"}

DELIVERY
Address: ${address}
City: ${city}
State: ${state}
ZIP Code: ${zip}

ORDER
${itemLines}

ORDER SUBTOTAL: ${money(total)}

CUSTOMER NOTES
${deliveryNotes || "No additional notes provided."}

This order was submitted through the Golden Harvest website.
`.trim();

    const customerMessage = `
Hello ${firstName},

Thank you for your order with Golden Harvest.

Your order has been successfully received and is now being processed.

ORDER NUMBER
${orderNumber}

ORDER DETAILS

${itemLines}

SUBTOTAL
${money(total)}

DELIVERY INFORMATION
${address}
${city}, ${state} ${zip}

Please keep your order number for reference.

Delivery charges or other applicable costs, if required, will be confirmed during order processing.

Thank you for choosing Golden Harvest.

Golden Harvest
Quality from the source.
`.trim();

    await transporter.sendMail({
      from: `"Golden Harvest Orders" <${smtpUser}>`,
      to: orderEmail,
      replyTo: email,
      subject: `New Order ${orderNumber} â€” ${firstName} ${lastName}`,
      text: businessMessage,
    });

    await transporter.sendMail({
      from: `"Golden Harvest" <${smtpUser}>`,
      to: email,
      subject: `We've received your Golden Harvest order â€” ${orderNumber}`,
      text: customerMessage,
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      total,
      message:
        "Your order has been received and is being processed.",
    });
  } catch (error) {
    console.error("Golden Harvest order error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "We couldn't process your order. Please try again.",
      },
      { status: 500 }
    );
  }
}



