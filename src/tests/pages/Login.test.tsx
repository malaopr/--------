import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/Login';


const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe('Login', () => {
  it('отображает заголовок страницы', () => {
    renderLogin();
    expect(screen.getByText('С возвращением')).toBeInTheDocument();
  });

  it('содержит поле email', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Email студента')).toBeInTheDocument();
  });

  it('содержит поле пароля', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
  });

  it('содержит кнопку входа', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
  });

  it('содержит ссылку на регистрацию', () => {
    renderLogin();
    expect(screen.getByText('Создать аккаунт')).toBeInTheDocument();
  });

  it('показывает ошибку при отправке пустой формы', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(screen.getByRole('button', { name: /войти/i }));
    await waitFor(() => {
      expect(screen.getByText('Пожалуйста, введите ваш email')).toBeInTheDocument();
    });
  });

  it('перенаправляет на / после успешного входа', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByPlaceholderText('Email студента'), 'test@lyceum.ru');
    await user.type(screen.getByPlaceholderText('Пароль'), 'password123');
    await user.click(screen.getByRole('button', { name: /войти/i }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
