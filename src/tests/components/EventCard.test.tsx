import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EventCard from '../../components/EventCard';

describe('EventCard', () => {
  it('отображает заголовок мероприятия', () => {
    render(<EventCard title="Лекция по ИИ" date="21 марта, 18:00" location="Аудитория 101" />);
    expect(screen.getByText('Лекция по ИИ')).toBeInTheDocument();
  });

  it('отображает дату и место', () => {
    render(<EventCard title="Тест" date="22 марта, 12:00" location="Главная площадь" />);
    expect(screen.getByText('22 марта, 12:00')).toBeInTheDocument();
    expect(screen.getByText('Главная площадь')).toBeInTheDocument();
  });

  it('отображает кнопку "Участвовать"', () => {
    render(<EventCard title="Хакатон" date="5 апреля" location="IT Центр" />);
    expect(screen.getByRole('button', { name: /участвовать/i })).toBeInTheDocument();
  });

  it('использует дефолтные значения при отсутствии пропсов', () => {
    render(<EventCard />);
    expect(screen.getByText('Welcome Party 2024')).toBeInTheDocument();
  });

  it('отображает изображение с корректным alt', () => {
    render(<EventCard title="Концерт" date="20 апреля" location="Актовый зал" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Концерт');
  });
});
