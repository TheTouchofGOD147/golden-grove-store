"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./checkout.module.css";

type CartItem = {
  id: number;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  image?: string;
};

type OrderResult = {
  success: boolean;
  orderNumber?: string;
  total?: number;
  message?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderResult | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "",
    deliveryNotes: "",
  });

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("goldenHarvestCart");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch {
      setCart([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cart]);

  function updateField(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cart.length === 0 || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: form,

          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const result: OrderResult = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "We couldn't submit your order. Please try again."
        );
      }

      sessionStorage.removeItem("goldenHarvestCart");
      setCart([]);
      setOrder(result);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting your order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!loaded) {
    return (
      <main className={styles.loading}>
        <div className={styles.loadingMark}>GH</div>
        <p>Preparing checkout...</p>
      </main>
    );
  }

  if (order?.success && order.orderNumber) {
    return (
      <main className={styles.successPage}>
        <section className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>

          <p className={styles.eyebrow}>ORDER RECEIVED</p>

          <h1>Thank you for your order.</h1>

          <p className={styles.successMessage}>
            Your Golden Harvest order has been successfully received
            and is now being processed.
          </p>

          <div className={styles.orderNumberBox}>
            <span>ORDER NUMBER</span>
            <strong>{order.orderNumber}</strong>
          </div>

          {typeof order.total === "number" && (
            <div className={styles.confirmedTotal}>
              <span>Order subtotal</span>
              <strong>{formatCurrency(order.total)}</strong>
            </div>
          )}

          <p className={styles.emailNotice}>
            A confirmation has been sent to the email address provided
            with your order. Please keep your order number for
            reference.
          </p>

          <div className={styles.successActions}>
            <Link href="/" className={styles.primaryLink}>
              Return to Golden Harvest
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className={styles.emptyPage}>
        <section className={styles.emptyCard}>
          <div className={styles.emptyMark}>GH</div>

          <p className={styles.eyebrow}>YOUR ORDER</p>

          <h1>Your cart is empty.</h1>

          <p>
            Add products to your cart before proceeding to checkout.
          </p>

          <Link href="/#products" className={styles.primaryLink}>
            Browse Products
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.checkoutPage}>
      <header className={styles.checkoutHeader}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>GH</span>

          <span>
            <strong>Golden Harvest</strong>
            <small>Secure Checkout</small>
          </span>
        </Link>

        <Link href="/#products" className={styles.backLink}>
          ← Continue Shopping
        </Link>
      </header>

      <section className={styles.checkoutIntro}>
        <p className={styles.eyebrow}>COMPLETE YOUR ORDER</p>
        <h1>Checkout</h1>

        <p>
          Enter your information below and review your Golden Harvest
          order before submitting.
        </p>
      </section>

      <div className={styles.checkoutLayout}>
        <form
          className={styles.checkoutForm}
          onSubmit={submitOrder}
        >
          <section className={styles.formSection}>
            <div className={styles.sectionNumber}>01</div>

            <div className={styles.sectionTitle}>
              <h2>Contact Information</h2>
              <p>
                We'll use these details to communicate about your
                order.
              </p>
            </div>

            <div className={styles.formGrid}>
              <label>
                <span>First Name *</span>
                <input
                  required
                  name="firstName"
                  value={form.firstName}
                  onChange={updateField}
                  autoComplete="given-name"
                />
              </label>

              <label>
                <span>Last Name *</span>
                <input
                  required
                  name="lastName"
                  value={form.lastName}
                  onChange={updateField}
                  autoComplete="family-name"
                />
              </label>

              <label>
                <span>Email Address *</span>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  autoComplete="email"
                />
              </label>

              <label>
                <span>Phone Number *</span>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  autoComplete="tel"
                />
              </label>

              <label className={styles.fullWidth}>
                <span>Company / Business</span>
                <input
                  name="company"
                  value={form.company}
                  onChange={updateField}
                  placeholder="Optional"
                  autoComplete="organization"
                />
              </label>
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionNumber}>02</div>

            <div className={styles.sectionTitle}>
              <h2>Delivery Information</h2>
              <p>
                Tell us where this order should be delivered or
                fulfilled.
              </p>
            </div>

            <div className={styles.formGrid}>
              <label className={styles.fullWidth}>
                <span>Street Address *</span>
                <input
                  required
                  name="address"
                  value={form.address}
                  onChange={updateField}
                  autoComplete="street-address"
                />
              </label>

              <label>
                <span>City *</span>
                <input
                  required
                  name="city"
                  value={form.city}
                  onChange={updateField}
                  autoComplete="address-level2"
                />
              </label>

              <label>
                <span>State *</span>
                <input
                  required
                  name="state"
                  value={form.state}
                  onChange={updateField}
                  autoComplete="address-level1"
                />
              </label>

              <label>
                <span>ZIP Code *</span>
                <input
                  required
                  name="zip"
                  value={form.zip}
                  onChange={updateField}
                  autoComplete="postal-code"
                />
              </label>

              <label className={styles.fullWidth}>
                <span>Order / Delivery Notes</span>
                <textarea
                  name="deliveryNotes"
                  value={form.deliveryNotes}
                  onChange={updateField}
                  placeholder="Special instructions or information about your order..."
                  rows={5}
                />
              </label>
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionNumber}>03</div>

            <div className={styles.sectionTitle}>
              <h2>Payment Method</h2>
              <p>
                Select how you would like to pay for your order.
              </p>
            </div>

            <div className={styles.formGrid}>
              <label className={styles.fullWidth}>
                <span>Preferred Payment Method *</span>

                <select
                  required
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      paymentMethod: event.target.value,
                    }))
                  }
                >
                  <option value="">Select a payment method</option>
                  <option value="Credit / Debit Card">
                    Credit / Debit Card
                  </option>
                  <option value="Bank Transfer / ACH">
                    Bank Transfer / ACH
                  </option>
                  <option value="Invoice">
                    Invoice
                  </option>
                </select>
              </label>
            </div>

            <div className={styles.paymentNotice}>
              <strong>Payment will be arranged after order review.</strong>
              <p>
                No payment is charged through this form. Golden Harvest
                will provide payment instructions based on the method
                selected above.
              </p>
            </div>
          </section>

          {error && (
            <div className={styles.errorMessage}>
              <strong>We couldn't submit the order.</strong>
              <span>{error}</span>
            </div>
          )}

          <button
            className={styles.placeOrderButton}
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Submitting Your Order..."
              : "Place Order"}
          </button>

          <p className={styles.submitNotice}>
            By placing your order, you confirm that the information
            provided is accurate. Your order will be reviewed and
            processed by Golden Harvest.
          </p>
        </form>

        <aside className={styles.orderSummary}>
          <div className={styles.summaryHeader}>
            <p className={styles.eyebrow}>YOUR ORDER</p>
            <h2>Order Summary</h2>
          </div>

          <div className={styles.summaryItems}>
            {cart.map((item) => (
              <div className={styles.summaryItem} key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    {item.quantity} × {formatCurrency(item.price)}
                  </span>
                  <small>{item.unit}</small>
                </div>

                <strong>
                  {formatCurrency(item.price * item.quantity)}
                </strong>
              </div>
            ))}
          </div>

          <div className={styles.summaryTotal}>
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>

          <div className={styles.deliveryNotice}>
            <strong>Delivery & final charges</strong>
            <p>
              Delivery charges or other applicable costs will be
              confirmed during order processing when required.
            </p>
          </div>

          <div className={styles.secureNotice}>
            <span>✓</span>

            <div>
              <strong>Order information protected</strong>
              <p>
                Your order is submitted directly to Golden Harvest.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}


