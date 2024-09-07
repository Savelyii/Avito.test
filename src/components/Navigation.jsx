import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/ads">Все объявления</Link>
        </li>
        <li>
          <Link to="/orders">Заказы</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
