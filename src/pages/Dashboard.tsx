import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Spin, Pagination, Alert } from 'antd';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { mockApi, Post, Event } from '../mocks/data';

const { Title, Paragraph } = Typography;

const POSTS_PER_PAGE = 3;
const EVENTS_PER_PAGE = 2;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsPage, setPostsPage] = useState(1);
  const [postsTotal, setPostsTotal] = useState(0);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [eventsPage, setEventsPage] = useState(1);
  const [eventsTotal, setEventsTotal] = useState(0);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    setPostsLoading(true);
    setPostsError(null);
    mockApi
      .getFeed(postsPage, POSTS_PER_PAGE)
      .then((res) => {
        setPosts(res.data);
        setPostsTotal(res.total);
      })
      .catch(() => setPostsError('Не удалось загрузить публикации'))
      .finally(() => setPostsLoading(false));
  }, [postsPage]);

  useEffect(() => {
    setEventsLoading(true);
    mockApi
      .getEvents(eventsPage, EVENTS_PER_PAGE)
      .then((res) => {
        setEvents(res.data);
        setEventsTotal(res.total);
      })
      .finally(() => setEventsLoading(false));
  }, [eventsPage]);

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <Title level={2}>Добро пожаловать в Campus!</Title>
        <Paragraph type="secondary" style={{ fontSize: '16px' }}>
          Здесь вы найдёте главные события, активности и материалы лицея.
        </Paragraph>
      </div>

      {/* Мероприятия */}
      <div style={{ marginBottom: '48px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Ближайшие мероприятия
          </Title>
          <Button
            type="link"
            onClick={() => navigate('/events')}
            iconPosition="end"
            icon={<ChevronRight size={16} />}
          >
            Посмотреть все
          </Button>
        </div>

        <Spin spinning={eventsLoading}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', minHeight: '200px' }}>
            {events.map((ev) => (
              <EventCard
                key={ev.id}
                title={ev.title}
                date={
                  ev.event_date
                    ? new Date(ev.event_date).toLocaleString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Новость'
                }
                location={ev.location}
                imageUrl={ev.image_url}
              />
            ))}
          </div>
          {eventsTotal > EVENTS_PER_PAGE && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Pagination
                current={eventsPage}
                total={eventsTotal}
                pageSize={EVENTS_PER_PAGE}
                onChange={setEventsPage}
                size="small"
              />
            </div>
          )}
        </Spin>
      </div>

      {/* Лента публикаций */}
      <div>
        <Title level={4} style={{ margin: '0 0 16px 0' }}>
          Лента публикаций
        </Title>

        {postsError && (
          <Alert type="error" message={postsError} style={{ marginBottom: '16px' }} />
        )}

        <Spin spinning={postsLoading}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '200px' }}>
            {posts.map((post) => (
              <Card key={post.id} hoverable styles={{ body: { padding: '20px' } }}>
                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                  {post.group_name} · {post.author_name} ·{' '}
                  {new Date(post.created_at).toLocaleDateString('ru-RU')}
                </Typography.Text>
                <Title level={5} style={{ margin: '6px 0 8px 0' }}>
                  {post.title}
                </Title>
                <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: '12px' }}>
                  {post.content}
                </Paragraph>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Typography.Text type="secondary" style={{ fontSize: '13px' }}>
                    ❤️ {post.likes_count}
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: '13px' }}>
                    💬 {post.comments_count}
                  </Typography.Text>
                </div>
              </Card>
            ))}
          </div>

          {postsTotal > POSTS_PER_PAGE && (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Pagination
                current={postsPage}
                total={postsTotal}
                pageSize={POSTS_PER_PAGE}
                onChange={setPostsPage}
                showTotal={(total) => `Всего ${total} публикаций`}
              />
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default Dashboard;
