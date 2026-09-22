const BASE_URL = 'http://192.168.0.24:8000/api';

export async function login(email, senha) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  return response.json();
}

export async function cadastroUsuario(dados) {
  const response = await fetch(`${BASE_URL}/cadastro_usuario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return response.json();
}

export async function listarUsuarios(token) {
  const response = await fetch(`${BASE_URL}/usuarios`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function atualizarUsuario(id, dados, token) {
  const response = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });
  return response.json();
}

export async function excluirUsuario(id, token) {
  const response = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function listarMinhasSalas(token) {
  const response = await fetch(`${BASE_URL}/minhas_salas`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function atualizarSala(id, dados, token) {
  const response = await fetch(`${BASE_URL}/minhas_salas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });
  return response.json();
}

export async function excluirSala(id, token) {
  const response = await fetch(`${BASE_URL}/minhas_salas/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function listarBlocos(token) {
  const response = await fetch(`${BASE_URL}/blocos`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function listarTiposLocal(token) {
  const response = await fetch(`${BASE_URL}/tipos_local`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}