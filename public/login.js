const AUTH_ERRORS = {
  "auth/invalid-email": "E-mail inválido.",
  "auth/user-not-found": "Não existe conta com esse e-mail.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/email-already-in-use": "Já existe uma conta com esse e-mail.",
  "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
  "auth/missing-password": "Digite sua senha.",
  "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
};

function authErrorMessage(err) {
  return AUTH_ERRORS[err && err.code] || "Algo deu errado. Tente novamente.";
}

let loginMode = "login"; // login | signup

function renderLogin() {
  const root = document.getElementById("root");
  root.innerHTML = `
    <div style="min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:20px;">
      <div style="width:100%;max-width:360px;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;">
        <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:22px;">
          <div style="width:54px;height:54px;border-radius:16px;background:var(--surface-2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;margin-bottom:12px;">
            ${icon("dumbbell", 26, "var(--accent-energy)")}
          </div>
          <div style="font-size:24px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">
            FORJ<span style="color:var(--accent-energy)">A</span>
          </div>
          <div style="font-size:12.5px;color:var(--text-muted);margin-top:4px;" id="login-subtitle">
            ${loginMode === "login" ? "Entre para continuar seu treino" : "Crie sua conta gratuita"}
          </div>
        </div>

        <form id="login-form" style="display:flex;flex-direction:column;gap:10px;">
          <input type="email" id="login-email" placeholder="E-mail" autocomplete="email" />
          <input type="password" id="login-password" placeholder="Senha" autocomplete="${loginMode === "login" ? "current-password" : "new-password"}" />
          ${loginMode === "signup" ? `<input type="password" id="login-confirm" placeholder="Confirmar senha" autocomplete="new-password" />` : ""}
          <div id="login-error" style="font-size:12.5px;color:#FF5C5C;display:none;"></div>
          <div id="login-info" style="font-size:12.5px;color:#4FE3C2;display:none;"></div>
          <button type="submit" id="login-submit" class="btn-primary" style="margin-top:4px;">
            ${loginMode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        ${loginMode === "login" ? `
          <button id="login-forgot" style="background:none;border:none;color:var(--accent-water);font-size:12.5px;margin-top:14px;cursor:pointer;width:100%;text-align:center;">
            Esqueci minha senha
          </button>
        ` : ""}

        <div style="border-top:1px solid var(--border);margin-top:18px;padding-top:14px;text-align:center;font-size:12.5px;color:var(--text-muted);">
          ${loginMode === "login" ? "Ainda não tem conta?" : "Já tem conta?"}
          <button id="login-toggle" style="background:none;border:none;color:var(--accent-energy);font-weight:700;cursor:pointer;font-size:12.5px;">
            ${loginMode === "login" ? "Criar conta" : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  `;

  const errorEl = document.getElementById("login-error");
  const infoEl = document.getElementById("login-info");
  const showError = (msg) => { errorEl.textContent = msg; errorEl.style.display = "block"; infoEl.style.display = "none"; };
  const showInfo = (msg) => { infoEl.textContent = msg; infoEl.style.display = "block"; errorEl.style.display = "none"; };
  const clearMsgs = () => { errorEl.style.display = "none"; infoEl.style.display = "none"; };

  document.getElementById("login-toggle").addEventListener("click", () => {
    loginMode = loginMode === "login" ? "signup" : "login";
    renderLogin();
  });

  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMsgs();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    if (!email || !password) { showError("Preencha e-mail e senha."); return; }
    if (loginMode === "signup") {
      const confirm = document.getElementById("login-confirm").value;
      if (password !== confirm) { showError("As senhas não coincidem."); return; }
    }
    const btn = document.getElementById("login-submit");
    btn.disabled = true;
    btn.textContent = "Aguarde...";
    try {
      if (loginMode === "login") {
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        await auth.createUserWithEmailAndPassword(email, password);
      }
    } catch (err) {
      showError(authErrorMessage(err));
      btn.disabled = false;
      btn.textContent = loginMode === "login" ? "Entrar" : "Criar conta";
    }
  });

  const forgotBtn = document.getElementById("login-forgot");
  if (forgotBtn) {
    forgotBtn.addEventListener("click", async () => {
      clearMsgs();
      const email = document.getElementById("login-email").value.trim();
      if (!email) { showError("Digite seu e-mail acima para receber o link de recuperação."); return; }
      try {
        await auth.sendPasswordResetEmail(email);
        showInfo("Enviamos um e-mail com o link para redefinir sua senha.");
      } catch (err) {
        showError(authErrorMessage(err));
      }
    });
  }
}
