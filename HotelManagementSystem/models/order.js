// 주문 목록을 저장하는 배열
const orderList = [];

// 주문의 총 금액을 저장하는 변수
let totalAmount = 0;

// 주문 목록에 항목을 추가하는 함수
function addToOrder(item) {
  // 메뉴 항목과 가격을 정의한 객체
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

  // 선택한 항목의 가격을 가져옴
  const price = menuItems[item];

  // 주문 목록에 이미 있는지 확인
  const existingItem = orderList.find((order) => order.item === item);

  if (price && !existingItem) {
    // 주문 목록에 항목 추가
    orderList.push({ item, price, quantity: 1 });
    // 총 금액 업데이트
    totalAmount += price;

    // 화면에 표시된 주문 목록 업데이트
    updateOrderList();
  } else if (existingItem) {
    console.warn(`${item}은(는) 이미 주문 목록에 있습니다.`);
  } else {
    console.error("유효하지 않은 메뉴 항목입니다.");
  }
}

// 화면에 표시된 주문 목록을 업데이트하는 함수
function updateOrderList() {
  // 주문 목록과 총 금액을 표시하는 HTML 요소 가져오기
  const orderListElement = document.getElementById("order-list");
  const totalElement = document.getElementById("total");

  // 기존 주문 목록 비우기
  orderListElement.innerHTML = "";

  // 주문 목록의 각 항목에 대해 반복
  orderList.forEach((order) => {
    // 주문 항목을 나타내는 리스트 아이템 생성
    const listItem = document.createElement("li");
    listItem.textContent = `${order.item} - ${order.price}원`;

    // 수량 증가, 감소 및 삭제 버튼 추가
    const quantity = order.quantity || 1;
    listItem.innerHTML += `
      <button class="quantity-btn" onclick="increaseQuantity('${order.item}')">+</button>
      <span class="quantity">${quantity}</span>
      <button class="quantity-btn" onclick="decreaseQuantity('${order.item}')">-</button>
      <button class="delete-btn" onclick="removeItem('${order.item}')">삭제</button>
    `;

    // 리스트 아이템을 주문 목록에 추가
    orderListElement.appendChild(listItem);
  });

  // 총 금액 표시
  totalElement.textContent = `총 가격: ${totalAmount}원`;
}

// 주문 목록의 항목 수량을 증가시키는 함수
function increaseQuantity(item) {
  const orderItem = orderList.find((order) => order.item === item);
  if (orderItem) {
    orderItem.quantity = (orderItem.quantity || 1) + 1;
    totalAmount += orderItem.price;
    updateOrderList();
  }
}

// 주문 목록의 항목 수량을 감소시키는 함수
function decreaseQuantity(item) {
  const orderItem = orderList.find((order) => order.item === item);
  if (orderItem && orderItem.quantity > 1) {
    orderItem.quantity -= 1;
    totalAmount -= orderItem.price;
    updateOrderList();
  }
}

// 주문 목록에서 항목을 제거하는 함수
function removeItem(item) {
  const orderItemIndex = orderList.findIndex((order) => order.item === item);
  if (orderItemIndex !== -1) {
    // 제거된 항목의 가격을 총 금액에서 빼기
    totalAmount -=
      orderList[orderItemIndex].price *
      (orderList[orderItemIndex].quantity || 1);
    // 주문 목록에서 항목 제거
    orderList.splice(orderItemIndex, 1);
    // 화면에 표시된 주문 목록 업데이트
    updateOrderList();
  }
}

// 주문을 완료하는 함수
async function placeOrder() {
  // 주문 목록이 비어 있는지 확인
  if (orderList.length === 0) {
    alert("메뉴를 선택해주세요!");
    return;
  }

  try {
    // 주문을 위해 서버에 POST 요청 보내기
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

    // 요청이 성공했는지 확인
    if (response.ok) {
      // 주문 목록과 총 금액 초기화
      orderList.length = 0;
      totalAmount = 0;
      // 화면에 표시된 주문 목록 업데이트
      updateOrderList();
      // 성공 메시지 표시
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
