// variables y constantes
const cartContainer = document.querySelector('.cart-container');
const productList = document.querySelector('.product-list');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountInfo = document.getElementById('cart-count-info');
let cartItemID = 1;

eventListeners();

//  event listeners
function eventListeners() {
  window.addEventListener('DOMContentLoaded', () => {
    loadJSON();
    loadCart();
  });
  // toggle navbar when toggle button is clicked
  // document.querySelector('.navbar-toggler').addEventListener('click', () => {
  //   document.querySelector('.navbar-collapse').classList.toggle('show-navbar');
  // });

  // mostrar / ocultar contenedor de carrito de compra
  document.getElementById('cart-btn').addEventListener('click', () => {
    cartContainer.classList.toggle('show-cart-container');
  });

  // Agregar al carrito
  productList.addEventListener('click', purchaseProduct);

  // ELiminar del carrito
  cartList.addEventListener('click', deleteProduct);
}

// actualizar la información del carrito
function updateCartInfo() {
  let cartInfo = findCartInfo();
  cartCountInfo.textContent = cartInfo.productCount;
  cartTotalValue.textContent = cartInfo.total;
}

// cargar el contenido de los artículos del producto en un archivo JSON
function loadJSON() {
  fetch('furniture.json')
    .then((response) => response.json())
    .then((data) => {
      let html = '';
      data.forEach((product) => {
        html += `
                <div class = "product-item">
                    <div class = "product-img">
                    <!-- Sale badge-->
                    <div class="parpadea badge bg-danger text-white position-absolute" style="top: 0.5rem; right: 0.5rem">${product.promo}</div>
                    <img src = "${product.imgSrc}" alt = "product image">
                    <button type = "button" class = "add-to-cart-btn">
                        <i class = "fas fa-shopping-cart"></i>Agregar
                    </button>
                    </div>
                    <div class = "product-content"></div>
                    <h3 class = "product-name text-center">${product.name}</h3>

                    <h3 class = "product-name text-center">${product.estrellas}</h3>
                    <span class = "product-category text-center ">${product.category}</span>
                    <p class = "text-muted text-decoration-line-through text-center">${product.oldprice} </p>
                    <p class = "product-price text-center">$${product.price}</p>
                </div>
            `;
      });
      productList.innerHTML = html;
    })
    .catch((error) => {
      alert(`User live server or local server`);
      //El esquema de URL debe ser "http" o "https" para la solicitud CORS. Debe publicar su index.html localmente o tener su sitio alojado en un servidor en vivo en algún lugar para que la API de Fetch funcione correctamente.
    });
}

// Agregar producto al carrito
function purchaseProduct(e) {
  if (e.target.classList.contains('add-to-cart-btn')) {
    let product = e.target.parentElement.parentElement;
    getProductInfo(product);
  }
}

// Obtener información del producto después de hacer clic en el botón Agregar al carrito
function getProductInfo(product) {
  let productInfo = {
    id: cartItemID,
    imgSrc: product.querySelector('.product-img img').src,
    name: product.querySelector('.product-name').textContent,
    category: product.querySelector('.product-category').textContent,
    price: product.querySelector('.product-price').textContent,
  };
  cartItemID++;
  addToCartList(productInfo);
  saveProductInStorage(productInfo);
}

// agregar el producto seleccionado a la lista del carrito
function addToCartList(product) {
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-item');
  cartItem.setAttribute('data-id', `${product.id}`);
  cartItem.innerHTML = `
        <img src = "${product.imgSrc}" alt = "product image">
        <div class = "cart-item-info">
            <h3 class = "cart-item-name">${product.name}</h3>
            <span class = "cart-item-category">${product.category}</span>
            <span class = "cart-item-price">${product.price}</span>
        </div>

        <button type = "button" class = "cart-item-del-btn">
            <i class = "fas fa-times"></i>
        </button>
    `;
  cartList.appendChild(cartItem);
}

// guardar el producto en el almacenamiento local (local storage)
function saveProductInStorage(item) {
  let products = getProductFromStorage();
  products.push(item);
  localStorage.setItem('products', JSON.stringify(products));
  updateCartInfo();
}

// obtener toda la información de los productos si hay alguna en el almacenamiento local
function getProductFromStorage() {
  return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
  // devuelve una matriz vacía si no hay información del producto
}

// cargar productos del carrito
function loadCart() {
  let products = getProductFromStorage();
  if (products.length < 1) {
    cartItemID = 1; // si no hay ningún producto en el almacenamiento local
  } else {
    cartItemID = products[products.length - 1].id;
    cartItemID++;
    // de lo contrario, obtenga la identificación del último producto y aumente en 1
  }
  products.forEach((product) => addToCartList(product));

  // calcular y actualizar la interfaz de usuario de la información del carrito
  updateCartInfo();
}

// calcular el precio total del carrito y otra información
function findCartInfo() {
  let products = getProductFromStorage();
  let total = products.reduce((acc, product) => {
    let price = parseFloat(product.price.substr(1)); // quitamos el dinero
    return (acc += price);
  }, 0); // sumando todos los precios

  return {
    total: total.toFixed(2),
    productCount: products.length,
  };
}

// eliminar producto de la lista del carrito y del almacenamiento local
function deleteProduct(e) {
  let cartItem;
  if (e.target.tagName === 'BUTTON') {
    cartItem = e.target.parentElement;
    cartItem.remove(); // esto solo elimina del DOM
  } else if (e.target.tagName === 'I') {
    cartItem = e.target.parentElement.parentElement;
    cartItem.remove(); // esto solo elimina del DOM
  }

  let products = getProductFromStorage();
  let updatedProducts = products.filter((product) => {
    return product.id !== parseInt(cartItem.dataset.id);
  });
  localStorage.setItem('products', JSON.stringify(updatedProducts)); // actualizar la lista de productos después de la eliminación
  updateCartInfo();
}
