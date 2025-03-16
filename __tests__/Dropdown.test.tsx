import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dropdown from '@/app/components/Dropdown/Dropdown';

describe('Dropdown Component', () => {
  const mockOptions = [
    { key: 'option1', label: 'Option 1' },
    { key: 'option2', label: 'Option 2' },
    { key: 'option3', label: 'Option 3' }
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with the correct label', () => {
    render(
      <Dropdown
        label="Test Dropdown"
        options={mockOptions}
        selectedValue="option1"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Test Dropdown')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(
      <Dropdown
        label="Test Dropdown"
        options={mockOptions}
        selectedValue="option1"
        onChange={mockOnChange}
      />
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    // Check all options are rendered
    mockOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('calls onChange with the correct value when selection changes', () => {
    render(
      <Dropdown
        label="Test Dropdown"
        options={mockOptions}
        selectedValue="option1"
        onChange={mockOnChange}
      />
    );

    const selectElement = screen.getByRole('combobox');

    // Simulate selecting the third option
    fireEvent.change(selectElement, { target: { value: 'Option 3' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('option3');
  });

  it('handles empty options array', () => {
    render(
      <Dropdown
        label="Empty Dropdown"
        options={[]}
        selectedValue=""
        onChange={mockOnChange}
      />
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement.children.length).toBe(0);
  });

  it('displays in the dropdown container', () => {
    render(
      <Dropdown
        label="Test Dropdown"
        options={mockOptions}
        selectedValue="option1"
        onChange={mockOnChange}
      />
    );

    const container = document.querySelector(`.dropdownContainer`);
    expect(container).toBeInTheDocument();
  });
});
