import { describe, it, expect } from 'vitest';
import { mockApi, MOCK_POSTS, MOCK_EVENTS, MOCK_GROUPS, MOCK_USERS } from '../../mocks/data';

describe('mockApi', () => {
  describe('getFeed', () => {
    it('возвращает публикации первой страницы', async () => {
      const result = await mockApi.getFeed(1, 3);
      expect(result.data).toHaveLength(3);
      expect(result.page).toBe(1);
      expect(result.total).toBe(MOCK_POSTS.length);
    });

    it('возвращает корректное общее количество страниц', async () => {
      const result = await mockApi.getFeed(1, 3);
      expect(result.total_pages).toBe(Math.ceil(MOCK_POSTS.length / 3));
    });

    it('возвращает вторую страницу публикаций', async () => {
      const page1 = await mockApi.getFeed(1, 3);
      const page2 = await mockApi.getFeed(2, 3);
      expect(page2.data[0].id).not.toBe(page1.data[0].id);
    });
  });

  describe('getEvents', () => {
    it('возвращает список мероприятий', async () => {
      const result = await mockApi.getEvents(1, 10);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.total).toBe(MOCK_EVENTS.length);
    });
  });

  describe('getGroups', () => {
    it('возвращает все группы без фильтра', async () => {
      const result = await mockApi.getGroups(1, 10);
      expect(result.total).toBe(MOCK_GROUPS.length);
    });

    it('фильтрует группы по названию', async () => {
      const result = await mockApi.getGroups(1, 10, 'IT');
      expect(result.data.every((g) => g.name.toLowerCase().includes('it'))).toBe(true);
    });

    it('возвращает пустой результат при несуществующем поиске', async () => {
      const result = await mockApi.getGroups(1, 10, 'xyznotexist123');
      expect(result.data).toHaveLength(0);
    });
  });

  describe('getUsers', () => {
    it('возвращает всех пользователей', async () => {
      const result = await mockApi.getUsers(1, 10);
      expect(result.total).toBe(MOCK_USERS.length);
    });

    it('фильтрует пользователей по имени', async () => {
      const result = await mockApi.getUsers(1, 10, 'Иван');
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].first_name).toBe('Иван');
    });
  });

  describe('login', () => {
    it('возвращает токен для существующего пользователя', async () => {
      const result = await mockApi.login('ivanov@lyceum.ru', 'anypassword');
      expect(result.access_token).toBeTruthy();
      expect(result.user.email).toBe('ivanov@lyceum.ru');
    });

    it('выбрасывает ошибку для несуществующего пользователя', async () => {
      await expect(mockApi.login('unknown@lyceum.ru', 'pass')).rejects.toThrow(
        'Пользователь не найден'
      );
    });
  });

  describe('register', () => {
    it('успешно регистрирует нового пользователя', async () => {
      const result = await mockApi.register({
        email: 'new@lyceum.ru',
        password: 'pass123',
        first_name: 'Новый',
        last_name: 'Пользователь',
        role: 'student',
      });
      expect(result.message).toBeTruthy();
    });

    it('выбрасывает ошибку при дублировании email', async () => {
      await expect(
        mockApi.register({
          email: 'ivanov@lyceum.ru',
          password: 'pass',
          first_name: 'Иван',
          last_name: 'Иванов',
          role: 'student',
        })
      ).rejects.toThrow('уже существует');
    });
  });
});
