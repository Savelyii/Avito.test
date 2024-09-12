import gears from '../assets/gears.svg';

export const HomePage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <div
        style={{
          marginTop: '50x',
          marginBottom: '20px',
          textAlign: 'center',
          maxWidth: '80%',
        }}
      >
        <h1>
          Добро пожаловать в Ваш личный кабинет. Скоро здесь появится много
          нового функционала, а пока вы можете воспользоваться кнопками
          навигации в шапке :)
        </h1>
      </div>

      <div>
        <img
          style={{
            width: '400px',
            height: '400px',
          }}
          src={gears}
          alt="Gears"
        />
      </div>
    </div>
  );
};
