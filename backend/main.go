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

// ensureAdmin cria o primeiro acesso ao painel a partir de ATC_ADMIN_EMAIL e
// ATC_ADMIN_PASSWORD. Não altera a senha de um admin que já existe.
func ensureAdmin(app core.App) error {
	email := strings.TrimSpace(os.Getenv("ATC_ADMIN_EMAIL"))
	password := os.Getenv("ATC_ADMIN_PASSWORD")
	if email == "" || password == "" {
		return nil
	}

	if _, err := app.FindAuthRecordByEmail("admins", email); err == nil {
		return nil
	}

	collection, err := app.FindCollectionByNameOrId("admins")
	if err != nil {
		return err
	}
	record := core.NewRecord(collection)
	record.SetEmail(email)
	record.SetPassword(password)
	record.SetVerified(true)
	if err := app.Save(record); err != nil {
		return err
	}
	app.Logger().Info("Admin do painel criado", "email", email)
	return nil
}
