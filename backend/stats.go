package main

import (
	"fmt"
	"net/http"
	"sort"
	"time"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

const (
	dayLayout = "2006-01-02"
	// Formato das datas do PocketBase (texto UTC, comparável em ordem).
	dbLayout = "2006-01-02 15:04:05.000Z"
	maxDays  = 400
)

var saoPaulo = mustLocation("America/Sao_Paulo")

func mustLocation(name string) *time.Location {
	location, err := time.LoadLocation(name)
	if err != nil {
		return time.FixedZone("BRT", -3*60*60)
	}
	return location
}

type period struct {
	From, To   time.Time // início do dia de From e início do dia seguinte a To
	FromS, ToS string    // limites em UTC para o SQL
	Days       int
}

// parsePeriod lê ?from=AAAA-MM-DD&to=AAAA-MM-DD (dias de São Paulo,
// inclusivos). Sem datas: últimos 30 dias.
func parsePeriod(e *core.RequestEvent) period {
	query := e.Request.URL.Query()
	today := time.Now().In(saoPaulo)
	today = time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, saoPaulo)

	to, err := time.ParseInLocation(dayLayout, query.Get("to"), saoPaulo)
	if err != nil || to.After(today) {
		to = today
	}
	from, err := time.ParseInLocation(dayLayout, query.Get("from"), saoPaulo)
	if err != nil || from.After(to) {
		from = to.AddDate(0, 0, -29)
	}
	if to.Sub(from) > maxDays*24*time.Hour {
		from = to.AddDate(0, 0, -maxDays+1)
	}
	return newPeriod(from, to)
}

func newPeriod(from, to time.Time) period {
	end := to.AddDate(0, 0, 1)
	return period{
		From:  from,
		To:    end,
		FromS: from.UTC().Format(dbLayout),
		ToS:   end.UTC().Format(dbLayout),
		Days:  int(end.Sub(from).Hours()/24 + 0.5),
	}
}

// Período anterior com o mesmo número de dias, para comparação.
func (p period) previous() period {
	return newPeriod(p.From.AddDate(0, 0, -p.Days), p.From.AddDate(0, 0, -1))
}

func (p period) params() dbx.Params {
	return dbx.Params{"from": p.FromS, "to": p.ToS}
}

// sqliteOffset devolve o modificador do SQLite ("-3 hours") para agrupar
// por dia local.
func (p period) sqliteOffset() string {
	_, seconds := p.From.Zone()
	return fmt.Sprintf("%+d hours", seconds/3600)
}

type totals struct {
	Pageviews      int `db:"pageviews" json:"pageviews"`
	Visitors       int `db:"visitors" json:"visitors"`
	Sessions       int `db:"sessions" json:"sessions"`
	Leads          int `db:"leads" json:"leads"`
	LeadsDiagnosis int `db:"leads_diagnosis" json:"leadsDiagnosis"`
	LeadsForm      int `db:"leads_form" json:"leadsForm"`
	WhatsApp       int `db:"whatsapp" json:"whatsapp"`
}

type dailyRow struct {
	Date      string `db:"day" json:"date"`
	Pageviews int    `db:"pageviews" json:"pageviews"`
	Visitors  int    `db:"visitors" json:"visitors"`
	Leads     int    `db:"leads" json:"leads"`
}

type channelRow struct {
	Channel  string `db:"channel" json:"channel"`
	Visitors int    `db:"visitors" json:"visitors"`
	Sessions int    `db:"sessions" json:"sessions"`
	Leads    int    `db:"leads" json:"leads"`
}

type campaignRow struct {
	Campaign  string `db:"campaign" json:"campaign"`
	Ad        string `db:"ad" json:"ad"`
	Source    string `db:"utm_source" json:"source"`
	Visitors  int    `db:"visitors" json:"visitors"`
	Sessions  int    `db:"sessions" json:"sessions"`
	Pageviews int    `db:"pageviews" json:"pageviews"`
	Leads     int    `db:"leads" json:"leads"`
}

type pageRow struct {
	Path      string `db:"path" json:"path"`
	Pageviews int    `db:"pageviews" json:"pageviews"`
	Visitors  int    `db:"visitors" json:"visitors"`
}

type labelRow struct {
	Label    string `db:"label" json:"label"`
	Visitors int    `db:"visitors" json:"visitors"`
}

func loadTotals(app core.App, p period) (totals, error) {
	var t totals
	err := app.DB().NewQuery(`
		SELECT COUNT(*) AS pageviews,
		       COUNT(DISTINCT visitor) AS visitors,
		       COUNT(DISTINCT session) AS sessions
		FROM pageviews WHERE created >= {:from} AND created < {:to}
	`).Bind(p.params()).One(&t)
	if err != nil {
		return t, err
	}

	var l totals
	err = app.DB().NewQuery(`
		SELECT COUNT(*) AS leads,
		       COALESCE(SUM(origin = 'diagnosis'), 0) AS leads_diagnosis,
		       COALESCE(SUM(origin = 'form'), 0) AS leads_form,
		       COALESCE(SUM(whatsapp = TRUE), 0) AS whatsapp
		FROM leads WHERE created >= {:from} AND created < {:to}
	`).Bind(p.params()).One(&l)
	t.Leads, t.LeadsDiagnosis, t.LeadsForm, t.WhatsApp = l.Leads, l.LeadsDiagnosis, l.LeadsForm, l.WhatsApp
	return t, err
}

func handleStats(e *core.RequestEvent) error {
	p := parsePeriod(e)
	db := e.App.DB()
	params := p.params()
	params["offset"] = p.sqliteOffset()

	current, err := loadTotals(e.App, p)
	if err != nil {
		return err
	}
	previous, err := loadTotals(e.App, p.previous())
	if err != nil {
		return err
	}

	// Série diária, com dias sem visitas preenchidos com zero.
	var visits, leadDays []dailyRow
	if err := db.NewQuery(`
		SELECT strftime('%Y-%m-%d', created, {:offset}) AS day,
		       COUNT(*) AS pageviews, COUNT(DISTINCT visitor) AS visitors
		FROM pageviews WHERE created >= {:from} AND created < {:to}
		GROUP BY day
	`).Bind(params).All(&visits); err != nil {
		return err
	}
	if err := db.NewQuery(`
		SELECT strftime('%Y-%m-%d', created, {:offset}) AS day, COUNT(*) AS leads
		FROM leads WHERE created >= {:from} AND created < {:to}
		GROUP BY day
	`).Bind(params).All(&leadDays); err != nil {
		return err
	}
	byDay := map[string]*dailyRow{}
	daily := make([]dailyRow, 0, p.Days)
	for day := p.From; day.Before(p.To); day = day.AddDate(0, 0, 1) {
		daily = append(daily, dailyRow{Date: day.Format(dayLayout)})
	}
	for i := range daily {
		byDay[daily[i].Date] = &daily[i]
	}
	for _, row := range visits {
		if target := byDay[row.Date]; target != nil {
			target.Pageviews, target.Visitors = row.Pageviews, row.Visitors
		}
	}
	for _, row := range leadDays {
		if target := byDay[row.Date]; target != nil {
			target.Leads = row.Leads
		}
	}

	// Canais (anúncios, busca, redes sociais, outros sites, direto).
	var channels, channelLeads []channelRow
	if err := db.NewQuery(`
		SELECT COALESCE(NULLIF(channel, ''), 'direct') AS channel,
		       COUNT(DISTINCT visitor) AS visitors, COUNT(DISTINCT session) AS sessions
		FROM pageviews WHERE created >= {:from} AND created < {:to}
		GROUP BY 1
	`).Bind(params).All(&channels); err != nil {
		return err
	}
	if err := db.NewQuery(`
		SELECT COALESCE(NULLIF(channel, ''), 'direct') AS channel, COUNT(*) AS leads
		FROM leads WHERE created >= {:from} AND created < {:to}
		GROUP BY 1
	`).Bind(params).All(&channelLeads); err != nil {
		return err
	}
	channels = mergeChannels(channels, channelLeads)

	// Campanhas e anúncios.
	var campaigns, campaignLeads []campaignRow
	if err := db.NewQuery(`
		SELECT campaign, ad, MAX(utm_source) AS utm_source,
		       COUNT(DISTINCT visitor) AS visitors, COUNT(DISTINCT session) AS sessions,
		       COUNT(*) AS pageviews
		FROM pageviews
		WHERE created >= {:from} AND created < {:to} AND (campaign != '' OR ad != '')
		GROUP BY campaign, ad
	`).Bind(params).All(&campaigns); err != nil {
		return err
	}
	if err := db.NewQuery(`
		SELECT campaign, ad, MAX(utm_source) AS utm_source, COUNT(*) AS leads
		FROM leads
		WHERE created >= {:from} AND created < {:to} AND (campaign != '' OR ad != '')
		GROUP BY campaign, ad
	`).Bind(params).All(&campaignLeads); err != nil {
		return err
	}
	campaigns = mergeCampaigns(campaigns, campaignLeads)

	var pages []pageRow
	if err := db.NewQuery(`
		SELECT path, COUNT(*) AS pageviews, COUNT(DISTINCT visitor) AS visitors
		FROM pageviews WHERE created >= {:from} AND created < {:to}
		GROUP BY path ORDER BY pageviews DESC LIMIT 10
	`).Bind(params).All(&pages); err != nil {
		return err
	}

	// Origem: utm_source do link ou, sem ele, o site que enviou a visita.
	var referrers []labelRow
	if err := db.NewQuery(`
		SELECT LOWER(COALESCE(NULLIF(utm_source, ''), referrer)) AS label,
		       COUNT(DISTINCT visitor) AS visitors
		FROM pageviews
		WHERE created >= {:from} AND created < {:to} AND (utm_source != '' OR referrer != '')
		GROUP BY 1 ORDER BY visitors DESC LIMIT 10
	`).Bind(params).All(&referrers); err != nil {
		return err
	}

	var devices []labelRow
	if err := db.NewQuery(`
		SELECT COALESCE(NULLIF(device, ''), 'desktop') AS label, COUNT(DISTINCT visitor) AS visitors
		FROM pageviews WHERE created >= {:from} AND created < {:to}
		GROUP BY 1 ORDER BY visitors DESC
	`).Bind(params).All(&devices); err != nil {
		return err
	}

	return e.JSON(http.StatusOK, map[string]any{
		"range": map[string]any{
			"from": p.From.Format(dayLayout),
			"to":   p.To.AddDate(0, 0, -1).Format(dayLayout),
			"days": p.Days,
		},
		"totals":    current,
		"previous":  previous,
		"daily":     daily,
		"channels":  channels,
		"campaigns": campaigns,
		"pages":     nonNil(pages),
		"referrers": nonNil(referrers),
		"devices":   nonNil(devices),
	})
}

func nonNil[T any](rows []T) []T {
	if rows == nil {
		return []T{}
	}
	return rows
}

func mergeChannels(visits, leads []channelRow) []channelRow {
	byChannel := map[string]*channelRow{}
	result := make([]channelRow, 0, 5)
	for _, name := range []string{"campaign", "search", "social", "referral", "direct"} {
		result = append(result, channelRow{Channel: name})
	}
	for i := range result {
		byChannel[result[i].Channel] = &result[i]
	}
	for _, row := range visits {
		if target := byChannel[row.Channel]; target != nil {
			target.Visitors, target.Sessions = row.Visitors, row.Sessions
		}
	}
	for _, row := range leads {
		if target := byChannel[row.Channel]; target != nil {
			target.Leads = row.Leads
		}
	}
	sort.SliceStable(result, func(i, j int) bool { return result[i].Visitors > result[j].Visitors })
	return result
}

func mergeCampaigns(visits, leads []campaignRow) []campaignRow {
	key := func(row campaignRow) string { return row.Campaign + "\x00" + row.Ad }
	byKey := map[string]int{}
	result := append([]campaignRow{}, visits...)
	for i, row := range result {
		byKey[key(row)] = i
	}
	for _, row := range leads {
		if i, ok := byKey[key(row)]; ok {
			result[i].Leads = row.Leads
			continue
		}
		// Lead de um anúncio cuja visita ficou fora do período.
		byKey[key(row)] = len(result)
		result = append(result, row)
	}
	sort.SliceStable(result, func(i, j int) bool {
		if result[i].Leads != result[j].Leads {
			return result[i].Leads > result[j].Leads
		}
		return result[i].Visitors > result[j].Visitors
	})
	if len(result) > 50 {
		result = result[:50]
	}
	return result
}
