const orderList = [];
let totalAmount = 0;

function addToOrder(item) {
  const menuItems = {
    햄버거: 5000,
    피자: 8000,
    파스타: 10000,
    라면: 4000,
    짜장면: 2000,
    떡볶이: 2000,
    소떡소떡: 3000,
    콜라: 2000,
    사이다: 2000,
  };

  const price = menuItems[item];

  const existingItem = orderList.find((order) => order.item === item);

  if (price && !existingItem) {
    orderList.push({ item, price, quantity: 1 });
    totalAmount += price;

    updateOrderList();
  } else if (existingItem) {
    console.warn(`${item} is already in the order list.`);
  } else {
    console.error("메뉴 항목이 잘못되었습니다.");
  }
}

function updateOrderList() {
  const orderListElement = document.getElementById("order-list");
  const totalElement = document.getElementById("total");

  orderListElement.innerHTML = "";

  orderList.forEach((order) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${order.item} - ${order.price}원`;

    const quantity = order.quantity || 1;
    listItem.innerHTML += `
      <button class="quantity-btn" onclick="increaseQuantity('${order.item}')">+</button>
      <span class="quantity">${quantity}</span>
      <button class="quantity-btn" onclick="decreaseQuantity('${order.item}')">-</button>
      <button class="delete-btn" onclick="removeItem('${order.item}')">삭제</button>
    `;

    orderListElement.appendChild(listItem);
  });

  totalElement.textContent = `총 가격 : ${totalAmount}원`;
}

function increaseQuantity(item) {
  const orderItem = orderList.find((order) => order.item === item);
  if (orderItem) {
    orderItem.quantity = (orderItem.quantity || 1) + 1;
    totalAmount += orderItem.price;
    updateOrderList();
  }
}

function decreaseQuantity(item) {
  const orderItem = orderList.find((order) => order.item === item);
  if (orderItem && orderItem.quantity > 1) {
    orderItem.quantity -= 1;
    totalAmount -= orderItem.price;
    updateOrderList();
  }
}

function removeItem(item) {
  const orderItemIndex = orderList.findIndex((order) => order.item === item);
  if (orderItemIndex !== -1) {
    totalAmount -=
      orderList[orderItemIndex].price *
      (orderList[orderItemIndex].quantity || 1);
    orderList.splice(orderItemIndex, 1);
    updateOrderList();
  }
}

async function placeOrder() {
  if (orderList.length === 0) {
    alert("메뉴를 선택해주세요!");
    return;
  }

  try {
    const response = await fetch("/placeOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderList: orderList.map((orderItem) => ({
          item: orderItem.item,
          quantity: orderItem.quantity || 1,
          price: orderItem.price,
        })),
      }),
    });

    if (response.ok) {
      orderList.length = 0;
      totalAmount = 0;
      updateOrderList();
      alert("주문 완료! 잠시만 기다려주세요!");
    } else {
      console.error("주문 실패");
      alert("주문 실패. 다시 시도하세요.");
    }
  } catch (error) {
    console.error("에러 발생:", error);
    alert("주문 중에 에러가 발생했습니다. 다시 시도하세요.");
  }
}
