// services/api.js
// Celular físico → IP do PC na mesma rede (confira com ipconfig). /api UMA vez só.
const BASE_URL = 'http://10.56.2.155:8000/api';

// ------------------------------------------------------------
// Helper: faz a requisição e padroniza erros
// ------------------------------------------------------------
async function request(endpoint, options = {}) {
  try {
    const resposta = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      return {
        erro: 's',
        mensagem: dados.mensagem || dados.message || `Erro ${resposta.status}`,
        status: resposta.status,
      };
    }

    return dados;
  } catch (e) {
    return { erro: 's', mensagem: 'Erro de conexão com o servidor' };
  }
}

function auth(token) {
  return { Authorization: `Bearer ${token}` };
}

// ------------------------------------------------------------
// Autenticação / usuário
// ------------------------------------------------------------
export function login(email, senha) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}

export function cadastroUsuario(dados) {
  return request('/cadastro_usuario', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function listarUsuarios(token) {
  return request('/usuarios', { headers: auth(token) });
}

export function atualizarUsuario(id, dados, token) {
  return request(`/usuarios/${id}`, {
    method: 'PUT',
    headers: auth(token),
    body: JSON.stringify(dados),
  });
}

export function excluirUsuario(id, token) {
  return request(`/usuarios/${id}`, {
    method: 'DELETE',
    headers: auth(token),
  });
}

// ------------------------------------------------------------
// Salas / locais
// ------------------------------------------------------------
export function listarMinhasSalas(token) {
  return request('/minhas_salas', { headers: auth(token) });
}

export function atualizarSala(id, dados, token) {
  return request(`/minhas_salas/${id}`, {
    method: 'PUT',
    headers: auth(token),
    body: JSON.stringify(dados),
  });
}

export function excluirSala(id, token) {
  return request(`/minhas_salas/${id}`, {
    method: 'DELETE',
    headers: auth(token),
  });
}

export function listarBlocos(token) {
  return request('/blocos', { headers: auth(token) });
}

export function listarTiposLocal(token) {
  return request('/tipos_local', { headers: auth(token) });
}

// ------------------------------------------------------------
// Chamados e alerta (Laravel -> ESP32)
// ------------------------------------------------------------
export function acionarAlerta(token, descricao, localId = null, comando = 'ACIONAR') {
  return request('/acionar', {
    method: 'POST',
    headers: auth(token),
    body: JSON.stringify({ comando, descricao, local_id: localId }),
  });
}

export function listarChamados(token) {
  return request('/chamados', { headers: auth(token) });
}