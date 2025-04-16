const cartList = document.getElementById("cart-list");
const emptyCart = document.getElementById("empty-cart");

// Загружаем пиццы и отображаем содержимое корзины
async function loadCart() {
  const res = await fetch("pizzas.json");
  const pizzas = await res.json();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartList.style.display = "none";
    emptyCart.style.display = "block";
    return;
  }

  emptyCart.style.display = "none";
  cartList.style.display = "grid";

  cartList.innerHTML = "";

  cart.forEach((id) => {
    const pizza = pizzas.find((p) => p.id == id);
    if (pizza) {
      const card = document.createElement("div");
      card.className = "pizza-card";
      card.innerHTML = `
        <img src="${pizza.image}" alt="${pizza.name}">
        <h3>${pizza.name}</h3>
        <p>${pizza.description}</p>
        <span>${pizza.price} сум</span>
        <button class="remove-from-cart" data-id="${pizza.id}">Удалить</button>
      `;
      cartList.appendChild(card);
    }
  });

  // Удаление из корзины
  document.querySelectorAll(".remove-from-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter((itemId) => itemId != id);
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    });
  });
}

loadCart();
