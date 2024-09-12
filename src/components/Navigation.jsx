import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navigation = () => {
  return (
    <nav className="d-flex justify-content-around mt-3 mb-3">
      <Button variant="primary" as={Link} to="/" className="mx-2">
        На главную
      </Button>
      <Button variant="primary" as={Link} to="/ads" className="mx-2">
        Все объявления
      </Button>
      <Button variant="primary" as={Link} to="/orders" className="mx-2">
        Заказы
      </Button>
    </nav>
  );
};

export default Navigation;
