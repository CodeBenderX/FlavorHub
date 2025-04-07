// ✅ Mock auth-helper.js
jest.mock('../../lib/auth-helper', () => ({
    isAuthenticated: jest.fn(() => ({ token: 'fake-token' })),
  }))

  jest.mock('../../recipe/api-recipe', () => ({
    list: jest.fn(() => Promise.resolve([])),
    listByIngredient: jest.fn(() => Promise.resolve([])),
    listByCreator: jest.fn(() => Promise.resolve([])),
  }))

import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MemberHome from '../MemberHome'

describe('MemberHome Component', () => {
  test('renders the loading spinner initially', async () => {
    render(
      <MemoryRouter>
        <MemberHome />
      </MemoryRouter>
    )

    const loadingSpinner = screen.getByTestId('loading-spinner')
    expect(loadingSpinner).toBeInTheDocument()
  })

  test('renders main banner heading after loading', async () => {
    render(
      <MemoryRouter>
        <MemberHome />
      </MemoryRouter>
    )

    const heading = await screen.findByText(/Discover Delicious Recipes/i)
    expect(heading).toBeInTheDocument()
  })

  test('shows message when no recipes are available', async () => {
    render(
      <MemoryRouter>
        <MemberHome />
      </MemoryRouter>
    )

    const noRecipeMessages = await screen.findAllByText(/No recipes available/i)
    expect(noRecipeMessages.length).toBeGreaterThan(0)
  })
})
