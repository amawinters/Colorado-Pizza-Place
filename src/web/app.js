let menu = [];
let cart = [];
let selectedPizza = null;
let toppingsData = {
    meat: [],
    veggie: [],
    cheese: []
};

const TOPPING_PRICE = 1.25;
const TAX_RATE = 0.0825;
const DELIVERY_FEE = 3.99;

/* ---------------- PAYMENT VALIDATION ---------------- */
function validatePayment() {
    const name = document.getElementById('card-name').value.trim();
    const number = document.getElementById('card-number').value.trim();
    const exp = document.getElementById('card-exp').value.trim();
    const cvv = document.getElementById('card-cvv').value.trim();
    const zip = document.getElementById('card-zip').value.trim();

    if (!name || !number || !exp || !cvv || !zip) {
        return "Please complete all payment fields.";
    }

    if (number.length !== 16 || isNaN(number)) {
        return "Invalid card number.";
    }

    if (!/^\d{2}\/\d{2}$/.test(exp)) {
        return "Expiration date must be in MM/YY format.";
    }

    if (cvv.length !== 3 || isNaN(cvv)) {
        return "Invalid CVV.";
    }

    if (zip.length !== 5 || isNaN(zip)) {
        return "Invalid ZIP code.";
    }

    return null;
}

/* ---------------- LOAD MENU ---------------- */
async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        if (!response.ok) throw new Error("Unable to load menu");

        menu = await response.json();

        document.getElementById('menu').innerHTML = menu.map(pizza => `
            <article class="card">
                <div class="pizza-icon">🍕</div>
                <h3>${pizza.name}</h3>
                <p>${pizza.description}</p>
                <p><strong>Starting at $${pizza.basePrice.toFixed(2)}</strong></p>
                <button class="primary" onclick="openCustomize(${pizza.id})">Customize Pizza</button>
            </article>
        `).join('');
    } catch (error) {
        console.error(error);
        document.getElementById('menu').innerHTML = '<p>Unable to load the pizza menu</p>';
    }
}

/* ---------------- LOAD TOPPINGS ---------------- */
async function loadToppings() {
    try {
        const response = await fetch('/api/toppings');
        if (!response.ok) throw new Error("Unable to load toppings");

        toppingsData = await response.json();
    } catch (error) {
        console.error(error);
        toppingsData = { meat: [], veggie: [], cheese: [] };
    }
}

/* ---------------- CUSTOMIZE PIZZA ---------------- */
async function openCustomize(id) {
    selectedPizza = menu.find(p => p.id === id);
    if (!selectedPizza) return;

    await loadToppings();

    document.getElementById('customPizzaName').textContent = selectedPizza.name;
    document.getElementById('customPizzaDescription').textContent = selectedPizza.description;

    document.getElementById('meatToppings').innerHTML = createToppingOptions(toppingsData.meat);
    document.getElementById('veggieToppings').innerHTML = createToppingOptions(toppingsData.veggie);
    document.getElementById('cheeseToppings').innerHTML = createToppingOptions(toppingsData.cheese);

    document.getElementById('customizeModal').classList.remove('hidden');
    updatePrice();
}

function createToppingOptions(toppings) {
    if (!toppings.length) return '<p>No toppings available</p>';

    return toppings.map(topping => `
        <label class="topping-option">
            <input type="checkbox" value="${topping}" onchange="updatePrice()">
            ${topping} (+$${TOPPING_PRICE.toFixed(2)})
        </label>
    `).join('');
}

function closeCustomize() {
    document.getElementById('customizeModal').classList.add('hidden');
}

function sizeFee() {
    const size = document.getElementById('size').value;
    const fees = { Small: 0, Medium: 2, Large: 4 };
    return fees[size] || 0;
}

function updatePrice() {
    if (!selectedPizza) return;

    const toppings = [...document.querySelectorAll('#meatToppings input:checked, #veggieToppings input:checked, #cheeseToppings input:checked')];
    const price = selectedPizza.basePrice + sizeFee() + toppings.length * TOPPING_PRICE;

    document.getElementById('customPrice').textContent = price.toFixed(2);
}

/* ---------------- CART FUNCTIONS ---------------- */
function addToCart() {
    if (!selectedPizza) return;

    const toppings = [...document.querySelectorAll('#meatToppings input:checked, #veggieToppings input:checked, #cheeseToppings input:checked')]
        .map(input => input.value);

    const item = {
        pizzaName: selectedPizza.name,
        size: document.getElementById('size').value,
        crust: document.getElementById('crust').value,
        toppings: toppings,
        unitPrice: Number(document.getElementById('customPrice').textContent),
        quantity: 1
    };

    cart.push(item);
    closeCustomize();
    updateCartCount();
    openCart();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function subtotal() {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

function openCart() {
    renderCart();
    document.getElementById('cartModal').classList.remove('hidden');
}

function closeCart() {
    document.getElementById('cartModal').classList.add('hidden');
}

function renderCart() {
    const container = document.getElementById('cartItems');

    if (!cart.length) {
        container.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        container.innerHTML = cart.map((item, i) => `
            <div class="cart-row">
                <div>
                    <strong>${item.pizzaName}</strong><br>
                    ${item.size}, ${item.crust}<br>
                    ${item.toppings.join(', ') || 'No extra toppings'}
                </div>
                <div class="qty">
                    $${(item.unitPrice * item.quantity).toFixed(2)}<br>
                    <button onclick="changeQty(${i}, -1)">−</button>
                    ${item.quantity}
                    <button onclick="changeQty(${i}, 1)">+</button>
                    <button onclick="removeItem(${i})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    updateSummary();
}

function changeQty(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);

    updateCartCount();
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
}

function updateSummary() {
    const sub = subtotal();
    const selectedOrderType = document.querySelector('input[name="orderType"]:checked');
    const delivery = selectedOrderType && selectedOrderType.value === 'delivery';

    document.getElementById('deliveryFields').classList.toggle('hidden', !delivery);
    document.getElementById('subtotal').textContent = sub.toFixed(2);

    const tax = sub * TAX_RATE;
    document.getElementById('tax').textContent = tax.toFixed(2);

    document.getElementById('deliveryFee').textContent = delivery ? DELIVERY_FEE.toFixed(2) : '0.00';

    const total = sub + tax + (delivery ? DELIVERY_FEE : 0);
    document.getElementById('total').textContent = total.toFixed(2);
}

/* ---------------- RECEIPT PAGE ---------------- */
function showReceipt(orderNumber, total) {
    document.getElementById('receiptNumber').textContent = `Order Number: ${orderNumber}`;
    document.getElementById('receiptTotal').textContent = `Total Paid: $${total}`;

    const items = cart.map(item =>
        `${item.quantity}x ${item.size} ${item.pizzaName} (${item.crust})`
    ).join('<br>');

    document.getElementById('receiptItems').innerHTML = items;

    document.getElementById('receiptPage').classList.remove('hidden');
    closeCart();
}

function closeReceipt() {
    document.getElementById('receiptPage').classList.add('hidden');
}

/* ---------------- PLACE ORDER (UPDATED) ---------------- */
function placeOrder() {
    const orderMessage = document.getElementById("orderMessage");
    const spinner = document.getElementById("loadingSpinner");

    orderMessage.textContent = "";

    if (!cart.length) {
        showMessage('Add a pizza to the cart before placing an order.');
        return;
    }

    const captchaResponse = document.querySelector('[name="cf-turnstile-response"]')?.value;
    if (!captchaResponse) {
        showMessage('Please complete the I am not a robot verification.');
        return;
    }

    const selectedOrderType = document.querySelector('input[name="orderType"]:checked');
    const delivery = selectedOrderType && selectedOrderType.value === 'delivery';

    if (delivery) {
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const zip = document.getElementById('zip').value.trim();

        if (!address || !city || !zip) {
            showMessage('Please complete the delivery address, city, and ZIP code.');
            return;
        }
    }

    const paymentError = validatePayment();
    if (paymentError) {
        showMessage(paymentError);
        return;
    }

    spinner.classList.remove('hidden');
    showMessage("Processing payment...");

    setTimeout(() => {
        spinner.classList.add('hidden');

        const paymentSuccess = Math.random() > 0.2;

        if (!paymentSuccess) {
            showMessage("Payment failed. Please try another card.");
            return;
        }

        const orderNumber = Math.floor(10000 + Math.random() * 90000);
        const total = document.getElementById('total').textContent;

        showReceipt(orderNumber, total);

        cart = [];
        updateCartCount();
        renderCart();

    }, 2000);
}

/* ---------------- MESSAGE ---------------- */
function showMessage(text) {
    document.getElementById('orderMessage').textContent = text;
}

/* ---------------- INIT ---------------- */
loadMenu();
loadToppings();
