import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [showItems, setShowItems] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/orders')
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
      })
      .catch((error) => console.error('Ошибка загрузки заказов:', error));
  }, []);

  const filterByStatus = (status) => {
    setStatusFilter(status);
    if (status) {
      setFilteredOrders(
        orders.filter((order) => order.status === Number(status))
      );
    } else {
      setFilteredOrders(orders);
    }
  };

  const sortOrdersByTotal = (order) => {
    setSortOrder(order);
    const sorted = [...filteredOrders].sort((a, b) =>
      order === 'asc' ? a.total - b.total : b.total - a.total
    );
    setFilteredOrders(sorted);
  };

  const completeOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowConfirmModal(true);
  };

  const confirmCompleteOrder = () => {
    fetch(`http://localhost:3000/orders/${selectedOrderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 4 }),
    })
      .then((response) => response.json())
      .then(() => {
        setFilteredOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrderId ? { ...order, status: 4 } : order
          )
        );
        setShowConfirmModal(false);
        setSelectedOrderId(null);
      })
      .catch((error) => console.error('Ошибка завершения заказа:', error));
  };

  return (
    <div className="container mt-4">
      <h1>Все заказы</h1>
      <div className="row mb-3">
        <div className="col-md-6">
          <Form.Group controlId="statusFilter">
            <Form.Label>Фильтр по статусу</Form.Label>
            <Form.Control
              as="select"
              value={statusFilter}
              onChange={(e) => filterByStatus(e.target.value)}
            >
              <option value="">Все</option>
              <option value="0">Новый</option>
              <option value="1">В обработке</option>
              <option value="2">Отправлен</option>
              <option value="3">Доставлен</option>
              <option value="4">Завершен</option>
            </Form.Control>
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group controlId="sortOrder">
            <Form.Label>Сортировка по сумме</Form.Label>
            <Form.Control
              as="select"
              value={sortOrder}
              onChange={(e) => sortOrdersByTotal(e.target.value)}
            >
              <option value="">Без сортировки</option>
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </Form.Control>
          </Form.Group>
        </div>
      </div>

      <div className="row">
        {filteredOrders.map((order) => (
          <div key={order.id} className="col-md-3 mb-4">
            <Card className="h-100">
              <Card.Body className="text-center">
                <Card.Title>
                  Заказ №{order.id} <br /> Статус: {getStatusText(order.status)}
                </Card.Title>
                <Card.Text>
                  Дата создания заказа:{' '}
                  {new Date(order.createdAt).toLocaleString()}
                </Card.Text>
                <Button variant="primary" onClick={() => setShowItems(order)}>
                  Показать все товары
                </Button>
              </Card.Body>
              <Card.Footer className="text-center">
                <small className="text-muted">
                  Общая цена: {order.total} руб. <br />
                  Количество товаров: {order.items.length} шт.
                </small>
                <Button
                  variant="success"
                  className="mt-2"
                  onClick={() => completeOrder(order.id)}
                  disabled={order.status === 4}
                >
                  Завершить заказ
                </Button>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={!!showItems} onHide={() => setShowItems(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Товары заказа №{showItems?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showItems?.items.map((item) => (
            <div key={item.id}>
              <p>
                {item.name} - {item.count} шт.&nbsp;
                <Link to={`/ad/${item.id}`}>Перейти к товару</Link>
              </p>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowItems(null)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение завершения заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы уверены, что хотите завершить этот заказ?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Отмена
          </Button>
          <Button variant="success" onClick={confirmCompleteOrder}>
            Завершить заказ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const getStatusText = (status) => {
  const statuses = {
    0: 'Новый',
    1: 'В обработке',
    2: 'Отправлен',
    3: 'Доставлен',
    4: 'Завершен',
  };
  return statuses[status] || 'Неизвестен';
};

export default Orders;
