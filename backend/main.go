// Backend do site ATC China Brasil: analytics de acessos e leads dos
// formulários, em PocketBase.
//
// O site (Next.js) recebe os eventos do navegador e repassa para cá pela rede
// interna; o painel /admin do site lê as estatísticas e os leads com o token de
// um registro da coleção "admins".
package main

import (
	"log"
	"os"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "atcchinabrasil/backend/migrations"
	_ "time/tzdata" // fuso de São Paulo mesmo em imagens sem tzdata
)

func main() {
	app := pocketbase.New()

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// As migrações são escritas em Go (pasta migrations/).
		Automigrate: false,
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		if err := ensureAdmin(se.App); err != nil {
			return err
		}

		group := se.Router.Group("/api/atc")
		// Rotas públicas, chamadas pelo servidor do site.
		group.POST("/pageviews", handlePageview).Bind(apis.BodyLimit(16 << 10))
		group.POST("/leads", handleLead).Bind(apis.BodyLimit(128 << 10))
		group.POST("/leads/{id}/whatsapp", handleLeadWhatsApp)

		// Rotas do painel.
		group.GET("/stats", handleStats).Bind(apis.RequireAuth("admins", core.CollectionNameSuperusers))
		group.GET("/leads/export", handleLeadsExport).Bind(apis.RequireAuth("admins", core.CollectionNameSuperusers))

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

// ensureAdmin garante o acesso ao painel com ATC_ADMIN_EMAIL e
// ATC_ADMIN_PASSWORD: cria o admin se não existir e, se já existir, aplica a
// senha atual da variável (para trocar a senha, basta mudar e reiniciar).
// Erros só vão para o log; o backend sobe mesmo assim.
func ensureAdmin(app core.App) error {
	email := strings.ToLower(strings.TrimSpace(os.Getenv("ATC_ADMIN_EMAIL")))
	password := os.Getenv("ATC_ADMIN_PASSWORD")
	if email == "" || password == "" {
		log.Printf("[painel] ATC_ADMIN_EMAIL ou ATC_ADMIN_PASSWORD não chegou ao container (e-mail definido: %t, senha definida: %t)", email != "", password != "")
		return nil
	}

	record, err := app.FindAuthRecordByEmail("admins", email)
	if err == nil {
		if record.ValidatePassword(password) {
			log.Printf("[painel] Admin %s conferido: a senha já confere", email)
			return nil
		}
	} else {
		collection, err := app.FindCollectionByNameOrId("admins")
		if err != nil {
			return err
		}
		record = core.NewRecord(collection)
		record.SetEmail(email)
		record.SetVerified(true)
	}
	created := record.IsNew()
	record.SetPassword(password)

	if err := app.Save(record); err != nil {
		// Ex.: senha com menos de 8 caracteres ou e-mail inválido.
		log.Printf("[painel] Não foi possível salvar o admin %s (senha precisa de 8+ caracteres): %v", email, err)
		return nil
	}
	if created {
		log.Printf("[painel] Admin %s criado", email)
	} else {
		log.Printf("[painel] Senha do admin %s atualizada", email)
	}
	return nil
}
