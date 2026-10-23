const products = [
  {id:1,title:"Everyday Wireless Headphones",category:"Electronics",price:1299,original:2999,rating:4.4,reviews:1280,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",bg:"#f4edff"},
  {id:2,title:"Classic Everyday Sneakers",category:"Fashion",price:899,original:1999,rating:4.2,reviews:864,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",bg:"#fff0e9"},
  {id:3,title:"Smartphone with Brilliant Display",category:"Mobiles",price:14999,original:21999,rating:4.5,reviews:2450,image:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=85",bg:"#eaf2ff"},
  {id:4,title:"Minimal Ceramic Table Lamp",category:"Home",price:749,original:1499,rating:4.1,reviews:316,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85",bg:"#fff3e0"},
  {id:5,title:"Daily Care Skin Essentials",category:"Beauty",price:499,original:999,rating:4.3,reviews:672,image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85",bg:"#fff0f5"},
  {id:6,title:"Fresh Harvest Grocery Box",category:"Grocery",price:349,original:499,rating:4.6,reviews:532,image:"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85",bg:"#e9f7e9"},
  {id:7,title:"Portable Bluetooth Speaker",category:"Electronics",price:1099,original:2499,rating:4.3,reviews:932,image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=85",bg:"#e8f5ff"},
  {id:8,title:"Modern Lounge Chair",category:"Home",price:5499,original:8999,rating:4.5,reviews:204,image:"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=700&q=85",bg:"#f4eee8"},
  {id:9,title:"Classic Analog Wrist Watch",category:"Fashion",price:1599,original:3999,rating:4.2,reviews:1443,image:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85",bg:"#f2f0eb"},
  {id:10,title:"Compact Kitchen Blender",category:"Appliances",price:1899,original:3299,rating:4.1,reviews:385,image:"https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=700&q=85",bg:"#eaf3f6"},
  {id:11,title:"Travel Weekender Bag",category:"Travel",price:1299,original:2499,rating:4.4,reviews:721,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",bg:"#f5e9db"},
  {id:12,title:"Soft Cotton Cushion Set",category:"Home",price:599,original:1199,rating:4.0,reviews:268,image:"https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=85",bg:"#f9e9ec"},
  {id:13,title:"Everyday Backpack",category:"Fashion",price:799,original:1599,rating:4.3,reviews:913,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",bg:"#e8edf3"},
  {id:14,title:"Wireless Smart Watch",category:"Electronics",price:1999,original:4999,rating:4.2,reviews:1890,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",bg:"#eaf2ff"},
  {id:15,title:"Playful Building Blocks Set",category:"Beauty",price:399,original:799,rating:4.6,reviews:445,image:"https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=700&q=85",bg:"#fff3d9"}
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const formatINR = value => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
let activeCategory = "All";
let searchTerm = "";
let cart = new Map();
let toastTimer;
let slideIndex = 0;
let slideTimer;

const productGrid = $("#productGrid");
const cartDrawer = $("#cartDrawer");
const overlay = $("#overlay");
const toast = $("#toast");

function discountPercent(product){return Math.round((1-product.price/product.original)*100)}
function filteredProducts(){
  return products.filter(product => {
    const categoryMatch = activeCategory === "All" || product.category === activeCategory;
    const queryMatch = `${product.title} ${product.category}`.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && queryMatch;
  });
}
function renderProducts(){
  const filtered = filteredProducts();
  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-visual" style="--visual-bg:${product.bg}">
        <img src="${product.image}" alt="${product.title}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('image-fallback');this.parentElement.insertAdjacentHTML('beforeend','<span class=&quot;fallback-emoji&quot;>🛍️</span>')">
        <span class="discount-pill">${discountPercent(product)}% OFF</span>
        <button class="wishlist-button" data-wishlist="${product.id}" aria-label="Add ${product.title} to wishlist" aria-pressed="false">♡</button>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-meta"><span class="rating">${product.rating.toFixed(1)} <span>★</span></span><span class="rating-count">(${product.reviews.toLocaleString("en-IN")})</span></div>
        <div class="price-row"><span class="current-price">${formatINR(product.price)}</span><span class="old-price">${formatINR(product.original)}</span><span class="save-percent">${discountPercent(product)}% off</span></div>
        <button class="add-cart-button" data-add="${product.id}">＋ Add to Cart</button>
      </div>
    </article>`).join("");
      // Scroll reveal animation for product cards
  const cards = productGrid.querySelectorAll(".product-card");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    cards.forEach((card, index) => {
      card.classList.add("reveal-ready");
      card.style.animationDelay = `${(index % 5) * 65}ms`;
      observer.observe(card);
    });
  } else {
    cards.forEach((card) => {
      card.classList.add("reveal-ready", "is-visible");
    });
  }
  $("#emptyState").hidden = filtered.length !== 0;
  productGrid.hidden = filtered.length === 0;
  $("#resultsSummary").textContent = searchTerm ? `${filtered.length} result${filtered.length===1?"":"s"} for “${searchTerm}”` : `${filtered.length} handpicked finds at feel-good prices.`;
  $("#productsHeading").innerHTML = activeCategory === "All" ? 'Deals of the Day <span class="heading-spark">✦</span>' : `${activeCategory} <span class="heading-spark">✦</span>`;
  $$(".category-item").forEach(button => button.classList.toggle("active",button.dataset.category===activeCategory));
  $$(".filter-chip").forEach(button => button.classList.toggle("active",button.dataset.filter===activeCategory));
}
function setCategory(category){
  activeCategory = category;
  $("#searchInput").value = "";
  searchTerm = "";
  $("#clearSearch").hidden = true;
  renderProducts();
  $("#deals").scrollIntoView({behavior:"smooth",block:"start"});
}
function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"),2400);
}
function addToCart(id){
  const product = products.find(item=>item.id===Number(id));
  if(!product)return;
  const current = cart.get(product.id);
  cart.set(product.id,{product,quantity:(current?.quantity||0)+1});
  renderCart();
  showToast(`${product.title} added to your cart`);
}
function changeQuantity(id,delta){
  const item = cart.get(Number(id));
  if(!item)return;
  item.quantity += delta;
  if(item.quantity<=0)cart.delete(Number(id));
  else cart.set(Number(id),item);
  renderCart();
}
function renderCart(){
  const entries = [...cart.values()];
  const count = entries.reduce((sum,item)=>sum+item.quantity,0);
  const total = entries.reduce((sum,item)=>sum+item.product.price*item.quantity,0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartItems").innerHTML = entries.map(({product,quantity})=>`
    <div class="cart-row">
      <img src="${product.image}" alt="${product.title}" onerror="this.style.visibility='hidden'">
      <div><h3 class="cart-row-title">${product.title}</h3><div class="cart-row-price">${formatINR(product.price)}</div>
        <div class="quantity-control"><button data-quantity="${product.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${quantity}</span><button data-quantity="${product.id}" data-delta="1" aria-label="Increase quantity">+</button></div>
      </div>
      <button class="remove-item" data-remove="${product.id}" aria-label="Remove ${product.title}">Remove</button>
    </div>`).join("");
  $("#cartEmpty").hidden = entries.length > 0;
  $("#cartSummary").hidden = entries.length === 0;
  $("#cartSubtotal").textContent = formatINR(total);
  $("#cartTotal").textContent = formatINR(total);
}
function openCart(){
  overlay.hidden = false;
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
  $("#closeCart").focus();
}
function closeCart(){
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden","true");
  if($("#loginModal").hidden)overlay.hidden = true;
  document.body.classList.remove("modal-open");
}
function openLogin(){
  overlay.hidden = false;
  $("#loginModal").hidden = false;
  document.body.classList.add("modal-open");
  $("#phoneInput").focus();
}
function closeLogin(){
  $("#loginModal").hidden = true;
  if(!cartDrawer.classList.contains("open"))overlay.hidden = true;
  document.body.classList.remove("modal-open");
}
function showSlide(index){
  const slides = $$(".hero-slide");
  slideIndex = (index+slides.length)%slides.length;
  slides.forEach((slide,i)=>slide.classList.toggle("active",i===slideIndex));
  $$(".carousel-dot").forEach((dot,i)=>dot.classList.toggle("active",i===slideIndex));
}
function startSlider(){
  clearInterval(slideTimer);
  slideTimer = setInterval(()=>showSlide(slideIndex+1),5500);
}
function resetSlider(){showSlide(slideIndex+1);startSlider()}

productGrid.addEventListener("click",event=>{
  const add = event.target.closest("[data-add]");
  const wish = event.target.closest("[data-wishlist]");
  if(add)addToCart(add.dataset.add);
  if(wish){
    const liked = wish.classList.toggle("liked");
    wish.textContent = liked ? "♥" : "♡";
    wish.setAttribute("aria-pressed",String(liked));
    showToast(liked ? "Added to your favourites" : "Removed from favourites");
  }
});
$("#cartItems").addEventListener("click",event=>{
  const quantity = event.target.closest("[data-quantity]");
  const remove = event.target.closest("[data-remove]");
  if(quantity)changeQuantity(quantity.dataset.quantity,Number(quantity.dataset.delta));
  if(remove){cart.delete(Number(remove.dataset.remove));renderCart();showToast("Item removed from cart");}
});
$("#searchForm").addEventListener("submit",event=>{
  event.preventDefault();
  searchTerm = $("#searchInput").value.trim();
  activeCategory = "All";
  $("#clearSearch").hidden = !searchTerm;
  renderProducts();
  $("#deals").scrollIntoView({behavior:"smooth",block:"start"});
});
$("#searchInput").addEventListener("input",()=>{
  searchTerm = $("#searchInput").value.trim();
  activeCategory = "All";
  $("#clearSearch").hidden = !searchTerm;
  renderProducts();
});
$("#clearSearch").addEventListener("click",()=>{
  $("#searchInput").value="";searchTerm="";$("#clearSearch").hidden=true;renderProducts();$("#searchInput").focus();
});
$$(".category-item").forEach(button=>button.addEventListener("click",()=>setCategory(button.dataset.category)));
$$(".filter-chip").forEach(button=>button.addEventListener("click",()=>setCategory(button.dataset.filter)));
$$("[data-shop-category]").forEach(button=>button.addEventListener("click",()=>setCategory(button.dataset.shopCategory)));
$("#viewAllButton").addEventListener("click",()=>setCategory("All"));
$("#resetFilters").addEventListener("click",()=>setCategory("All"));
$("#openCart").addEventListener("click",openCart);
$("#closeCart").addEventListener("click",closeCart);
$("#continueShopping").addEventListener("click",closeCart);
$("#openLogin").addEventListener("click",openLogin);
$("#closeLogin").addEventListener("click",closeLogin);
overlay.addEventListener("click",()=>{closeCart();closeLogin()});
$("#moreButton").addEventListener("click",()=>{
  const menu=$("#moreMenu");
  const open=menu.classList.toggle("open");
  $("#moreButton").setAttribute("aria-expanded",String(open));
});
document.addEventListener("click",event=>{
  if(!event.target.closest(".dropdown-wrap")){
    $("#moreMenu").classList.remove("open");
    $("#moreButton").setAttribute("aria-expanded","false");
  }
});
$("#aboutButton").addEventListener("click",()=>showToast("Niraj Tiwari Mart — a front-end demo storefront."));
$("#sellerButton").addEventListener("click",()=>showToast("Seller registration can be connected to your backend later."));
$("#prevSlide").addEventListener("click",()=>{showSlide(slideIndex-1);startSlider()});
$("#nextSlide").addEventListener("click",()=>{resetSlider()});
$("#carouselDots").addEventListener("click",event=>{
  const dot=event.target.closest("[data-slide]");
  if(dot){showSlide(Number(dot.dataset.slide));startSlider();}
});
$("#heroCarousel").addEventListener("mouseenter",()=>clearInterval(slideTimer));
$("#heroCarousel").addEventListener("mouseleave",startSlider);
$("#loginForm").addEventListener("submit",event=>{
  event.preventDefault();
  const phone=$("#phoneInput").value.trim();
  if(!/^[6-9][0-9]{9}$/.test(phone)){
    $("#loginMessage").textContent="Please enter a valid 10-digit Indian mobile number.";
    $("#loginMessage").style.color="#c23b4b";
    return;
  }
  $("#loginMessage").textContent="This is a demo form. Connect an authentication service to send an OTP.";
  $("#loginMessage").style.color="#16834a";
  showToast("Demo only — OTP service is not connected.");
});
$("#checkoutButton").addEventListener("click",()=>showToast("Checkout is a demo. No payment has been taken."));
$("#backToTop").addEventListener("click",event=>{event.preventDefault();window.scrollTo({top:0,behavior:"smooth"})});
document.addEventListener("keydown",event=>{
  if(event.key==="Escape"){closeCart();closeLogin();$("#moreMenu").classList.remove("open");}
});
$("#year").textContent=new Date().getFullYear();
renderProducts();
renderCart();
startSlider();
