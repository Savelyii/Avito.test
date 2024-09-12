import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Pagination,
  Modal,
} from 'react-bootstrap';

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalAds, setTotalAds] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newAd, setNewAd] = useState({
    imageUrl: '',
    name: '',
    description: '',
    price: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let query = `http://localhost:3000/advertisements?_page=${page}&_per_page=${perPage}`;

    fetch(query)
      .then((response) => response.json())
      .then((data) => {
        setTotalAds(data.items);
        setAds(data.data || []);
        setFilteredAds(data.data || []);
      })
      .catch((error) => console.error('Ошибка загрузки объявлений:', error));
  }, [page, perPage]);

  useEffect(() => {
    if (search) {
      const filtered = ads.filter((ad) =>
        ad.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredAds(filtered);
    } else {
      setFilteredAds(ads);
    }
  }, [search, ads]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleCreateAd = () => {
    if (!newAd.imageUrl || !newAd.name || !newAd.description || !newAd.price) {
      setErrorMessage('Пожалуйста, заполните все поля');
      return;
    }

    fetch('http://localhost:3000/advertisements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newAd,
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setAds((prevAds) => [...prevAds, data]);
        setShowModal(false);
        setNewAd({ imageUrl: '', name: '', description: '', price: '' });
        setErrorMessage('');
      })
      .catch((error) => console.error('Ошибка создания объявления:', error));
  };

  const totalPages = Math.ceil(totalAds / perPage);

  return (
    <div className="container">
      <h1 className="my-4 text-center">Все объявления</h1>

      <Form className="mb-3">
        <Form.Group controlId="search">
          <Form.Label>Поиск по названию</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите название"
            value={search}
            onChange={handleSearch}
          />
        </Form.Group>
      </Form>

      <Form.Group controlId="perPageSelect" className="mb-3">
        <Form.Label>Количество объявлений на странице:</Form.Label>
        <Form.Control
          as="select"
          value={perPage}
          onChange={handlePerPageChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Form.Control>
      </Form.Group>

      <Button
        variant="success"
        className="mb-4"
        onClick={() => setShowModal(true)}
      >
        Создать новое объявление
      </Button>

      <Row>
        {filteredAds.length > 0 ? (
          filteredAds.map((ad) => (
            <Col key={ad.id} md={4} className="mb-4">
              <Card>
                {ad.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={ad.imageUrl}
                    alt={ad.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'contain',
                    }}
                  />
                )}
                <Card.Body className="text-center">
                  <Card.Title>{ad.name}</Card.Title>
                  <Card.Text>Цена: {ad.price} руб.</Card.Text>
                  <Card.Text>Просмотры: {ad.views}</Card.Text>
                  <Card.Text>Лайки: {ad.likes}</Card.Text>
                  <Link to={`/ad/${ad.id}`}>
                    <Button variant="primary">Подробнее</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>Нет объявлений для отображения</p>
        )}
      </Row>

      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        />
        {Array.from({ length: totalPages }, (_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={idx + 1 === page}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        />
      </Pagination>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Создать новое объявление</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="imageUrl">
              <Form.Label>URL изображения</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите ссылку на изображение"
                value={newAd.imageUrl}
                onChange={(e) =>
                  setNewAd({ ...newAd, imageUrl: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="name">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите название"
                value={newAd.name}
                onChange={(e) => setNewAd({ ...newAd, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Введите описание"
                value={newAd.description}
                onChange={(e) =>
                  setNewAd({ ...newAd, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Стоимость (руб.)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Введите стоимость"
                value={newAd.price}
                onChange={(e) => setNewAd({ ...newAd, price: e.target.value })}
              />
            </Form.Group>

            {errorMessage && <p className="text-danger">{errorMessage}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleCreateAd}>
            Создать
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Ads;
