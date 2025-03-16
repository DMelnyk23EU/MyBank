import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Spinner from '@/app/components/Spinner/Spinner';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
    return <img src={src} alt={alt} width={width} height={height} data-testid="spinner-image" />;
  };
});

describe('Spinner Component', () => {
  it('renders basic spinner with correct size', () => {
    render(<Spinner size={24} />);

    const image = screen.getByTestId('spinner-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('width', '24');
    expect(image).toHaveAttribute('height', '24');
    expect(image).toHaveAttribute('src', '/spinner.svg');
    expect(image).toHaveAttribute('alt', 'Spinner');
  });

  it('renders label when provided', () => {
    const testLabel = 'Loading...';
    render(<Spinner size={24} label={testLabel} />);

    expect(screen.getByText(testLabel)).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    render(<Spinner size={24} />);

    const paragraphs = document.querySelectorAll('p');
    expect(paragraphs.length).toBe(0);
  });

  it('applies custom className when provided', () => {
    const { container } = render(<Spinner size={24} className="custom-class" />);

    const spinnerContainer = container.querySelector('.spinner-container');
    expect(spinnerContainer).toHaveClass('custom-class');
  });

  it('renders as global spinner when isGlobalSpinner is true', () => {
    const { container } = render(<Spinner size={24} isGlobalSpinner={true} />);

    const globalContainer = container.querySelector('.spinner-global-container');
    expect(globalContainer).toBeInTheDocument();
  });

  it('does not render global spinner container when isGlobalSpinner is false', () => {
    const { container } = render(<Spinner size={24} isGlobalSpinner={false} />);

    const globalContainer = container.querySelector('.spinner-global-container');
    expect(globalContainer).not.toBeInTheDocument();
  });

  it('renders with all props combined', () => {
    const { container } = render(
      <Spinner
        size={48}
        label="Please wait"
        className="test-class"
        isGlobalSpinner={true}
      />
    );

    // Check global container
    const globalContainer = container.querySelector('.spinner-global-container');
    expect(globalContainer).toBeInTheDocument();

    // Check spinner container with custom class
    const spinnerContainer = container.querySelector('.spinner-container');
    expect(spinnerContainer).toHaveClass('test-class');

    // Check image size
    const image = screen.getByTestId('spinner-image');
    expect(image).toHaveAttribute('width', '48');
    expect(image).toHaveAttribute('height', '48');

    // Check label
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });
});
