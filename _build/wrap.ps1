# Assembles pages from _build/src fragments into the site root.
# Fragment format: line1 = output filename, line2 = <title>, line3 = meta description,
# line4 = active nav key (index|despre|cursuri|reunity|blog|contact|none), rest = body HTML.
# NOTE: index.html and despre.html are hand-written at the root (not built here);
# their header/footer must stay byte-identical to the templates below (verified by audit).
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$navKeys = @{ 'index'='index.html'; 'despre'='despre.html'; 'cursuri'='cursuri-programe.html'; 'evenimente'='evenimente.html'; 'reunity'='reunity-matrix.html'; 'blog'='blog.html'; 'contact'='contact.html' }

$headerTpl = @'
<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{TITLE}}</title>
<meta name="description" content="{{DESC}}">
<link rel="icon" type="image/png" href="images/symbol_colour.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,500;0,600;0,700;1,600&family=Karla:wght@400;700&family=Caveat:wght@600&display=swap&subset=latin-ext" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
<script>document.documentElement.classList.add('js');</script>
</head>
<body>

<header class="site-header">
  <div class="wrap">
    <a class="brand" href="index.html"><img src="images/Logo-Saymara-header-transparency-1.png" alt="Saymara B. Ryon — Simply Be! YourSELF"></a>
    <button class="nav-toggle" aria-expanded="false" aria-label="Deschide meniul"><span></span><span></span><span></span></button>
    <nav class="nav" aria-label="Navigare principală">
      <a href="index.html"{{A-index}}>Acasă</a>
      <a href="despre.html"{{A-despre}}>Despre</a>
      <a href="cursuri-programe.html"{{A-cursuri}}>Cursuri &amp; Programe</a>
      <a href="evenimente.html"{{A-evenimente}}>Evenimente</a>
      <a href="reunity-matrix.html"{{A-reunity}}>ReUnity MATRIX®</a>
      <a href="blog.html"{{A-blog}}>Blog</a>
      <button class="nav-lang notranslate" translate="no" type="button" aria-label="Translate to English"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/></svg><span class="nav-lang-txt">EN</span></button>
      <a class="nav-cta" href="contact.html"{{A-contact}}>Contact</a>
    </nav>
  </div>
</header>

'@

$footerTpl = @'

<!-- NEWSLETTER -->
<section class="section section--plum" style="padding-top:56px;padding-bottom:56px;">
  <div class="wrap split">
    <div class="reveal">
      <h2 style="font-size:clamp(1.5rem,3vw,2.1rem);">Înscrie-te la <em>newsletter</em></h2>
      <p class="mt-1">Inspirație, resurse și invitații la programele Simply Be! — direct în inbox.</p>
    </div>
    <form class="newsletter reveal" data-mailto data-subject="Abonare newsletter Simply Be!">
      <input type="email" name="E-mail" placeholder="Adresa ta de e-mail" required aria-label="Adresa ta de e-mail">
      <button class="btn" type="submit">Mă abonez</button>
      <p class="form-note" style="flex-basis:100%;font-size:.85rem;"></p>
    </form>
  </div>
</section>

<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <img class="sb" src="images/Logo-Saymara-header-transparency-1.png" alt="Saymara B. Ryon — Simply Be! YourSELF">
        <p>O abordare conștientă, integrativă și profund transformatoare — care te susține să îți amintești cine ești.</p>
        <div class="footer-social">
          <a href="https://www.facebook.com/h.m.iuliaioana" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.7-1.6h1.6V3.2c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.6H7.5V13h2.9v8h3.1z"/></svg></a>
          <a href="https://www.instagram.com/h.m.iuliaioana/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 8.7a3.3 3.3 0 100 6.6 3.3 3.3 0 000-6.6zm0-2.2a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm7-0.3a1.3 1.3 0 11-2.6 0 1.3 1.3 0 012.6 0zM12 4.2c-2.1 0-2.4 0-3.3.1-.8 0-1.3.2-1.6.3-.4.2-.7.4-1 .7-.3.3-.5.6-.7 1-.1.3-.3.8-.3 1.6-.1.9-.1 1.2-.1 3.3s0 2.4.1 3.3c0 .8.2 1.3.3 1.6.2.4.4.7.7 1 .3.3.6.5 1 .7.3.1.8.3 1.6.3.9.1 1.2.1 3.3.1s2.4 0 3.3-.1c.8 0 1.3-.2 1.6-.3.4-.2.7-.4 1-.7.3-.3.5-.6.7-1 .1-.3.3-.8.3-1.6.1-.9.1-1.2.1-3.3s0-2.4-.1-3.3c0-.8-.2-1.3-.3-1.6-.2-.4-.4-.7-.7-1-.3-.3-.6-.5-1-.7-.3-.1-.8-.3-1.6-.3-.9-.1-1.2-.1-3.3-.1zM12 2c2.2 0 2.4 0 3.3.1 1 0 1.6.2 2.2.4.6.2 1.1.5 1.6 1 .5.5.8 1 1 1.6.2.6.4 1.2.4 2.2.1.9.1 1.1.1 3.3s0 2.4-.1 3.3c0 1-.2 1.6-.4 2.2-.2.6-.5 1.1-1 1.6-.5.5-1 .8-1.6 1-.6.2-1.2.4-2.2.4-.9.1-1.1.1-3.3.1s-2.4 0-3.3-.1c-1 0-1.6-.2-2.2-.4-.6-.2-1.1-.5-1.6-1-.5-.5-.8-1-1-1.6-.2-.6-.4-1.2-.4-2.2C2 14.4 2 14.2 2 12s0-2.4.1-3.3c0-1 .2-1.6.4-2.2.2-.6.5-1.1 1-1.6.5-.5 1-.8 1.6-1 .6-.2 1.2-.4 2.2-.4C8.6 2 8.8 2 12 2z"/></svg></a>
          <a href="https://www.linkedin.com/in/iulia-ioana-huiduc-manolescu-7252845/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M6.9 8.6H3.4V21h3.5V8.6zM5.2 7A2.1 2.1 0 105 2.9 2.1 2.1 0 005.2 7zM21 14.2c0-3.4-1.8-5-4.2-5-1.9 0-2.8 1-3.3 1.8V8.6H10V21h3.5v-6.5c0-1.7.3-3.4 2.4-3.4 2 0 2 1.9 2 3.5V21H21v-6.8z"/></svg></a>
          <a href="https://www.tiktok.com/@h.m.iuliaioana" target="_blank" rel="noopener" aria-label="TikTok"><svg viewBox="0 0 24 24"><path d="M16.7 2h-3.2v13.6a2.9 2.9 0 11-2.9-2.9c.3 0 .6 0 .9.1V9.5a6.2 6.2 0 00-.9-.1 6.2 6.2 0 106.2 6.2V8.9A7.8 7.8 0 0021 10V6.8a4.8 4.8 0 01-4.3-4.8z"/></svg></a>
          <a href="https://www.youtube.com/@hmiuliaioana/videos" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 002.4 7.2 26.2 26.2 0 002 12a26.2 26.2 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.4a2.5 2.5 0 001.8-1.8A26.2 26.2 0 0022 12a26.2 26.2 0 00-.4-4.8zM10 15.2V8.8l5.2 3.2L10 15.2z"/></svg></a>
        </div>
      </div>
      <div>
        <h3>Navigare</h3>
        <ul>
          <li><a href="index.html">Acasă</a></li>
          <li><a href="despre.html">Despre</a></li>
          <li><a href="cursuri-programe.html">Cursuri &amp; Programe</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h3>Soluții</h3>
        <ul>
          <li><a href="reunity-matrix.html">ReUnity MATRIX®</a></li>
          <li><a href="portofoliu.html">Portofoliu</a></li>
          <li><a href="politica-cookies.html">Politică cookies</a></li>
          <li><a href="politica-de-confidentialitate.html">Confidențialitate</a></li>
          <li><a href="termeni-si-conditii.html">Termeni și Condiții</a></li>
        </ul>
      </div>
      <div>
        <h3>Contact</h3>
        <ul class="footer-contact">
          <li><svg class="ico" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>Atelier de Suflet #44,<br>București, Sector 3, 030616</span></li>
          <li><svg class="ico" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg><a href="mailto:contact@saymararyon.com">contact@saymararyon.com</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> H.M. Iulia Ioana · Simply Be! YourSELF · SC Învață să Zbori SRL</span>
      <span>Powered by <a href="https://www.technext.asia" target="_blank" rel="noopener">TechNext</a> · <a href="https://www.google.com/maps/search/?api=1&query=Atelier+de+Suflet+Bucuresti" target="_blank" rel="noopener">Vezi harta</a></span>
    </div>
  </div>
</footer>

<div class="cookiebar" role="dialog" aria-label="Notificare cookie-uri">
  <p>Acest site folosește cookie-uri pentru o experiență mai bună de navigare. Detalii în <a href="politica-cookies.html">Politica de cookies</a>.</p>
  <button class="btn btn--light" type="button">Am înțeles</button>
</div>

<script src="js/main.js"></script>
</body>
</html>
'@

Get-ChildItem "$PSScriptRoot\src\*.html" | ForEach-Object {
  $lines = Get-Content $_.FullName -Encoding UTF8
  $out = $lines[0].Trim(); $title = $lines[1].Trim(); $desc = $lines[2].Trim(); $active = $lines[3].Trim()
  $body = ($lines[4..($lines.Count-1)] -join "`r`n")
  $head = $headerTpl -replace '\{\{TITLE\}\}', $title -replace '\{\{DESC\}\}', $desc
  foreach ($k in $navKeys.Keys) {
    $mark = if ($k -eq $active) { ' class="is-active"' } else { '' }
    $head = $head -replace ('\{\{A-' + $k + '\}\}'), $mark
  }
  # Any nav key not present as active still needs its placeholder cleared:
  $head = $head -replace '\{\{A-[a-z]+\}\}', ''
  $html = $head + $body + $footerTpl
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText("$root\$out", $html, $utf8)
  Write-Output "built $out ($([int]($html.Length/1KB))KB)"
}
