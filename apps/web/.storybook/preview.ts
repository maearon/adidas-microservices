import type { Preview } from '@storybook/nextjs-vite'
import '@/app/globals.css';
import { ReduxProviderDecorator } from "../stories/storybook-redux-provider"
import { AppProviders } from "../stories//app-providers"

const preview: Preview = {
  decorators: [ReduxProviderDecorator],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;