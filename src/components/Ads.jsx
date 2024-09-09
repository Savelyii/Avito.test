import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Pagination } from 'react-bootstrap';

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalAds, setTotalAds] = useState(ads.length);

  useEffect(() => {
    let query = `http://localhost:3000/advertisements?_page=${page}&_limit=${limit}`;

    if (search) {
      query += `&name=${encodeURIComponent(search)}`;
    }

    fetch(query)
      .then((response) => {
        setTotalAds(Number(response.headers.get('X-Total-Count')));
        return response.json();
      })
      .then((data) => setAds(data))
      .catch((error) => console.error('Ошибка загрузки объявлений:', error));
  }, [page, limit, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const totalPages = Math.ceil(totalAds / limit);
  console.log('totalPages: ', totalPages);

  return (
    <div className="container">
      <h1 className="my-4">Все объявления</h1>

      <Form className="mb-3">
        <Form.Group controlId="search">
          <Form.Label>Поиск по точному названию</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите точное название"
            value={search}
            onChange={handleSearch}
          />
        </Form.Group>
      </Form>

      <Form.Group controlId="limitSelect" className="mb-3">
        <Form.Label>Количество объявлений на странице:</Form.Label>
        <Form.Control as="select" value={limit} onChange={handleLimitChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Form.Control>
      </Form.Group>

      <Row>
        {ads.map((ad) => (
          <Col key={ad.id} md={4} className="mb-4">
            <Card>
              {ad.imageUrl && (
                <Card.Img variant="top" src={ad.imageUrl} alt={ad.name} />
              )}
              <Card.Body>
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
        ))}
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
    </div>
  );
};

export default Ads;
