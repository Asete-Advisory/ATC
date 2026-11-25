package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

// Coleções do analytics e dos leads do site.
//
//   - admins:    quem acessa o painel /admin do site.
//   - pageviews: um registro por página vista (sem IP; visitante e sessão são
//     ids aleatórios gerados no navegador).
//   - leads:     respostas do diagnóstico e do formulário da home.
//
// Visitas e leads só entram pelas rotas /api/atc/* (main.go), que validam os
// dados; as regras abaixo deixam a escrita direta fechada.
func init() {
	m.Register(func(app core.App) error {
		admins := core.NewAuthCollection("admins")
		ownRecord := types.Pointer("id = @request.auth.id")
		admins.ListRule = ownRecord
		admins.ViewRule = ownRecord
		admins.UpdateRule = ownRecord
		admins.Fields.Add(&core.TextField{Name: "name", Max: 120})
		// Sessão do painel: 7 dias.
		admins.AuthToken.Duration = 7 * 24 * 60 * 60
		if err := app.Save(admins); err != nil {
			return err
		}

		attribution := func(c *core.Collection) {
			c.Fields.Add(
				&core.SelectField{
					Name:      "channel",
					MaxSelect: 1,
					Values:    []string{"campaign", "search", "social", "referral", "direct"},
				},
				&core.TextField{Name: "campaign", Max: 160},
				&core.TextField{Name: "ad", Max: 160},
				&core.TextField{Name: "utm_source", Max: 80},
				&core.TextField{Name: "utm_medium", Max: 80},
				&core.TextField{Name: "referrer", Max: 160},
				&core.TextField{Name: "landing", Max: 200},
				&core.TextField{Name: "visitor", Max: 64},
				&core.TextField{Name: "session", Max: 64},
			)
		}

		pageviews := core.NewBaseCollection("pageviews")
		pageviews.Fields.Add(
			&core.TextField{Name: "path", Max: 200, Required: true},
			&core.SelectField{Name: "device", MaxSelect: 1, Values: []string{"mobile", "tablet", "desktop"}},
			&core.TextField{Name: "lang", Max: 8},
		)
		attribution(pageviews)
		pageviews.Fields.Add(&core.AutodateField{Name: "created", OnCreate: true})
		pageviews.AddIndex("idx_pageviews_created", false, "created", "")
		pageviews.AddIndex("idx_pageviews_visitor", false, "visitor", "")
		if err := app.Save(pageviews); err != nil {
			return err
		}

		adminOnly := types.Pointer(`@request.auth.collectionName = "admins"`)
		leads := core.NewBaseCollection("leads")
		leads.ListRule = adminOnly
		leads.ViewRule = adminOnly
		leads.UpdateRule = adminOnly
		leads.DeleteRule = adminOnly
		leads.Fields.Add(
			&core.SelectField{Name: "origin", MaxSelect: 1, Required: true, Values: []string{"diagnosis", "form"}},
			&core.TextField{Name: "name", Max: 160, Presentable: true},
			&core.TextField{Name: "company", Max: 160, Presentable: true},
			&core.TextField{Name: "email", Max: 200},
			&core.TextField{Name: "phone", Max: 40},
			&core.TextField{Name: "city", Max: 160},
			&core.TextField{Name: "profile", Max: 200},
			&core.TextField{Name: "locale", Max: 16},
			&core.JSONField{Name: "answers", MaxSize: 64 << 10},
			&core.TextField{Name: "message", Max: 12000},
			&core.BoolField{Name: "whatsapp"},
			&core.DateField{Name: "whatsapp_at"},
		)
		attribution(leads)
		leads.Fields.Add(
			&core.AutodateField{Name: "created", OnCreate: true},
			&core.AutodateField{Name: "updated", OnCreate: true, OnUpdate: true},
		)
		leads.AddIndex("idx_leads_created", false, "created", "")
		return app.Save(leads)
	}, func(app core.App) error {
		for _, name := range []string{"leads", "pageviews", "admins"} {
			collection, err := app.FindCollectionByNameOrId(name)
			if err != nil {
				continue
			}
			if err := app.Delete(collection); err != nil {
				return err
			}
		}
		return nil
	})
}
