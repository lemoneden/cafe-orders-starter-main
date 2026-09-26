import { CafeApp } from './ui/CafeApp.js';

const root = document.querySelector('#app');

try {
  const app = new CafeApp(root);
  app.init();
} catch (error) {
  root.innerHTML = `
    <div class="startup-error">
      <h1>Приложение не запустилось</h1>
      <p>${error.message}</p>
      <p>Выполните задачи 1–3 из TASK.md и проверьте себя командой <code>npm test</code>.</p>
    </div>
  `;
  console.error(error);
}
