const pizzaList = document.getElementById("pizza-list");
const filterButtons = document.querySelectorAll(".filters button");
const cartCount = document.getElementById("cart-count");
const themeToggle = document.getElementById("theme-toggle");
const sortSelect = document.getElementById("sortSelect");

let allPizzas = []; 
let currentCategory = "Все";

// Загружаем пиццы
async function loadPizzas() {
  const res = await fetch("pizzas.json");
  const pizzas = await res.json();
  allPizzas = pizzas;
  renderFilteredAndSorted();
  setupFilters();
}

function renderFilteredAndSorted() {
  let filtered = [...allPizzas];

  // Фильтрация по категории
  if (currentCategory !== "Все") {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  // Сортировка
  const value = sortSelect.value;
  if (value === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (value === "price") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (value === "popularity") {
    filtered.sort((a, b) => b.popularity - a.popularity);
  }

  renderPizzas(filtered);
}

// Отрисовка карточек
function renderPizzas(pizzas) {
  pizzaList.innerHTML = "";
  if (pizzas.length === 0) {
    pizzaList.innerHTML = "<p>Нет пицц для отображения</p>";
    return;
  }
  pizzas.forEach(pizza => {
    const card = document.createElement("div");
    card.className = "pizza-card";
    card.innerHTML = `
      <img src="${pizza.image}" alt="${pizza.name}">
      <h3>${pizza.name}</h3>
      <p>${pizza.description}</p>
      <span>${pizza.price} сум</span>
      <button data-id="${pizza.id}">Добавить в корзину</button>
    `;
    card.querySelector("button").addEventListener("click", () => addToCart(pizza.id));
    pizzaList.appendChild(card);
  });
}

// Фильтры
function setupFilters() {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".filters .active")?.classList.remove("active");
      btn.classList.add("active");
      currentCategory = btn.textContent;
      renderFilteredAndSorted();
    });
  });
}

// Сортировка
sortSelect.addEventListener("change", () => {
  renderFilteredAndSorted();
});

// Корзина
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Пицца добавлена в корзину!");
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartCount.textContent = cart.length;
}

// Тема
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }
}

themeToggle.addEventListener("click", toggleTheme);
loadTheme();
updateCartCount();
loadPizzas();
