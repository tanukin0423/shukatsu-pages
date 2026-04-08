// ============================
// 就活の木 認証システム auth.js
// ============================

(function () {
  const STORAGE_KEY = 'shukatsu_auth';
  const VALID_PREFIXES = ['2221', '2222', '2223', '2224'];

  // 学籍番号バリデーション
  function isValidStudentId(id) {
    if (!/^\d{8}$/.test(id)) return false;
    const prefix = id.substring(0, 4);
    return VALID_PREFIXES.includes(prefix);
  }

  // 認証済みチェック
  function isAuthenticated() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    try {
      const data = JSON.parse(stored);
      return data.auth === true && isValidStudentId(data.id);
    } catch (e) {
      return false;
    }
  }

  // 認証情報を保存
  function saveAuth(id) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ auth: true, id: id }));
  }

  // 認証画面を挿入
  function showAuthScreen() {
    // ページ本体を非表示
    document.body.style.visibility = 'hidden';

    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.innerHTML = `
      <div class="auth-box">
        <div class="auth-logo">🌱</div>
        <div class="auth-brand">就活の木｜キャリア支援課</div>
        <h2 class="auth-title">学籍番号を入力してください</h2>
        <p class="auth-desc">多摩大学の学籍番号（8桁）を入力してください。<br>一度入力すると、次回以降は自動でログインされます。</p>
        <div class="auth-input-wrap">
          <input
            type="text"
            id="auth-input"
            class="auth-input"
            placeholder="例：22210001"
            maxlength="8"
            inputmode="numeric"
            autocomplete="off"
          />
        </div>
        <div class="auth-error" id="auth-error"></div>
        <button class="auth-btn" id="auth-btn" onclick="window._authSubmit()">
          確認する
        </button>
        <p class="auth-footer">キャリ爺（北山 四郎）作成</p>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.visibility = 'visible';

    // Enterキー対応
    document.getElementById('auth-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') window._authSubmit();
    });

    // 自動フォーカス
    setTimeout(() => {
      const input = document.getElementById('auth-input');
      if (input) input.focus();
    }, 100);
  }

  // 送信処理（グローバルに公開）
  window._authSubmit = function () {
    const input = document.getElementById('auth-input');
    const error = document.getElementById('auth-error');
    const btn   = document.getElementById('auth-btn');
    const id    = input.value.trim();

    error.textContent = '';
    btn.disabled = true;
    btn.textContent = '確認中…';

    setTimeout(() => {
      if (isValidStudentId(id)) {
        saveAuth(id);
        const overlay = document.getElementById('auth-overlay');
        overlay.classList.add('auth-fade-out');
        setTimeout(() => overlay.remove(), 400);
      } else {
        error.textContent = '学籍番号が正しくありません。8桁の数字を入力してください。';
        btn.disabled = false;
        btn.textContent = '確認する';
        input.focus();
        input.select();
      }
    }, 300);
  };

  // 初期化
  function init() {
    if (!isAuthenticated()) {
      showAuthScreen();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
