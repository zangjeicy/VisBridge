import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './styles/reset.less';
import './styles/global.less';

async function bootstrap() {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const { worker } = await import('@/mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.mount('#app');
}

bootstrap();
