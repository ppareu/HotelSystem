let inventoryData = [
  { id: 1, name: '수건', quantity: 50 },
  { id: 2, name: '샴푸', quantity: 30 },
  { id: 3, name: '비누', quantity: 40 }
];

function initialize() {
  displayInventory();
}

function displayInventory() {
  const inventoryList = document.getElementById('inventory-list');
  inventoryList.innerHTML = ''; // 리스트 초기화

  inventoryData.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>
                          <button class="btn-edit" onclick="editItem(${item.id})">수정</button>
                          <button class="btn-delete" onclick="deleteItem(${item.id})">삭제</button>
                      </td>`;
      inventoryList.appendChild(row);
  });
}

function addItem() {
  const itemName = document.getElementById('item-name').value;
  const itemQuantity = parseInt(document.getElementById('item-quantity').value);

  const existingItem = inventoryData.find(item => item.name === itemName);

  if (existingItem) {
      existingItem.quantity += itemQuantity;
  } else {
      const newItem = {
          id: inventoryData.length + 1,
          name: itemName,
          quantity: itemQuantity
      };

      inventoryData.push(newItem);
  }

  displayInventory();
  document.getElementById('add-item-form').reset();
}

function editItem(itemId) {
  const foundItem = inventoryData.find(item => item.id === itemId);

  if (foundItem) {
      const newName = prompt('새로운 물품명을 입력하세요:', foundItem.name);
      const newQuantity = parseInt(prompt('새로운 수량을 입력하세요:', foundItem.quantity));

      if (newName !== null && !isNaN(newQuantity)) {
          foundItem.name = newName;
          foundItem.quantity = newQuantity;
          displayInventory();
      } else {
          alert('입력이 잘못되었습니다. 수정을 취소합니다.');
      }
  }
}

function deleteItem(itemId) {
  const confirmed = confirm('정말로 삭제하시겠습니까?');

  if (confirmed) {
      inventoryData = inventoryData.filter(item => item.id !== itemId);
      displayInventory();
  }
}

window.onload = initialize;
