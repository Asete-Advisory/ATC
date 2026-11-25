package main

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

var channelNames = map[string]string{
	"campaign": "Anúncios e campanhas",
	"search":   "Busca orgânica",
	"social":   "Redes sociais",
	"referral": "Outros sites",
	"direct":   "Direto",
}

var originNames = map[string]string{
	"diagnosis": "Diagnóstico",
	"form":      "Formulário da home",
}

// handleLeadsExport gera um CSV (separado por ";" e com BOM, para abrir direto
// no Excel em português) com os leads do período.
func handleLeadsExport(e *core.RequestEvent) error {
	p := parsePeriod(e)
	query := e.App.RecordQuery("leads").
		AndWhere(dbx.NewExp("created >= {:from} AND created < {:to}", p.params())).
		OrderBy("created DESC")
	if origin := e.Request.URL.Query().Get("origin"); origin == "diagnosis" || origin == "form" {
		query = query.AndWhere(dbx.HashExp{"origin": origin})
	}

	var records []*core.Record
	if err := query.All(&records); err != nil {
		return err
	}

	var buffer bytes.Buffer
	buffer.WriteString("\xef\xbb\xbf") // BOM: acentos certos no Excel
	writer := csv.NewWriter(&buffer)
	writer.Comma = ';'
	writer.Write([]string{
		"Data", "Origem", "Nome", "Empresa", "Cidade", "WhatsApp", "E-mail", "Perfil",
		"Canal", "Campanha", "Anúncio", "Fonte (utm_source)", "Abriu o WhatsApp", "Respostas",
	})
	for _, record := range records {
		var answers []leadAnswer
		_ = json.Unmarshal([]byte(record.GetString("answers")), &answers)
		parts := make([]string, 0, len(answers))
		for _, answer := range answers {
			if answer.Label != "" {
				parts = append(parts, answer.Label+": "+answer.Value)
			} else {
				parts = append(parts, answer.Value)
			}
		}
		whatsapp := "Não"
		if record.GetBool("whatsapp") {
			whatsapp = "Sim"
		}
		writer.Write([]string{
			record.GetDateTime("created").Time().In(saoPaulo).Format("02/01/2006 15:04"),
			originNames[record.GetString("origin")],
			record.GetString("name"),
			record.GetString("company"),
			record.GetString("city"),
			record.GetString("phone"),
			record.GetString("email"),
			record.GetString("profile"),
			channelNames[record.GetString("channel")],
			record.GetString("campaign"),
			record.GetString("ad"),
			record.GetString("utm_source"),
			whatsapp,
			strings.Join(parts, " | "),
		})
	}
	writer.Flush()

	filename := "leads-atc-" + p.From.Format(dayLayout) + "-a-" + p.To.AddDate(0, 0, -1).Format(dayLayout) + ".csv"
	e.Response.Header().Set("Content-Disposition", `attachment; filename="`+filename+`"`)
	return e.Blob(http.StatusOK, "text/csv; charset=utf-8", buffer.Bytes())
}
