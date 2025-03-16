import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TopNav from '@/app/components/TopNav/TopNav';

// Mock next/link
jest.mock('next/link', () => {
  const LinkComponent = ({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) => {
    return (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    );
  };
  LinkComponent.displayName = 'NextLink';
  return LinkComponent;
});

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'topNav.home': 'Home',
      'topNav.transactions': 'Transactions',
      'topNav.profile': 'My Profile',
      'topNav.profileEdit': 'Edit Profile',
      'topNav.login': 'Log in',
      'topNav.logout': 'Log out'
    };
    return translations[key] || key;
  }
}));

// Mock LanguageSelector component
jest.mock('../src/app/components/LanguageSelector/LanguageSelector', () => {
  return function MockLanguageSelector() {
    return <div data-testid="language-selector">Language Selector</div>;
  };
});

// Mock Image component
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, className, onClick }: { src: string; alt: string; className?: string; onClick?: () => void }) => {
    return (
      <button className={className} onClick={onClick} onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>
        <img src={src} alt={alt} />
      </button>
    );
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

// Set up mock store
const mockStore = configureStore([]);

describe('TopNav Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any;

  // Helper function to render the component with different store states
  const renderWithStore = (loggedIn: boolean) => {
    store = mockStore({
      account: loggedIn ? { id: 'user123' } : {}
    });

    store.dispatch = jest.fn();

    return render(
      <Provider store={store}>
        <TopNav />
      </Provider>
    );
  };

  it('toggles burger menu when clicked', async () => {
    renderWithStore(false);

    // Find burger icon and click it
    const burgerIcon = document.querySelector('.burgerIcon') as HTMLElement;
    fireEvent.click(burgerIcon);

    // Check if menu is visible
    await waitFor(() => {
      const mobileMenu = document.querySelector('.openMenu');
      expect(mobileMenu).toBeInTheDocument();
    });

    // Close the menu
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    // Check if menu is hidden
    await waitFor(() => {
      const mobileMenu = document.querySelector('.openMenu');
      expect(mobileMenu).not.toBeInTheDocument();
    });
  });

});
