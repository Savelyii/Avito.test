import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Ad = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/advertisements/${id}`)
      .then((response) => response.json())
      .then((data) => setAd(data))
      .catch((error) => console.error('Ошибка загрузки объявления:', error));
  }, [id]);

  if (!ad) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>{ad.name}</h1>
      <p>{ad.description}</p>
      <p>Цена: {ad.price} руб.</p>
      <p>Просмотры: {ad.views}</p>
      <p>Лайки: {ad.likes}</p>
      <p>Создано: {new Date(ad.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default Ad;
