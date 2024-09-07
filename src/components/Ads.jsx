import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Ads = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/advertisements')
      .then((response) => response.json())
      .then((data) => setAds(data))
      .catch((error) => console.error('Ошибка загрузки объявлений:', error));
  }, []);

  return (
    <div>
      <h1>Все объявления</h1>
      <ul>
        {ads.map((ad) => (
          <li key={ad.id}>
            <Link to={`/ad/${ad.id}`}>{ad.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ads;
