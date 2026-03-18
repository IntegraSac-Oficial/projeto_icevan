# Setup do Banco de Dados Local — Projeto Ice Van

Guia para configurar o banco de dados MySQL local usando Docker Desktop.
O projeto já está disponível na máquina. O objetivo é apenas subir o banco local.

---

## Informações do Banco

| Campo | Valor |
|-------|-------|
| **Container MySQL** | `icevans_db` |
| **Container phpMyAdmin** | `icevans_phpmyadmin` |
| **Imagem MySQL** | `mysql:8.0` |
| **Porta MySQL (host)** | `3307` |
| **Porta MySQL (container)** | `3306` |
| **Porta phpMyAdmin** | `8090` |
| **Database** | `icevans` |
| **Usuário** | `icevans` |
| **Senha** | `icevans123` |
| **Root password** | `icevans123` |
| **Collation** | `utf8mb4_unicode_ci` |

---

## Passo 1 — Subir os containers

O projeto já tem um `docker-compose.yml` na raiz. Porém ele inclui o container `app` (Next.js) que pode não ser necessário localmente. Para subir **apenas o banco + phpMyAdmin**, executar:

```bash
cd C:\projetos-dev\kiro\projeto_icevan
docker compose up db -d
```

Ou para subir tudo (app + db):

```bash
docker compose up -d
```

### Se a porta 3306 já estiver ocupada

O projeto Toil Projetos usa a porta 3306. O Ice Van precisa usar a porta **3307**.
Se o `docker-compose.yml` estiver com `3306:3306`, alterar para:

```yaml
db:
  ports:
    - "3307:3306"
```

### Subir o phpMyAdmin (se não estiver no docker-compose)

O `docker-compose.yml` original não inclui o phpMyAdmin. Para adicioná-lo, rodar manualmente:

```bash
docker run -d \
  --name icevans_phpmyadmin \
  --network projeto_icevan_default \
  -e PMA_HOST=db \
  -e PMA_USER=root \
  -e PMA_PASSWORD=icevans123 \
  -p 8090:80 \
  phpmyadmin:latest
```

Ou adicionar no `docker-compose.yml`:

```yaml
phpmyadmin:
  image: phpmyadmin:latest
  environment:
    - PMA_HOST=db
    - PMA_USER=root
    - PMA_PASSWORD=icevans123
  ports:
    - "8090:80"
  depends_on:
    - db
  restart: unless-stopped
```

---

## Passo 2 — Verificar se o MySQL está rodando

```bash
docker exec icevans_db mysqladmin ping -u icevans -picevans123 --silent
```

Resposta esperada: `mysqld is alive`

---

## Passo 3 — Criar o arquivo `.env` (se não existir)

O `.env` deve conter no mínimo:

```env
DATABASE_URL=mysql://icevans:icevans123@localhost:3307/icevans
MYSQL_ROOT_PASSWORD=icevans123
MYSQL_DATABASE=icevans
MYSQL_USER=icevans
MYSQL_PASSWORD=icevans123
```

---

## Passo 4 — Importar o banco de dados (SQL dump)

Se você tem um arquivo `.sql` exportado da máquina anterior:

```bash
docker exec -i icevans_db mysql -u icevans -picevans123 icevans < caminho/do/backup.sql
```

Se o arquivo foi exportado com o usuário root:

```bash
docker exec -i icevans_db mysql -u root -picevans123 icevans < caminho/do/backup.sql
```

---

## Passo 5 — Verificação

### phpMyAdmin
Abrir no navegador: **http://localhost:8090**
(Deve entrar direto no banco `icevans` sem pedir login)

### Bancos visíveis no phpMyAdmin
- `icevans` — banco principal do projeto
- `information_schema` — interno do MySQL (não mexer)
- `mysql` — interno do MySQL (não mexer)
- `performance_schema` — interno do MySQL (não mexer)
- `sys` — interno do MySQL (não mexer)

---

## Exportar banco (para transferir para outra máquina)

Para gerar um dump SQL completo:

```bash
docker exec icevans_db mysqldump -u icevans -picevans123 icevans > backup-icevans.sql
```

Esse arquivo pode ser importado na outra máquina usando o Passo 4.

---

## Comandos úteis

| Comando | O que faz |
|---------|-----------|
| `docker compose up db -d` | Sobe apenas o MySQL |
| `docker compose up -d` | Sobe todos os containers |
| `docker compose down` | Para os containers |
| `docker compose down -v` | Para e **apaga todos os dados** do banco |
| `docker exec -it icevans_db mysql -u root -picevans123` | Abre terminal MySQL como root |
| `docker exec -it icevans_db mysql -u icevans -picevans123 icevans` | Abre terminal MySQL no banco icevans |
| `docker logs icevans_db` | Ver logs do MySQL |
| `docker logs icevans_phpmyadmin` | Ver logs do phpMyAdmin |

---

## Resumo rápido (copiar e colar na máquina nova)

```bash
# 1. Ir para o projeto
cd C:\projetos-dev\kiro\projeto_icevan

# 2. Subir o banco
docker compose up db -d

# 3. Aguardar MySQL iniciar (~10 segundos)
docker exec icevans_db mysqladmin ping -u icevans -picevans123 --silent

# 4. Importar o SQL (se tiver backup)
docker exec -i icevans_db mysql -u icevans -picevans123 icevans < backup-icevans.sql

# 5. Abrir phpMyAdmin
# http://localhost:8090
```
