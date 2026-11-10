/* AUREVÉ - shared site script: auth guard, nav, products, cart */
(function () {
    'use strict';

    /* ---------- Auth guard ---------- */
    var user = localStorage.getItem('aureveUser');
    if (!user) { window.location.replace('login.html'); return; }

    /* ---------- Product data ---------- */
    var PRODUCTS = [
        { id: 1, name: 'Torresella Merlot', type: 'Red', origin: 'Veneto, Italy', price: 59, img: 'images/torresella-merlot.png', desc: 'Smooth and fruity with ripe plum and soft, rounded tannins.' },
        { id: 2, name: 'Jacob\'s Creek Merlot', type: 'Red', origin: 'Australia', price: 45, img: 'images/jacobs-creek-merlot.png', desc: 'Juicy berry fruit with a hint of spice and an easy finish.' },
        { id: 3, name: 'Claro Sauvignon Blanc', type: 'White', origin: 'Chile', price: 49, img: 'images/claro-sauvignon-blanc.png', desc: 'Fresh and zesty with crisp citrus and green apple notes.' },
        { id: 4, name: 'B-Qā de Marsyas', type: 'White', origin: 'Bekaa Valley, Lebanon', price: 95, img: 'images/bqa-de-marsyas.png', desc: 'An elegant white from the Bekaa Valley, light and aromatic.' },
        { id: 5, name: 'Stella Rosa Strawberry Rosé', type: 'Rosé', origin: 'Italy', price: 69, img: 'images/stella-rosa-strawberry-rose.png', desc: 'Semi-sweet and lightly fruity with ripe strawberry flavour.' },
        { id: 6, name: 'Sacred Hill Rosé', type: 'Rosé', origin: 'Australia', price: 52, img: 'images/sacred-hill-rose.png', desc: 'Dry and refreshing with red berries and a clean finish.' },
        { id: 7, name: 'Oyster Bay Sparkling Rosé', type: 'Sparkling', origin: 'New Zealand', price: 89, img: 'images/oyster-bay-sparkling-rose.png', desc: 'Lively bubbles with delicate berry fruit, made for celebrating.' },
        { id: 8, name: 'Nederburg Cuvée Brut', type: 'Sparkling', origin: 'South Africa', price: 65, img: 'images/nederburg-cuvee-brut.png', desc: 'Crisp and dry with fine bubbles and a bright, fresh finish.' }
    ];
    window.AUREVE_PRODUCTS = PRODUCTS;

    var SHIPPING_FREE_OVER = 300, SHIPPING_FEE = 25;

    function money(n) { return 'RM ' + n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    function find(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }

    function photo(p) {
        return '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">';
    }

    /* ---------- Cart (localStorage) ---------- */
    function getCart() {
        try { return JSON.parse(localStorage.getItem('aureveCart')) || []; } catch (e) { return []; }
    }
    function saveCart(c) { localStorage.setItem('aureveCart', JSON.stringify(c)); updateCount(); }
    function cartCount() { return getCart().reduce(function (t, i) { return t + i.qty; }, 0); }

    function addToCart(id) {
        var cart = getCart();
        var item = cart.filter(function (i) { return i.id === id; })[0];
        if (item) { item.qty++; } else { cart.push({ id: id, qty: 1 }); }
        saveCart(cart);
        toast(find(id).name + ' added to cart');
    }
    function setQty(id, qty) {
        var cart = getCart();
        cart.forEach(function (i) { if (i.id === id) i.qty = qty; });
        saveCart(cart.filter(function (i) { return i.qty > 0; }));
    }
    function removeItem(id) { saveCart(getCart().filter(function (i) { return i.id !== id; })); }

    function updateCount() {
        var el = document.getElementById('cartCount');
        if (el) el.textContent = cartCount();
    }

    /* ---------- Toast ---------- */
    var toastTimer;
    function toast(msg) {
        var t = document.getElementById('toast');
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
    }

    /* ---------- Header / footer ---------- */
    var page = document.body.getAttribute('data-page');
    function link(href, label, key) {
        return '<li><a href="' + href + '"' + (page === key ? ' class="active"' : '') + '>' + label + '</a></li>';
    }
    document.body.insertAdjacentHTML('afterbegin',
        '<header class="site-header"><nav class="nav">' +
        '<a class="brand" href="index.html"><img src="website-icon.png" alt="">AUREVÉ</a>' +
        '<button class="menu-btn" id="menuBtn" aria-label="Toggle menu">&#9776;</button>' +
        '<ul class="nav-links" id="navLinks">' +
        link('index.html', 'Home', 'home') + link('shop.html', 'Shop', 'shop') +
        link('about.html', 'Our Story', 'about') +
        '<li><a class="cart-link' + (page === 'cart' ? ' active' : '') + '" href="cart.html">Cart<span class="cart-count" id="cartCount">0</span></a></li>' +
        '<li><a href="#" id="logout">Sign out</a></li>' +
        '</ul></nav></header>');
    document.body.insertAdjacentHTML('beforeend',
        '<footer class="site-footer"><p><a href="index.html">Home</a><a href="shop.html">Shop</a><a href="about.html">Our Story</a></p>' +
        '<p>&copy; 2026 AUREVÉ. Please enjoy responsibly. Not for sale to persons under 21.</p></footer>' +
        '<div class="toast" id="toast" role="status" aria-live="polite"></div>');

    document.getElementById('menuBtn').addEventListener('click', function () {
        document.getElementById('navLinks').classList.toggle('open');
    });
    document.getElementById('logout').addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('aureveUser');
        window.location.href = 'login.html';
    });
    updateCount();

    /* ---------- Product cards ---------- */
    function card(p) {
        return '<article class="product"><div class="thumb">' + photo(p) + '</div>' +
            '<div class="info"><span class="type">' + p.type + ' &middot; ' + p.origin + '</span>' +
            '<h3>' + p.name + '</h3><p class="desc">' + p.desc + '</p>' +
            '<div class="buy"><span class="price">' + money(p.price) + '</span>' +
            '<button class="btn btn-sm" data-add="' + p.id + '">Add to Cart</button></div></div></article>';
    }
    document.addEventListener('click', function (e) {
        var id = e.target.getAttribute && e.target.getAttribute('data-add');
        if (id) addToCart(Number(id));
    });

    /* ---------- Home: featured ---------- */
    var featured = document.getElementById('featured');
    if (featured) {
        var welcome = document.getElementById('welcomeName');
        if (welcome) welcome.textContent = user;
        featured.innerHTML = [1, 4, 8].map(function (id) { return card(find(id)); }).join('');
    }

    /* ---------- Shop: filter + sort ---------- */
    var shopGrid = document.getElementById('shopGrid');
    if (shopGrid) {
        var filter = 'All';
        var renderShop = function () {
            var list = PRODUCTS.filter(function (p) { return filter === 'All' || p.type === filter; });
            shopGrid.innerHTML = list.map(card).join('');
        };
        document.getElementById('filters').addEventListener('click', function (e) {
            if (!e.target.classList.contains('chip')) return;
            filter = e.target.getAttribute('data-type');
            Array.prototype.forEach.call(document.querySelectorAll('.chip'), function (c) { c.classList.toggle('active', c === e.target); });
            renderShop();
        });
        renderShop();
    }

    /* ---------- Cart page ---------- */
    var cartList = document.getElementById('cartList');
    if (cartList) {
        var renderCart = function () {
            var cart = getCart(), subtotal = 0;
            if (!cart.length) {
                cartList.innerHTML = '<div class="empty"><h3>Your cart is empty</h3><p>Discover wines worth savouring.</p><a class="btn" href="shop.html">Browse the Collection</a></div>';
                document.getElementById('summary').style.display = 'none';
                return;
            }
            document.getElementById('summary').style.display = '';
            cartList.innerHTML = cart.map(function (i) {
                var p = find(i.id), line = p.price * i.qty;
                subtotal += line;
                return '<div class="cart-item"><div class="mini">' + photo(p) + '</div>' +
                    '<div><h3>' + p.name + '</h3><div class="unit">' + p.type + ' &middot; ' + money(p.price) + ' each</div>' +
                    '<div class="qty"><button data-dec="' + p.id + '" aria-label="Decrease quantity">&minus;</button><span>' + i.qty + '</span><button data-inc="' + p.id + '" aria-label="Increase quantity">+</button></div></div>' +
                    '<div class="line-total"><strong>' + money(line) + '</strong><br><button class="remove" data-remove="' + p.id + '">Remove</button></div></div>';
            }).join('');
            var shipping = subtotal >= SHIPPING_FREE_OVER ? 0 : SHIPPING_FEE;
            document.getElementById('sub').textContent = money(subtotal);
            document.getElementById('ship').textContent = shipping ? money(shipping) : 'Free';
            document.getElementById('total').textContent = money(subtotal + shipping);
            document.getElementById('shipNote').textContent = shipping ? 'Free shipping on orders over ' + money(SHIPPING_FREE_OVER) + '.' : 'You qualify for complimentary shipping.';
        };
        cartList.addEventListener('click', function (e) {
            var t = e.target, cart = getCart(), id;
            if ((id = t.getAttribute('data-inc'))) { id = Number(id); setQty(id, cart.filter(function (i) { return i.id === id; })[0].qty + 1); }
            else if ((id = t.getAttribute('data-dec'))) { id = Number(id); setQty(id, cart.filter(function (i) { return i.id === id; })[0].qty - 1); }
            else if ((id = t.getAttribute('data-remove'))) { removeItem(Number(id)); }
            else return;
            renderCart();
        });
        document.getElementById('checkout').addEventListener('click', function () {
            saveCart([]);
            renderCart();
            cartList.innerHTML = '<div class="empty"><h3>Thank you for your order</h3><p>Your wines are being prepared with care.</p><a class="btn" href="shop.html">Continue Shopping</a></div>';
        });
        renderCart();
    }
})();
