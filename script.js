// API Configuration
const apiUrl = "https://dummyjson.com/products";

// DOM Elements
const grid = document.getElementById("productGrid");
const filter = document.getElementById("categoryFilter");
const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");

// Global Variables
let allProducts = [];

// Modal Functions
function openModal(product) {
  modalImage.src = product.thumbnail;
  modalTitle.textContent = product.title;
  modalPrice.textContent = "$" + product.price.toLocaleString();
  modalDescription.textContent = product.description;
  modal.classList.remove("hidden");
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = 'auto';
}

// Product Rendering
function renderProducts(products) {
  grid.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "bg-white cursor-pointer border border-black";
    card.innerHTML = `
      <div class="relative overflow-hidden">
        <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-64 object-cover" />
      </div>
      <div class="p-4">
        <h3 class="font-playfair text-base font-medium mb-2 leading-tight line-clamp-2">${product.title}</h3>
        <p class="text-black font-inter text-lg font-medium">$${product.price.toLocaleString()}</p>
        <div class="mt-2 text-xs text-black font-light tracking-wider uppercase">${product.category}</div>
      </div>
    `;
    card.onclick = () => openModal(product);
    grid.appendChild(card);
  });
}

// Category Management
function populateCategories(products) {
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    filter.appendChild(option);
  });
}

// Event Listeners
filter.addEventListener("change", () => {
  const selected = filter.value;
  const filtered = selected === "all" ? allProducts : allProducts.filter(p => p.category === selected);
  renderProducts(filtered);
});

// Close modal on backdrop click
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Data Fetching
async function fetchProducts() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    allProducts = data.products;
    populateCategories(allProducts);
    renderProducts(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
}); 