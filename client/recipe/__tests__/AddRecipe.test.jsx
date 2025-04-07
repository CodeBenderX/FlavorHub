jest.mock('../../lib/auth-helper', () => ({
    isAuthenticated: jest.fn(() => ({ token: 'fake-token' }))
  }))
jest.mock('../../recipe/api-recipe', () => ({
    create: jest.fn(() => Promise.resolve({ success: true }))
  }))
  
  import React from 'react'
  import { render, screen, fireEvent, waitFor } from '@testing-library/react'
  import { MemoryRouter } from 'react-router-dom'
  import AddRecipe from '../AddRecipe'
  
  describe('AddRecipe Component', () => {
    test('renders form with required fields', () => {
      render(
        <MemoryRouter>
          <AddRecipe />
        </MemoryRouter>
      )
  
      expect(screen.getByLabelText(/Recipe Title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Ingredients/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Instructions/i)).toBeInTheDocument()
    })
  
    test('shows error if required fields are empty on submit', async () => {
      render(
        <MemoryRouter>
          <AddRecipe />
        </MemoryRouter>
      )
  
      const submitButton = screen.getByRole('button', { name: /Add Recipe/i })
    fireEvent.click(submitButton)
  
    await waitFor(() => {
        const titleInput = screen.getByLabelText(/Recipe Title/i)
        const ingredientsInput = screen.getByLabelText(/Ingredients/i)
  
        expect(titleInput).toHaveAttribute('aria-invalid', 'false')
        expect(ingredientsInput).toHaveAttribute('aria-invalid', 'false')
      })
    })
  
    test('calls create API on successful form submit', async () => {
        const { create } = require('../../recipe/api-recipe')
    
        render(
          <MemoryRouter>
            <AddRecipe />
          </MemoryRouter>
        )
  
        fireEvent.change(screen.getByLabelText(/Recipe Title/i), {
            target: { value: 'Test Recipe' }
          })
          fireEvent.change(screen.getByLabelText(/Ingredients/i), {
            target: { value: 'Salt, Sugar' }
          })
          fireEvent.change(screen.getByLabelText(/Instructions/i), {
            target: { value: 'Mix and cook' }
          })
  
          const submitButton = screen.getByRole('button', { name: /Add Recipe/i })
          fireEvent.click(submitButton)
      
          await waitFor(() => {
            expect(create).toHaveBeenCalled()
      })
    })
  })
  