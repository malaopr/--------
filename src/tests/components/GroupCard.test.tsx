import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupCard from '../../components/GroupCard';

describe('GroupCard', () => {
  it('отображает название группы', () => {
    render(<GroupCard name="IT Клуб" description="Разработка и код" membersCount={45} />);
    expect(screen.getByText('IT Клуб')).toBeInTheDocument();
  });

  it('отображает описание группы', () => {
    render(<GroupCard name="IT Клуб" description="Разработка и код" membersCount={45} />);
    expect(screen.getByText('Разработка и код')).toBeInTheDocument();
  });

  it('отображает количество участников', () => {
    render(<GroupCard name="IT Клуб" description="Разработка" membersCount={45} />);
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('содержит кнопку "Вступить"', () => {
    render(<GroupCard name="IT Клуб" description="Разработка" membersCount={45} />);
    expect(screen.getByRole('button', { name: /вступить/i })).toBeInTheDocument();
  });

  it('кнопка "Вступить" кликабельна', async () => {
    const user = userEvent.setup();
    render(<GroupCard name="IT Клуб" description="Разработка" membersCount={45} />);
    const button = screen.getByRole('button', { name: /вступить/i });
    await user.click(button);
   
    expect(button).toBeInTheDocument();
  });

  it('использует дефолтные значения при отсутствии пропсов', () => {
    render(<GroupCard />);
    expect(screen.getByText('IT Club')).toBeInTheDocument();
  });
});
