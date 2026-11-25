# Backend ATC (PocketBase)

Analytics de acessos e leads dos formulários do site, lidos pelo painel `/admin`.

```sh
go run . serve            # http://127.0.0.1:8090 (dados em ./pb_data)
ATC_ADMIN_EMAIL=voce@exemplo.com ATC_ADMIN_PASSWORD=... go run . serve
```

| Rota | Acesso | Uso |
|------|--------|-----|
| `POST /api/atc/pageviews` | pública (via site) | página vista |
| `POST /api/atc/leads` | pública (via site) | lead do diagnóstico ou do formulário |
| `POST /api/atc/leads/{id}/whatsapp` | pública (via site) | lead abriu o WhatsApp |
| `GET /api/atc/stats?from=&to=` | admins / superusuários | números do painel |
| `GET /api/atc/leads/export?from=&to=` | admins / superusuários | CSV dos leads |

Coleções: `admins` (login do painel), `pageviews` e `leads`. Datas agrupadas no
horário de Brasília.
