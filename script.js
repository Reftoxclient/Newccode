// Проверка, установлено ли приложение (работает в Chrome/Android, не в iOS).
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Предотвращаем немедленный показ диалога
  e.preventDefault();
  deferredPrompt = e;
});

// Когда страница загрузится:
window.addEventListener('load', () => {
  // 1. Скрываем экран загрузки и показываем приложение
  const loadingScreen = document.getElementById('loading-screen');
  const app = document.getElementById('app');
  loadingScreen.classList.add('hidden');
  app.classList.remove('hidden');
  document.body.style.overflow = 'auto'; // Разрешаем прокрутку

  // 2. Регистрируем Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker зарегистрирован'))
      .catch(err => console.error('SW регистрация не удалась', err));
  }

  // 3. Проверка режима отображения (PWA или браузер)
  const pwaCheck = document.getElementById('pwa-check');
  if (window.matchMedia('(display-mode: standalone)').matches) {
    pwaCheck.innerHTML = 'Приложение запущено как PWA.';
  } else {
    pwaCheck.innerHTML = `
      Приложение не установлено. 
      <button id="installBtn">Установить</button>
    `;
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const choiceResult = await deferredPrompt.userChoice;
          if (choiceResult.outcome === 'accepted') {
            console.log('Пользователь установил приложение');
          } else {
            console.log('Пользователь отказался от установки');
          }
          deferredPrompt = null;
        }
      });
    }
  }

  // 4. Логика нажатий на карточки
  const dnsCard = document.getElementById('dns-card');
  const portalCard = document.getElementById('portal-card');
  const newccodeCard = document.getElementById('newccode-card');

  // При нажатии убираем размытие (добавляем класс active), немного ждем и выполняем действие
  dnsCard.addEventListener('click', () => {
    dnsCard.classList.add('active');
    setTimeout(() => {
      // Скачиваем файл /dns.mobileconfig
      window.location.href = '/dns.mobileconfig';
    }, 800);
  });

  portalCard.addEventListener('click', () => {
    portalCard.classList.add('active');
    setTimeout(() => {
      // Переходим по itms-services://?action=download-manifest&url=...
      window.location.href = 'itms-services://?action=download-manifest&url=https://wsfteam.xyz/files/portal/continent/manifest.plist';
    }, 800);
  });

  newccodeCard.addEventListener('click', () => {
    newccodeCard.classList.add('active');
    setTimeout(() => {
      // Показываем информацию о профиле (можно открыть модальное окно, 
      // или просто перейти на новую страницу, или вывести alert)
      showProfileInfo();
    }, 800);
  });
});

// Пример функции, показывающей информацию о профиле автора
function showProfileInfo() {
  // Можно реализовать как хотите. Для простоты - alert:
  alert(`Автор: Newccode
Developer
Tag: New.cc

Telegram: https://t.me/newccode
`);
}