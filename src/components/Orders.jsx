import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

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
          <Card
            key={order.id}
            style={{
              width: '18rem',
              display: 'flex',
              margin: '1rem',
            }}
          >
            <Card.Body>
              <Card.Title>
                Заказ №{order.id} <br /> Статус: {order.status}
              </Card.Title>
              <Card.Text>
                Дата создания заказа:{' '}
                {new Date(order.createdAt).toLocaleString()}
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
            <Card.Footer>
              Общая цена: {order.total} руб. Количество товаров:{' '}
              {order.items.length} шт.
            </Card.Footer>
          </Card>
          //   <li key={order.id}>
          //     Заказ #{order.id}
          //     {order.items.map((product) => (
          //       <div key={product.id}>
          //         <b>Название:</b>
          //         {product.name}
          //         <b>Цена:</b>
          //         {product.price}
          //       </div>
          //     ))}
          //   </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
