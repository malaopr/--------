

export interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  first_name: string;
  last_name: string;
  grade?: string;
  subject?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  creator_id: string;
  members_count: number;
  created_at: string;
}

export interface Post {
  id: string;
  group_id: string;
  group_name: string;
  author_id: string;
  author_name: string;
  title: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface Event {
  id: string;
  author_id: string;
  title: string;
  content: string;
  event_date: string | null;
  location?: string;
  image_url?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  created_at: string;
}


export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    email: 'ivanov@lyceum.ru',
    role: 'student',
    first_name: 'Иван',
    last_name: 'Иванов',
    grade: '10А',
    avatar_url: 'https://i.pravatar.cc/150?u=u1',
    bio: 'Увлекаюсь программированием и шахматами',
    created_at: '2025-09-01T08:00:00Z',
  },
  {
    id: 'u2',
    email: 'petrova@lyceum.ru',
    role: 'student',
    first_name: 'Екатерина',
    last_name: 'Петрова',
    grade: '10Б',
    avatar_url: 'https://i.pravatar.cc/150?u=u2',
    bio: 'Люблю математику и музыку',
    created_at: '2025-09-01T08:00:00Z',
  },
  {
    id: 'u3',
    email: 'sidorov@lyceum.ru',
    role: 'teacher',
    first_name: 'Алексей',
    last_name: 'Сидоров',
    subject: 'Информатика',
    avatar_url: 'https://i.pravatar.cc/150?u=u3',
    bio: 'Преподаватель информатики, 10 лет опыта',
    created_at: '2024-09-01T08:00:00Z',
  },
  {
    id: 'u4',
    email: 'admin@lyceum.ru',
    role: 'admin',
    first_name: 'Мария',
    last_name: 'Кузнецова',
    avatar_url: 'https://i.pravatar.cc/150?u=u4',
    bio: 'Администратор платформы',
    created_at: '2024-01-01T08:00:00Z',
  },
];


export const MOCK_CURRENT_USER: User = MOCK_USERS[0];


export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'IT Клуб',
    description: 'Разработка, код, алгоритмы и всё про технологии',
    avatar_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&h=100&fit=crop',
    creator_id: 'u3',
    members_count: 45,
    created_at: '2025-09-05T10:00:00Z',
  },
  {
    id: 'g2',
    name: 'Музыкальный бэнд',
    description: 'Студенческая группа, репетиции и джемы каждую пятницу',
    avatar_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
    creator_id: 'u2',
    members_count: 12,
    created_at: '2025-09-10T12:00:00Z',
  },
  {
    id: 'g3',
    name: 'Дискуссионный клуб',
    description: 'Обсуждение актуальных тем, дебаты, риторика',
    avatar_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=100&h=100&fit=crop',
    creator_id: 'u3',
    members_count: 28,
    created_at: '2025-09-12T09:00:00Z',
  },
  {
    id: 'g4',
    name: 'Киноклуб',
    description: 'Просмотр и анализ шедевров кинематографа',
    avatar_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&h=100&fit=crop',
    creator_id: 'u1',
    members_count: 56,
    created_at: '2025-09-15T15:00:00Z',
  },
  {
    id: 'g5',
    name: 'Шахматный кружок',
    description: 'Спарринги, турниры, разбор партий',
    avatar_url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=100&h=100&fit=crop',
    creator_id: 'u1',
    members_count: 18,
    created_at: '2025-09-20T11:00:00Z',
  },
  {
    id: 'g6',
    name: 'Волонтёрский отряд',
    description: 'Помощь нуждающимся, экологические акции',
    avatar_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop',
    creator_id: 'u4',
    members_count: 34,
    created_at: '2025-09-22T13:00:00Z',
  },
];


export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    group_id: 'g1',
    group_name: 'IT Клуб',
    author_id: 'u3',
    author_name: 'Алексей Сидоров',
    title: 'Встреча по алгоритмам — итоги',
    content: 'Отличная встреча! Разобрали сортировку слиянием и бинарный поиск. Следующая тема — динамическое программирование. Записи скоро загружу.',
    likes_count: 12,
    comments_count: 4,
    created_at: '2026-03-18T18:30:00Z',
  },
  {
    id: 'p2',
    group_id: 'g2',
    group_name: 'Музыкальный бэнд',
    author_id: 'u2',
    author_name: 'Екатерина Петрова',
    title: 'Репетиция в пятницу',
    content: 'Напоминаю, что в эту пятницу в 17:00 репетиция. Готовим три новые песни к весеннему концерту. Просьба всех прийти!',
    likes_count: 8,
    comments_count: 6,
    created_at: '2026-03-17T14:00:00Z',
  },
  {
    id: 'p3',
    group_id: 'g3',
    group_name: 'Дискуссионный клуб',
    author_id: 'u3',
    author_name: 'Алексей Сидоров',
    title: 'Тема следующего заседания',
    content: 'На следующем заседании обсуждаем: "Искусственный интеллект — угроза или возможность?". Подготовьте аргументы с обеих сторон.',
    likes_count: 15,
    comments_count: 9,
    created_at: '2026-03-16T10:00:00Z',
  },
  {
    id: 'p4',
    group_id: 'g1',
    group_name: 'IT Клуб',
    author_id: 'u1',
    author_name: 'Иван Иванов',
    title: 'Рекомендую курс по TypeScript',
    content: 'Нашёл отличный бесплатный курс по TypeScript на русском языке. Очень понятно объясняется система типов и дженерики. Ссылку кину в чат.',
    likes_count: 21,
    comments_count: 3,
    created_at: '2026-03-15T20:00:00Z',
  },
  {
    id: 'p5',
    group_id: 'g4',
    group_name: 'Киноклуб',
    author_id: 'u1',
    author_name: 'Иван Иванов',
    title: 'Смотрим "Начало" Нолана',
    content: 'В эту среду в 18:30 смотрим "Начало" Кристофера Нолана. После просмотра — обсуждение. Место: актовый зал. Вход свободный.',
    likes_count: 34,
    comments_count: 11,
    created_at: '2026-03-14T12:00:00Z',
  },
  {
    id: 'p6',
    group_id: 'g5',
    group_name: 'Шахматный кружок',
    author_id: 'u1',
    author_name: 'Иван Иванов',
    title: 'Результаты турнира',
    content: 'Поздравляем победителей весеннего турнира! 1 место — Дмитрий К. (10А), 2 место — Анна С. (10Б), 3 место — Павел Н. (10В). Молодцы!',
    likes_count: 19,
    comments_count: 7,
    created_at: '2026-03-13T16:00:00Z',
  },
];


export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    author_id: 'u4',
    title: 'Лекция по ИИ',
    content: 'Приглашённый лектор из ИТМО расскажет о последних достижениях в области искусственного интеллекта и машинного обучения.',
    event_date: '2026-03-21T18:00:00Z',
    location: 'Аудитория 101',
    image_url: 'https://images.unsplash.com/photo-1591453001853-4856a95f00e9?w=500&h=300&fit=crop',
    created_at: '2026-03-10T09:00:00Z',
  },
  {
    id: 'e2',
    author_id: 'u4',
    title: 'Сбор волонтёров',
    content: 'Весенняя уборка территории лицея. Приходите в удобной одежде, инвентарь предоставим.',
    event_date: '2026-03-22T12:00:00Z',
    location: 'Главная площадь',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    created_at: '2026-03-11T10:00:00Z',
  },
  {
    id: 'e3',
    author_id: 'u4',
    title: 'Хакатон 2026',
    content: '24-часовой хакатон для учеников. Тема: "Технологии для образования". Командами по 3-4 человека. Призы победителям!',
    event_date: '2026-04-05T09:00:00Z',
    location: 'IT Центр',
    image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=300&fit=crop',
    created_at: '2026-03-12T11:00:00Z',
  },
  {
    id: 'e4',
    author_id: 'u4',
    title: 'Весенний концерт',
    content: 'Ежегодный весенний концерт лицея. Выступают музыкальный бэнд, хор и солисты. Вход свободный для всех!',
    event_date: '2026-04-20T17:00:00Z',
    location: 'Актовый зал',
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=300&fit=crop',
    created_at: '2026-03-13T12:00:00Z',
  },
  {
    id: 'e5',
    author_id: 'u4',
    title: 'Олимпиада по математике',
    content: 'Внутрилицейская олимпиада по математике. Участвуют все классы. Победители поедут на городской этап.',
    event_date: '2026-04-10T10:00:00Z',
    location: 'Кабинет 205',
    image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=300&fit=crop',
    created_at: '2026-03-14T09:00:00Z',
  },
  {
    id: 'e6',
    author_id: 'u4',
    title: 'День открытых дверей',
    content: 'Приглашаем будущих учеников и их родителей познакомиться с лицеем, программами обучения и педагогическим составом.',
    event_date: '2026-04-15T11:00:00Z',
    location: 'Главный корпус',
    image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&h=300&fit=crop',
    created_at: '2026-03-15T10:00:00Z',
  },
];


export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    post_id: 'p1',
    author_id: 'u1',
    author_name: 'Иван Иванов',
    author_avatar: 'https://i.pravatar.cc/150?u=u1',
    content: 'Спасибо за встречу! Очень полезно. Жду записи.',
    created_at: '2026-03-18T19:00:00Z',
  },
  {
    id: 'c2',
    post_id: 'p1',
    author_id: 'u2',
    author_name: 'Екатерина Петрова',
    author_avatar: 'https://i.pravatar.cc/150?u=u2',
    content: 'Когда следующая встреча?',
    created_at: '2026-03-18T19:30:00Z',
  },
  {
    id: 'c3',
    post_id: 'p2',
    author_id: 'u1',
    author_name: 'Иван Иванов',
    author_avatar: 'https://i.pravatar.cc/150?u=u1',
    content: 'Буду! Какие песни готовим?',
    created_at: '2026-03-17T15:00:00Z',
  },
];


const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));


function paginate<T>(items: T[], page: number, limit: number): { data: T[]; total: number; page: number; limit: number; total_pages: number } {
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return {
    data,
    total: items.length,
    page,
    limit,
    total_pages: Math.ceil(items.length / limit),
  };
}

export const mockApi = {

  async login(email: string, _password: string) {
    await delay();
    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) throw new Error('Пользователь не найден');
    return { access_token: 'mock-jwt-token', user };
  },

  async register(data: { email: string; password: string; first_name: string; last_name: string; role: string }) {
    await delay();
    if (MOCK_USERS.find((u) => u.email === data.email)) {
      throw new Error('Пользователь с таким email уже существует');
    }
    return { message: 'Регистрация успешна' };
  },


  async getFeed(page = 1, limit = 6) {
    await delay();
    return paginate(MOCK_POSTS, page, limit);
  },

  
  async getEvents(page = 1, limit = 6) {
    await delay();
    return paginate(MOCK_EVENTS, page, limit);
  },

  async getGroups(page = 1, limit = 6, search = '') {
    await delay();
    const filtered = search
      ? MOCK_GROUPS.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
      : MOCK_GROUPS;
    return paginate(filtered, page, limit);
  },

 
  async getUsers(page = 1, limit = 10, search = '') {
    await delay();
    const filtered = search
      ? MOCK_USERS.filter(
          (u) =>
            `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
            u.grade?.toLowerCase().includes(search.toLowerCase()) ||
            u.subject?.toLowerCase().includes(search.toLowerCase())
        )
      : MOCK_USERS;
    return paginate(filtered, page, limit);
  },

  
  async getComments(post_id: string) {
    await delay();
    return MOCK_COMMENTS.filter((c) => c.post_id === post_id);
  },
};
