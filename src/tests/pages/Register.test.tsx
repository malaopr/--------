import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../pages/Register';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderRegister = () =>
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

describe('Register', () => {
  it('отображает заголовок страницы', () => {
    renderRegister();
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
  });

  it('содержит поле ФИО', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('ФИО')).toBeInTheDocument();
  });

  it('содержит поле email', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Email студента')).toBeInTheDocument();
  });

  it('содержит поле пароля', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
  });

  it('содержит кнопку регистрации', () => {
    renderRegister();
    expect(screen.getByRole('button', { name: /зарегистрироваться/i })).toBeInTheDocument();
  });

  it('содержит ссылку на страницу входа', () => {
    renderRegister();
    expect(screen.getByText('Войти')).toBeInTheDocument();
  });

  it('показывает ошибку при отправке пустой формы', async () => {
    const user = userEvent.setup();
    renderRegister();
    await user.click(screen.getByRole('button', { name: /зарегистрироваться/i }));
    await waitFor(() => {
      expect(screen.getByText('Пожалуйста, введите ваше полное имя')).toBeInTheDocument();
    });
  });

  it('перенаправляет на /login после успешной регистрации', async () => {
    const user = userEvent.setup();
    renderRegister();
    await user.type(screen.getByPlaceholderText('ФИО'), 'Иван Иванов');
    await user.type(screen.getByPlaceholderText('Email студента'), 'ivan@lyceum.ru');
    await user.type(screen.getByPlaceholderText('Пароль'), 'password123');
    await user.click(screen.getByRole('button', { name: /зарегистрироваться/i }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
