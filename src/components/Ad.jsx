import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const Ad = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [editMode, setEditMode] = useState(false); // Режим редактирования

  useEffect(() => {
    fetch(`http://localhost:3000/advertisements/${id}`)
      .then((response) => response.json())
      .then((data) => setAd(data))
      .catch((error) => console.error('Ошибка загрузки объявления:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAd({ ...ad, [name]: value });
  };

  const handleSubmit = () => {
    fetch(`http://localhost:3000/advertisements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ad),
    })
      .then((response) => response.json())
      .then((data) => {
        setAd(data);
        setEditMode(false);
      })
      .catch((error) => console.error('Ошибка обновления объявления:', error));
  };

  if (!ad) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container">
      {editMode ? (
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Название</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={ad.name}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={ad.description || ''}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>Цена</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={ad.price}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="imageUrl">
            <Form.Label>URL изображения</Form.Label>
            <Form.Control
              type="text"
              name="imageUrl"
              value={ad.imageUrl || ''}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleSubmit}>
            Сохранить
          </Button>
        </Form>
      ) : (
        <div>
          {ad.imageUrl && (
            <img src={ad.imageUrl} alt={ad.name} className="img-fluid mb-3" />
          )}
          <h1>{ad.name}</h1>
          <p>{ad.description}</p>
          <p>Цена: {ad.price} руб.</p>
          <p>Просмотры: {ad.views}</p>
          <p>Лайки: {ad.likes}</p>
          <p>Создано: {new Date(ad.createdAt).toLocaleDateString()}</p>
          <Button variant="secondary" onClick={() => setEditMode(true)}>
            Редактировать
          </Button>
        </div>
      )}
    </div>
  );
};

export default Ad;
