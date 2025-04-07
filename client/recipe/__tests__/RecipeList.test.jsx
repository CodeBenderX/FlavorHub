import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RecipeList from '../RecipeList'

jest.mock('../../lib/auth-helper', () => ({
  isAuthenticated: jest.fn(() => ({
    token: 'fake-token',
    user: { name: 'John Doe', role: 'user' },
  })),
}))

jest.mock('../../recipe/api-recipe', () => ({
  remove: jest.fn(() => Promise.resolve({ success: true }))
}))

describe('RecipeList Component', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('displays loading spinner initially', async () => {
    fetch.mockResponseOnce(JSON.stringify([]));

    render(
      <MemoryRouter>
        <RecipeList />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading recipes.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Recipes/i)).toBeInTheDocument();
    });
  });

  test('shows message when no recipes exist', async () => {
    fetch.mockResponseOnce(JSON.stringify([]));

    render(
      <MemoryRouter>
        <RecipeList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/You haven't created any recipes yet/i)
      ).toBeInTheDocument();
    });
  });

  test('renders recipe card with title and view button', async () => {
    fetch.mockResponseOnce(JSON.stringify([
      {
        _id: '1',
        title: 'Test Recipe',
        creator: 'John Doe',
        created: new Date().toISOString(),
        image: null
      },
    ]));

    render(
      <MemoryRouter>
        <RecipeList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Recipe/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /View Recipe/i })
      ).toBeInTheDocument();
    });
  });
});
