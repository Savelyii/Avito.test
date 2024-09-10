import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const Ad = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!isValidUrl(ad.imageUrl)) {
      setErrorMessage(
        'Невалидный URL изображения. Пожалуйста, введите правильную ссылку.'
      );
      return;
    }

    fetch(`http://localhost:3000/advertisements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ad),
    })
      .then((response) => response.json())
      .then((data) => {
        setAd(data);
        setEditMode(false);
        setErrorMessage('');
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

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Button variant="primary" onClick={handleSubmit}>
            Сохранить
          </Button>
        </Form>
      ) : (
        <div>
          {ad.imageUrl && (
            <img
              src={ad.imageUrl}
              alt={ad.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'contain',
              }}
            />
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
