import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '@/app/components/Modal/Modal';

describe('Modal Component', () => {
  const mockCloseModal = jest.fn();
  const modalContent = <div data-testid="modal-child">Test Content</div>;

  beforeEach(() => {
    mockCloseModal.mockClear();
  });

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} closeModal={mockCloseModal}>
        {modalContent}
      </Modal>
    );

    expect(screen.queryByTestId('modal-child')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} closeModal={mockCloseModal}>
        {modalContent}
      </Modal>
    );

    expect(screen.getByTestId('modal-child')).toBeInTheDocument();
  });

  it('should call closeModal when clicking the close button', () => {
    render(
      <Modal isOpen={true} closeModal={mockCloseModal}>
        {modalContent}
      </Modal>
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('should call closeModal when clicking the overlay', () => {
    const { container } = render(
      <Modal isOpen={true} closeModal={mockCloseModal}>
        {modalContent}
      </Modal>
    );

    // Find the overlay element and click it
    const overlay = container.firstChild;
    fireEvent.click(overlay!);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('should not call closeModal when clicking inside the modal content', () => {
    render(
      <Modal isOpen={true} closeModal={mockCloseModal}>
        {modalContent}
      </Modal>
    );

    // Find the modal content and click it
    const content = screen.getByTestId('modal-child');
    fireEvent.click(content);

    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it('renders children correctly inside the modal', () => {
    const complexContent = (
      <>
        <h1>Modal Title</h1>
        <p>Modal description text</p>
        <button>Action Button</button>
      </>
    );

    render(
      <Modal isOpen={true} closeModal={mockCloseModal}>
        {complexContent}
      </Modal>
    );

    expect(screen.getByRole('heading', { name: 'Modal Title' })).toBeInTheDocument();
    expect(screen.getByText('Modal description text')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
  });
});
