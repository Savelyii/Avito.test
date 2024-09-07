import { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/orders')
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Ошибка загрузки заказов:', error));
  }, []);

  return (
    <div>
      <h1>Все заказы</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            Заказ #{order.id}
            {order.items.map((product) => (
              <div key={product.id}>
                <b>Название:</b>
                {product.name}
                <b>Цена:</b>
                {product.price}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
