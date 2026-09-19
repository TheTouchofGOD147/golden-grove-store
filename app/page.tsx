"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  available: boolean;
  featured?: boolean;
};

type CartItem = Product & {
  quantity: number;
};

const INVENTORY_DATE = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date());

const products: Product[] = [
  {
    id: 1,
    name: "Premium Long Grain Rice",
    category: "Grains",
    description:
      "Clean, carefully selected long grain rice for households, restaurants, retailers and bulk buyers.",
    price: 34.99,
    unit: "25 lb bag",
    image: "/products/rice.jpg",
    available: true,
    featured: true,
  },
  {
    id: 2,
    name: "Yellow Corn",
    category: "Grains",
    description:
      "Quality yellow corn suitable for food processing, livestock operations and commercial buyers.",
    price: 24.99,
    unit: "25 lb bag",
    image: "/products/yellow-corn.jpg",
    available: true,
  },
  {
    id: 3,
    name: "White Corn",
    category: "Grains",
    description:
      "Carefully sourced white corn available for household, commercial and wholesale orders.",
    price: 25.99,
    unit: "25 lb bag",
    image: "/products/white-corn.jpg",
    available: true,
  },
  {
    id: 4,
    name: "Hard Red Wheat",
    category: "Grains",
    description:
      "Quality hard red wheat ideal for milling, baking, food production and bulk purchasing.",
    price: 29.99,
    unit: "25 lb bag",
    image: "/products/wheat.jpg",
    available: true,
  },
  {
    id: 5,
    name: "Whole Oats",
    category: "Grains",
    description:
      "Whole oats selected for dependable quality and supplied for household and commercial use.",
    price: 27.99,
    unit: "25 lb bag",
    image: "/products/oats.jpg",
    available: true,
  },
  {
    id: 6,
    name: "Pinto Beans",
    category: "Beans & Legumes",
    description:
      "Clean and carefully selected pinto beans available for families, food businesses and resellers.",
    price: 32.99,
    unit: "20 lb bag",
    image: "/products/pinto-beans.jpg",
    available: true,
    featured: true,
  },
  {
    id: 7,
    name: "Black Beans",
    category: "Beans & Legumes",
    description:
      "Quality black beans with dependable consistency for household kitchens and commercial buyers.",
    price: 33.99,
    unit: "20 lb bag",
    image: "/products/black-beans.jpg",
    available: true,
  },
  {
    id: 8,
    name: "Red Kidney Beans",
    category: "Beans & Legumes",
    description:
      "Carefully sourced red kidney beans available for retail, restaurant and bulk orders.",
    price: 35.99,
    unit: "20 lb bag",
    image: "/products/kidney-beans.jpg",
    available: true,
  },
  {
    id: 9,
    name: "Soybeans",
    category: "Farm Commodities",
    description:
      "Quality soybeans supplied for food production, agricultural processing and commercial use.",
    price: 28.99,
    unit: "25 lb bag",
    image: "/products/soybeans.jpg",
    available: true,
  },
  {
    id: 10,
    name: "Raw Peanuts",
    category: "Farm Commodities",
    description:
      "Raw peanuts selected for freshness and suitable for processing, roasting, resale and food service.",
    price: 31.99,
    unit: "20 lb bag",
    image: "/products/peanuts.jpg",
    available: true,
    featured: true,
  },
  {
    id: 11,
    name: "Sunflower Seeds",
    category: "Seeds",
    description:
      "Quality sunflower seeds available for food processing, agricultural and commercial requirements.",
    price: 26.99,
    unit: "20 lb bag",
    image: "/products/sunflower-seeds.jpg",
    available: true,
  },
  {
    id: 12,
    name: "Barley",
    category: "Grains",
    description:
      "Clean barley supplied for food, agricultural and commercial customers requiring dependable quality.",
    price: 28.49,
    unit: "25 lb bag",
    image: "/products/barley.jpg",
    available: true,
  },

  {
    id: 13,
    name: "Angus Cattle",
    category: "Livestock",
    description: "Farm-raised Angus cattle, typically 900-1,300 lb.",
    price: 2200,
    unit: "per head",
    image: "/products/angus-cattle.jpg",
    available: true,
    featured: true,
  },
  {
    id: 14,
    name: "Hereford Cattle",
    category: "Livestock",
    description: "Hereford cattle, typically 900-1,300 lb.",
    price: 2000,
    unit: "per head",
    image: "/products/hereford-cattle.jpg",
    available: true,
  },
  {
    id: 15,
    name: "Holstein Dairy Cow",
    category: "Livestock",
    description: "Holstein dairy cow, typically 1,000-1,500 lb.",
    price: 2400,
    unit: "per head",
    image: "/products/holstein-dairy-cow.jpg",
    available: true,
    featured: true,
  },
  {
    id: 16,
    name: "Dorper Sheep",
    category: "Livestock",
    description: "Dorper sheep, typically 100-200 lb.",
    price: 375,
    unit: "per head",
    image: "/products/dorper-sheep.jpg",
    available: true,
  },
  {
    id: 17,
    name: "Suffolk Sheep",
    category: "Livestock",
    description: "Suffolk sheep, typically 150-250 lb.",
    price: 450,
    unit: "per head",
    image: "/products/suffolk-sheep.jpg",
    available: true,
  },
  {
    id: 18,
    name: "Yorkshire Pig",
    category: "Livestock",
    description: "Yorkshire pig, typically 200-300 lb.",
    price: 400,
    unit: "per head",
    image: "/products/yorkshire-pig.jpg",
    available: true,
  },
  {
    id: 19,
    name: "Berkshire Pig",
    category: "Livestock",
    description: "Berkshire pig, typically 200-300 lb.",
    price: 500,
    unit: "per head",
    image: "/products/berkshire-pig.jpg",
    available: true,
  },
  {
    id: 20,
    name: "Broiler Chicken",
    category: "Poultry",
    description: "Farm-raised broiler chicken, typically 5-8 lb.",
    price: 18,
    unit: "per bird",
    image: "/products/broiler-chicken.jpg",
    available: true,
  },
  {
    id: 21,
    name: "Laying Hen",
    category: "Poultry",
    description: "Adult laying hen available per bird.",
    price: 25,
    unit: "per bird",
    image: "/products/laying-hen.jpg",
    available: true,
  },
  {
    id: 22,
    name: "Broad Breasted Turkey",
    category: "Poultry",
    description: "Broad breasted turkey, typically 15-30 lb.",
    price: 65,
    unit: "per bird",
    image: "/products/broad-breasted-turkey.jpg",
    available: true,
    featured: true,
  },
  {
    id: 23,
    name: "Mini Cultivator",
    category: "Farm Machinery",
    description: "Compact 5-7 HP cultivator for small-farm soil preparation.",
    price: 650,
    unit: "per unit",
    image: "/products/mini-cultivator.jpg",
    available: true,
  },
  {
    id: 24,
    name: "Power Tiller",
    category: "Farm Machinery",
    description: "7-10 HP power tiller for cultivation and field preparation.",
    price: 1100,
    unit: "per unit",
    image: "/products/power-tiller.jpg",
    available: true,
  },
  {
    id: 25,
    name: "Walk-Behind Tractor",
    category: "Farm Machinery",
    description: "10-15 HP walk-behind tractor for versatile small-farm work.",
    price: 2400,
    unit: "per unit",
    image: "/products/walk-behind-tractor.jpg",
    available: true,
  },
  {
    id: 26,
    name: "Compact Mini Tractor",
    category: "Farm Machinery",
    description: "18-25 HP compact mini tractor designed for small farms.",
    price: 8500,
    unit: "per unit",
    image: "/products/compact-mini-tractor.jpg",
    available: true,
    featured: true,
  },
  {
    id: 27,
    name: "Compact Utility Tractor",
    category: "Farm Machinery",
    description: "25-35 HP compact utility tractor for everyday farm operations.",
    price: 14500,
    unit: "per unit",
    image: "/products/compact-utility-tractor.jpg",
    available: true,
  },
  {
    id: 28,
    name: "Small Farm Tractor",
    category: "Farm Machinery",
    description: "35-45 HP tractor for demanding small-farm operations.",
    price: 21500,
    unit: "per unit",
    image: "/products/small-farm-tractor.jpg",
    available: true,
    featured: true,
  },
  {
    id: 29,
    name: "Rotary Tiller Attachment",
    category: "Farm Machinery",
    description: "4-5 ft rotary tiller attachment for compatible tractors.",
    price: 1850,
    unit: "per unit",
    image: "/products/rotary-tiller-attachment.jpg",
    available: true,
  },];

const categories = [
  "All Products",
  "Grains",
  "Beans & Legumes",
  "Farm Commodities",
  "Seeds",
  "Livestock",
  "Poultry",
  "Farm Machinery",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function Home() {
  const [inventoryDate, setInventoryDate] = useState("");

  useEffect(() => {
    setInventoryDate(
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date())
    );
  }, []);

  const [activeCategory, setActiveCategory] = useState("All Products");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All Products") {
      return products;
    }

    return products.filter(
      (product) => product.category === activeCategory
    );
  }, [activeCategory]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function addToCart(product: Product) {
    if (!product.available) return;

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setCartOpen(true);
  }

  function increaseQuantity(id: number) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(id: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id: number) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  return (
    <>
      <header className="site-header">
        <a href="#" className="brand">
          <div className="brand-mark">
            <span>GGH</span>
          </div>

          <div className="brand-copy">
            <strong>Golden Grove Harvest</strong>
            <span>Quality from the source</span>
          </div>
        </a>

        <nav className="desktop-nav">
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#wholesale">Wholesale</a>
          <a
  href="https://www.goldenharvest.space/#contact"
  target="_blank"
  rel="noopener noreferrer"
>
  Contact
</a>
        </nav>

        <button
          className="cart-button"
          type="button"
          onClick={() => setCartOpen(true)}
        >
          <span>Cart</span>
          <span className="cart-count">{cartCount}</span>
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="availability-pill">
              <span className="live-dot" />
              CURRENT INVENTORY AVAILABLE
            </div>

            <p className="eyebrow">FROM THE HARVEST TO YOUR BUSINESS</p>

            <h1>
              Quality you can
              <br />
              <span>count on.</span>
            </h1>

            <p className="hero-description">
              Shop dependable agricultural products from Golden Harvest.
              We serve households, retailers, restaurants, food
              businesses and bulk buyers with a simple and reliable
              ordering experience.
            </p>

            <div className="hero-actions">
              <a href="#products" className="primary-button">
                Shop Available Products
              </a>

              <a href="#wholesale" className="secondary-button">
                Bulk Orders
              </a>
            </div>

            <div className="hero-points">
              <div>
                <strong>Quality Selected</strong>
                <span>Products chosen with care</span>
              </div>

              <div>
                <strong>Reliable Supply</strong>
                <span>Built for repeat buyers</span>
              </div>

              <div>
                <strong>Easy Ordering</strong>
                <span>Simple online checkout</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-image">
              <Image
                src="/products/hero-harvest.jpg"
                alt="Golden Harvest agricultural products"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>

            <div className="hero-floating-card">
              <span className="floating-icon">&#10003;</span>

              <div>
                <strong>Available Now</strong>
                <small>{inventoryDate ? `Updated ${inventoryDate}` : "Inventory updated"}</small>
              </div>
            </div>
          </div>
        </section>

        <section className="availability-strip">
          <div className="availability-strip-inner">
            <div>
              <span className="availability-icon">&#10003;</span>

              <div>
                <strong>Available Products</strong>
                <p>
                  Current product availability as of {INVENTORY_DATE}
                </p>
              </div>
            </div>

            <p className="availability-note">
              Availability may change as orders are processed.
            </p>
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CURRENTLY AVAILABLE</p>

              <h2>Shop the Harvest</h2>

              <p>
                Products shown below are listed as available as of{" "}
                {INVENTORY_DATE}.
              </p>
            </div>

            <div className="inventory-status">
              <span className="live-dot" />
              Inventory updated {INVENTORY_DATE}
            </div>
          </div>

          <div className="categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  activeCategory === category ? "active" : ""
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />

                  <div className="product-badges">
                    {product.available && (
                      <span className="available-badge">
                        <span />
                        Available
                      </span>
                    )}

                    {product.featured && (
                      <span className="featured-badge">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                <div className="product-content">
                  <span className="product-category">
                    {product.category}
                  </span>

                  <h3>{product.name}</h3>

                  <p>{product.description}</p>

                  <div className="product-availability">
                    <span className="stock-dot" />

                    <div>
                      <strong>In Stock</strong>
                      <small>
                        Available as of {INVENTORY_DATE}
                      </small>
                    </div>
                  </div>

                  <div className="product-bottom">
                    <div className="product-price">
                      <strong>
                        {formatCurrency(product.price)}
                      </strong>

                      <span>per {product.unit}</span>
                    </div>

                    <button
                      type="button"
                      disabled={!product.available}
                      onClick={() => addToCart(product)}
                    >
                      {product.available
                        ? "Add to Cart"
                        : "Unavailable"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="inventory-disclaimer">
            <strong>Looking for larger quantities?</strong>

            <p>
              Product availability can change throughout the day as
              orders are received. For pallet, wholesale or recurring
              supply requirements, contact Golden Harvest for current
              volume availability.
            </p>
          </div>
        </section>

        <section className="wholesale-section" id="wholesale">
          <div className="wholesale-image">
            <Image
              src="/products/wholesale.jpg"
              alt="Golden Harvest wholesale agricultural products"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>

          <div className="wholesale-content">
            <p className="eyebrow">WHOLESALE & BULK SUPPLY</p>

            <h2>
              Need more than a few bags?
            </h2>

            <p>
              Golden Harvest works with restaurants, retailers,
              distributors, food businesses and other commercial
              customers requiring larger quantities.
            </p>

            <div className="wholesale-benefits">
              <div>
                <span>01</span>

                <div>
                  <strong>Bulk quantities</strong>
                  <p>
                    Request larger quantities based on current
                    availability.
                  </p>
                </div>
              </div>

              <div>
                <span>02</span>

                <div>
                  <strong>Business purchasing</strong>
                  <p>
                    Ordering support for restaurants, retailers and
                    commercial buyers.
                  </p>
                </div>
              </div>

              <div>
                <span>03</span>

                <div>
                  <strong>Recurring supply</strong>
                  <p>
                    Discuss repeat purchasing requirements with our
                    team.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://www.goldenharvest.space/#contact"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask About Bulk Orders
            </a>
          </div>
        </section>

        <section className="about-section" id="about">
          <div>
            <p className="eyebrow">WHY GOLDEN HARVEST</p>

            <h2>
              Dependable products.
              <br />
              Straightforward ordering.
            </h2>
          </div>

          <div className="about-copy">
            <p>
              Golden Harvest is focused on making agricultural
              purchasing straightforward. Buyers can browse currently
              available products, select the quantity they need and
              submit an order through a simple online process.
            </p>

            <div className="about-features">
              <div>
                <span>&#10003;</span><strong>Quality products</strong>
              </div>

              <div>
                <span>&#10003;</span><strong>Current availability</strong>
              </div>

              <div>
                <span>&#10003;</span><strong>Retail & bulk orders</strong>
              </div>

              <div>
                <span>&#10003;</span><strong>Order confirmation</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section" id="contact">
          <p className="eyebrow">START YOUR ORDER</p>

          <h2>
            Your next harvest
            <br />
            starts here.
          </h2>

          <p>
            Browse the products currently available from Golden Harvest
            and build your order.
          </p>

          <a href="#products" className="cta-button">
            Browse Available Products
          </a>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <strong>Golden Harvest</strong>
          <p>Quality from the source.</p>
        </div>

        <div className="footer-center">
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#wholesale">Wholesale</a>
        </div>

        <p className="copyright">
          &#169; {new Date().getFullYear()} Golden Harvest.
          <br />
          All rights reserved.
        </p>
      </footer>

      {cartOpen && (
        <>
          <div
            className="cart-overlay"
            onClick={() => setCartOpen(false)}
          />

          <aside className="cart-drawer">
            <div className="cart-header">
              <div>
                <span>YOUR ORDER</span>
                <h2>Shopping Cart</h2>
              </div>

              <button
                type="button"
                className="close-cart"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping cart"
              >
                &times;
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">GH</div>

                <h3>Your cart is empty</h3>

                <p>
                  Browse the currently available Golden Harvest
                  products and add what you need.
                </p>

                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-image">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                        />
                      </div>

                      <div className="cart-item-info">
                        <div className="cart-item-top">
                          <div>
                            <h3>{item.name}</h3>
                            <span>{item.unit}</span>
                          </div>

                          <button
                            type="button"
                            aria-label={`Remove ${item.name}`}
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                          >
                            &times;
                          </button>
                        </div>

                        <div className="cart-item-bottom">
                          <div className="quantity-control">
                            <button
                              type="button"
                              aria-label={`Decrease ${item.name} quantity`}
                              onClick={() =>
                                decreaseQuantity(item.id)
                              }
                            >
                              &minus;
                            </button>

                            <span>{item.quantity}</span>

                            <button
                              type="button"
                              aria-label={`Increase ${item.name} quantity`}
                              onClick={() =>
                                increaseQuantity(item.id)
                              }
                            >
                              +
                            </button>
                          </div>

                          <strong>
                            {formatCurrency(
                              item.price * item.quantity
                            )}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="subtotal-row">
                    <span>Subtotal</span>
                    <strong>
                      {formatCurrency(subtotal)}
                    </strong>
                  </div>

                  <p>
                    Shipping, delivery and applicable charges will be
                    calculated or confirmed during checkout.
                  </p>

                  <button
                    className="checkout-button"
                    type="button"
                    onClick={() => {
                      sessionStorage.setItem(
                        "goldenHarvestCart",
                        JSON.stringify(cart)
                      );

                      window.location.href = "/checkout";
                    }}
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    className="continue-button"
                    type="button"
                    onClick={() => setCartOpen(false)}
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </aside>
        </>
      )}
    </>
  );
}



