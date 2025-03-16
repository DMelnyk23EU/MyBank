import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '@/app/components/Button/Button';

describe('Button Component', () => {
  it('renders with the correct label', () => {
    render(
      <Button
        label="Click Me"
        disabled={false}
        type="button"
      />
    );

    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <Button
        label="Disabled Button"
        disabled={true}
        type="button"
      />
    );

    const button = screen.getByRole('button', { name: 'Disabled Button' });
    expect(button).toBeDisabled();
  });

  it('is enabled when disabled prop is false', () => {
    render(
      <Button
        label="Enabled Button"
        disabled={false}
        type="button"
      />
    );

    const button = screen.getByRole('button', { name: 'Enabled Button' });
    expect(button).not.toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();

    render(
      <Button
        label="Clickable Button"
        disabled={false}
        onClick={handleClick}
        type="button"
      />
    );

    const button = screen.getByRole('button', { name: 'Clickable Button' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick handler when disabled button is clicked', () => {
    const handleClick = jest.fn();

    render(
      <Button
        label="Disabled Button"
        disabled={true}
        onClick={handleClick}
        type="button"
      />
    );

    const button = screen.getByRole('button', { name: 'Disabled Button' });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('has the correct button type', () => {
    render(
      <Button
        label="Submit Button"
        disabled={false}
        type="submit"
      />
    );

    const button = screen.getByRole('button', { name: 'Submit Button' });
    expect(button).toHaveAttribute('type', 'submit');
  });
});
