import { NextIntlClientProvider, useMessages } from 'next-intl';

export function I18nProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
  // Use `useMessages` to fetch the translation messages
  const messages = useMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
