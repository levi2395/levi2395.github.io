const searchInput = document.getElementById('searchInput');
const productList = document.querySelector('.product-list');

// Hàm hiển thị sản phẩm và gắn 1 nút thêm
function renderProducts(products) {
  productList.innerHTML = ''; // clear sản phẩm cũ

  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="images/${product.image}" alt="${product.name}" />
      <h4 class="product-title">${product.name}</h4>
      <p class="price">${parseInt(product.price).toLocaleString()}đ</p>
      <button class="btn-add">Thêm vào giỏ</button>
    `;
    productList.appendChild(div);
  });
}

// Gắn sự kiện chỉ 1 lần, xử lý bằng event delegation
productList.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-add")) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      alert("Bạn cần đăng nhập để mua hàng.");
      window.location.href = "login.html";
      return;
    }

    const productCard = e.target.closest(".product-card");
    const title = productCard.querySelector(".product-title").textContent;
    const price = productCard.querySelector(".price").textContent;
    const img = productCard.querySelector("img").src;

    const product = { title, price, img };
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Đã thêm vào giỏ hàng!");
  }
});

// Xử lý tìm kiếm và gọi render
searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.trim();

  fetch(`../backend/get-products.php?search=${encodeURIComponent(keyword)}`)
    .then(response => response.json())
    .then(products => {
      renderProducts(products); // chỉ render, không gắn lại sự kiện
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // === Logic cho chức năng lọc sản phẩm theo danh mục ===
    const categoryButtons = document.querySelectorAll('.category-item'); // Chọn các nút danh mục
    const productCards = document.querySelectorAll('.product-card'); // Chọn tất cả thẻ sản phẩm

    function filterProducts(category) {
        productCards.forEach(card => {
            const productCategory = card.dataset.category; // Lấy category từ data-category của sản phẩm
            if (category === 'all' || productCategory === category) {
                card.style.display = 'block'; // Hiển thị sản phẩm
            } else {
                card.style.display = 'none'; // Ẩn sản phẩm
            }
        });
    }

    // Gắn sự kiện click cho từng nút danh mục
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Xóa class 'active' khỏi tất cả các nút
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Thêm class 'active' cho nút được click
            this.classList.add('active');

            const selectedCategory = this.dataset.category; // Lấy category từ data-category của nút
            filterProducts(selectedCategory); // Gọi hàm lọc sản phẩm
        });
    });

    // Mặc định hiển thị tất cả sản phẩm khi tải trang lần đầu
    filterProducts('all');


    // === Logic cho chức năng tìm kiếm sản phẩm ===
    const searchInput = document.getElementById('searchInput');
    // const productItems = document.querySelectorAll('.product-item'); // Lưu ý: `.product-item` trong HTML của bạn hiện tại là div trong khung tìm kiếm, không phải sản phẩm chính
    // Chúng ta sẽ dùng lại `productCards` đã định nghĩa ở trên để tìm kiếm trên các sản phẩm thật.

    searchInput.addEventListener('input', function () {
        const keyword = this.value.toLowerCase().trim();

        productCards.forEach(card => { // Lặp qua các product-card (sản phẩm chính)
            const title = card.querySelector('.product-title').textContent.toLowerCase();

            // Hiển thị nếu từ khóa khớp HOẶC nếu từ khóa rỗng (hiện tất cả sản phẩm)
            if (title.includes(keyword)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Cần đảm bảo rằng khi tìm kiếm, các nút danh mục không ảnh hưởng.
        // Hoặc là việc tìm kiếm sẽ ghi đè lên lọc, hoặc bạn cần kết hợp cả hai.
        // Để đơn giản, hiện tại tìm kiếm sẽ lọc trên các sản phẩm đang hiển thị (hoặc tất cả nếu chưa lọc).
        // Nếu muốn tìm kiếm luôn trên TẤT CẢ sản phẩm, bạn có thể gọi filterProducts('all') trước khi tìm kiếm
        // và sau đó mới lọc theo keyword. Nhưng cách hiện tại cũng ổn.
    });


    // === Logic cho chức năng thêm vào giỏ hàng ===
    document.querySelectorAll(".btn-add").forEach((button) => {
        button.addEventListener("click", () => {
            const productCard = button.closest(".product-card");
            const title = productCard.querySelector(".product-title").innerText;
            const priceText = productCard.querySelector(".price").innerText;
            const image = productCard.querySelector("img").getAttribute("src");

            const price = parseInt(priceText.replace(/[^\d]/g, ""));
            const newProduct = {
                title,
                price,
                image,
                quantity: 1
            };

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            const existing = cart.find(p => p.title === title);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push(newProduct);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert("✅ Đã thêm vào giỏ!");
        });
    });

    // === Logic cho chức năng giỏ hàng (nếu bạn muốn hiển thị giỏ hàng trên trang index) ===
    // (Thường thì phần này sẽ nằm trong file cart.html)
    // Nếu bạn muốn hiển thị một giỏ hàng nhỏ gọn trên trang chủ, bạn cần có các phần tử HTML tương ứng
    // Ví dụ: một div để hiển thị số lượng sản phẩm trong giỏ.
    // Dưới đây là các hàm render/remove/thanhToan, thường dành cho trang cart.html
    // Bạn nên bỏ phần này ra khỏi script.js nếu chỉ dùng cho cart.html

    // function formatCurrency(num) {
    //     return num.toLocaleString('vi-VN') + 'đ';
    // }

    // function renderCart() { /* ... */ } // Chỉ nên ở cart.html
    // function removeItem(index) { /* ... */ } // Chỉ nên ở cart.html
    // function thanhToan() { /* ... */ } // Chỉ nên ở cart.html
});
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const addButton = card.querySelector('.btn-add');
        addButton.addEventListener('click', () => {
            // Lấy đường dẫn của trang chi tiết sản phẩm từ thuộc tính data-link
            // Ví dụ: <div class="product-card" data-link="product-detail-dam1.html">
            const productLink = card.getAttribute('data-link');
            
            if (productLink) {
                window.location.href = productLink;
            } else {
                // Xử lý trường hợp không có liên kết
                alert('Trang chi tiết sản phẩm này hiện chưa có.');
            }
        });
    });
});