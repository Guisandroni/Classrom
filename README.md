## 4. Instruções para Executar

### Pré-requisitos

Tenha instalado Python (3.10+) e o runtime JavaScript Bun.

- **Bun (Linux/macOS):**
  ```bash
  curl -fsSL [https://bun.sh/install](https://bun.sh/install) | bash
  ```
- **Bun (Windows):**
  ```powershell
  powershell -c "irm bun.sh/install.ps1 | iex"
  ```

---

### Terminal 1: Backend (Django API)

1.  **Navegue até a pasta do backend:**

    ```bash
    # Ex: cd pasta-do-backend
    ```

2.  **Ative o ambiente de desenvolvimento Python:**
    - _Linux/macOS:_
      ```bash
      source environment/bin/activate
      ```
    - _Windows:_
      ```bash
      .\environment\Scripts\activate
      ```

3.  **Execute as migrações**

    ```bash
    python manage.py migrate
    ```

4.  **Criar um super usuário** (Essencial para testes):

    ```bash
    python manage.py createsuperuser
    ```

5.  **Iniciar o servidor:**
    ```bash
    python manage.py runserver
    ```
    ✅ O backend estará rodando em: `http://127.0.0.1:8000`

---

### Terminal 2: Frontend (React)

1.  **No terminal, entre na pasta do projeto:**

    ```bash
    cd front-django-api
    ```

2.  **Instale as dependências:**

    ```bash
    bun install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    bun dev
    ```
    ✅ Acesse a aplicação em: `http://localhost:3000`
# Classrom
