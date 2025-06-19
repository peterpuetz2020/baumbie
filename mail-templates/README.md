# Mail-Templates

Dieser Ordner enthält MJML-Templates für die E-Mails, die wir mittels Supabase versenden.

# Verwendung

Die Templates müssen mittels MJML in HTML umgewandelt werden. Dies kann über die Kommandozeile erfolgen, bspw. über:

```bash
npx mjml mail-templates/signup.mjml -o mail-templates/signup.html
```

Die generierte HTML-Datei kann dann in Supabase unter "Authentication" -> "Emails" hochgeladen werden.

**WICHTIG:**
Platzhalter in den Templates müssen in der Form `{{ placeholder }}` angegeben werden, damit sie von Supabase korrekt
ersetzt werden können - da MJML aber diese Handlebars selbst auch intern verwendet, müssen diese nachträglich ersetzt
werden, bevor das Template bei Supabase hinterlegt wird.