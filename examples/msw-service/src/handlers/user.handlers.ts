import { http, HttpResponse } from 'msw';
import { mockUsers } from '../mocks/data';
import type { User } from '../schemas/user.schema';

let users = [...mockUsers];

export const userHandlers = [
  /**
   * GET /api/users - Get all users
   */
  http.get('/api/users', () => {
    return HttpResponse.json(users);
  }),

  /**
   * GET /api/users/:id - Get a specific user
   */
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    const user = users.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(user);
  }),

  /**
   * POST /api/users - Create a new user
   */
  http.post('/api/users', async ({ request }) => {
    const body = await request.json() as Partial<User>;

    const newUser: User = {
      id: crypto.randomUUID(),
      name: body.name || 'New User',
      email: body.email || 'newuser@example.com',
      age: body.age || 25,
      role: body.role || 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    return HttpResponse.json(newUser, { status: 201 });
  }),

  /**
   * PUT /api/users/:id - Update a user
   */
  http.put('/api/users/:id', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as Partial<User>;

    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updated = { ...users[userIndex], ...body, id };
    users[userIndex] = updated;

    return HttpResponse.json(updated);
  }),

  /**
   * DELETE /api/users/:id - Delete a user
   */
  http.delete('/api/users/:id', ({ params }) => {
    const { id } = params;
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    users.splice(userIndex, 1);

    return HttpResponse.json({ success: true });
  }),
];
