# Generates _build/src/galerie.html covering EVERY image in /images (except tiny UI glyphs already in chrome).
$ErrorActionPreference = 'Stop'
$site = Split-Path $PSScriptRoot -Parent
$imgDir = "$site\images"

# Images that are part of the site chrome / decorative (shown elsewhere) — still list most, skip only pure UI glyphs.
$skip = @('symbol_colour.png','sol-ceriza.webp','sal-ceriza.webp','Logo-Saymara-header-transparency-1.png','Simply-Be.png','semnatura-color.png')

$captions = @{
  '@hmiuliaioana2.jpg'='Ilustrație în acuarelă — H.M. Iulia Ioana';
  '1.png'='EBW'; '3.png'='Institut Kutschera Austria'; '4.png'='Institut Kutschera România';
  '6.png'='Institut Kutschera — simbol'; '7.png'='TRE For All, Inc.'; '10.png'='CMA — Complementary Medical Association UK';
  '11.png'='Crimson Circle'; '9.png'='vreausoluție.ro'; '8-1.png'='MerlinArt';
  '7-1-e1709402845914.png'='Asociația Învață să Zbori'; 'merlin-1-1536x1324-1.png'='MerlinArt — mandală';
  'vreau-1536x1325-1.png'='vreausoluție.ro — simbol'; 'Untitled-design10.png'='edukiwi School';
  'Untitled-design12.png'='Points of You® — Creative Tools';
  '2-1.jpg'='Art-terapie — femeie care udă o plantă simbolică'; '30-1.jpg'='Grup de oameni bucuroși în cerc';
  '36-1.jpg'='Comunitatea văzută de sus'; '37-1.jpg'='Relaxare somatică în lucru individual';
  '39-1.jpg'='Metoda Resonanz — piese care se îmbină'; '9-1.jpg'='Oameni celebrând pe vârf de munte';
  '9-2.jpg'='Oameni celebrând pe stâncă, la răsărit';
  '64abbab5-cab9-4a94-bfc7-f447812a48b3.jpg'='H.M. Iulia Ioana — portret';
  'bonus-resetare-emotionala.png'='Bonus PDF — Resetare emoțională, 7 zile';
  'Background-Image-Template.jpg'='Iulia Ioana — portret în natură';
  'Background-Image-Template2.jpg'='Răsărit peste apă și munți';
  'Background-Image-Template3.jpg'='Iulia Ioana pe malul mării';
  'Background-Image-Template3-1.jpg'='Matrix — peisaj digital';
  'business-and-deadlines-P6MPLG7.jpg'='Spațiu de lucru — laptop';
  'business-workstation-PRB5Z2M.jpg'='Birou cu laptop și cafea';
  'casually-dressed-businessmen-and-businesswomen-JBQF5KC.jpg'='Echipă în spațiu de coworking';
  'cropped-Peach-Welcome-Email-Header2.png'='Iulia Ioana — portret, fundal piersică';
  'CVC01.jpg'='Cartea Vieții Conștiente — planner art-terapeutic';
  'desk-plant-and-clock-LYEC28M.jpg'='Birou minimalist cu plantă și ceas';
  'embedded-01.jpg'='Inimă anatomică din lumină';
  'Gallery-List-Image-Template1.jpg'='eBook „Eu sunt EU și e OK!"';
  'Gallery-List-Image-Template1-1.jpg'='Asociația Învață să Zbori — pană și stol';
  'Gallery-List-Image-Template2.jpg'='iSentinel — protecție seismică inteligentă';
  'Gallery-List-Image-Template3.jpg'='Femei creative lucrând împreună';
  'Gallery-List-Image-Template4.jpg'='Colaj de portrete — aspectele sinelui';
  'Gallery-List-Image-Template5.jpg'='Mandală colorată lucrată manual';
  'Gallery-List-Image-Template6.jpg'='Alegere conștientă — bol cu semințe';
  'Gallery-List-Image-Template7.jpg'='Femeie la răsărit, cu brațele deschise';
  'group-of-happy-young-people-PHNR8U7.jpg'='Grup de tineri veseli';
  'group-of-high-school-students-with-female-teacher-X8D9B7H.jpg'='Elevi cu profesoara lor';
  'happy-young-blonde-girl-sitting-on-a-floor-GXWY7HK.jpg'='Tânără relaxată, zâmbind';
  'high-school-tutor-sitting-at-desk-with-female-BKHVWRX.jpg'='Mentor și cursantă la birou';
  'IMG_3721.jpg'='Lucrare de art-terapie — colaj de portrete';
  'IMG_4188.jpg'='Grup de participanți la o formare';
  'IMG_4188-scaled.jpg'='Grup integrativ de lucru';
  'IMG_4235.jpg'='Inimă stilizată din lumină';
  'IMG_7783.jpg'='Iulia Ioana în natură, peisaj montan';
  'iulia-portrait-1.jpg'='Iulia Ioana — portret';
  'iulia-portrait-2.jpg'='Iulia Ioana în studioul de lucru';
  'iulia-portrait-3.jpg'='Iulia Ioana în sesiune de coaching';
  'iulia-portrait-4.jpg'='Iulia Ioana facilitând o clasă TRE®';
  'iulia-portrait-5.jpg'='Iulia Ioana prezentând în fața unui grup';
  'iulia-portrait-6.jpg'='Iulia Ioana la birou, în mentorat';
  'logo_EducaTIFF-removebg-preview.png'='EducaTIFF'; 'Logo-iSentinel-600px.jpg'='iSentinel';
  'logo-Lidl.png'='Lidl'; 'logo-net-AsIZ.jpg'='Asociația Învață să Zbori';
  'logo-preh-simplu.png'='Preh'; 'Logos-pt-website-H.M.-Iulia-Ioana1.png'='Centre of Excellence — Certified';
  'Logo-Zepter.jpg'='Zepter International România';
  'Bianca-Parfene.jpg'='Bianca Parfene'; 'Marilena.jpg'='Marilena'; 'Mona.jpg'='Mona';
  'Monica-D-e1738026678772.jpg'='Monica D.'; 'Raluca-Rad-e1738023348957.jpg'='Raluca Rad'; 'Tatiana-C.jpg'='Tatiana C.';
  'Redescopera-Echilibru-cu-TRE-incepatori-@-Sambodhi.jpg'='Afiș — Redescoperă Echilibrul cu TRE®';
  'smiling-girl-on-a-famous-street-GFLMX4Z.jpg'='Femeie zâmbind pe stradă';
  'smiling-man-with-laptop-indoors-B3U679G.jpg'='Bărbat relaxat cu laptop';
  'smiling-people-with-craft-beer-PU5U9MA.jpg'='Grup de prieteni bucuroși';
  'smiling-young-man-with-a-screenplay-C9XS23Y.jpg'='Tânăr citind un scenariu';
  'teamwork-together-professional-occupation-concept-PL9Q9XJ.jpg'='Colaborare în echipă';
  'Template-Ab-text-continut-500-380-px3.jpg'='Grup de lucru facilitat';
  'Untitled-design9.jpg'='Mână ridicată spre soare, cu halo de lumină';
  'WhatsApp-Image-2024-03-02-at-13.13.43-e1709402810661.jpeg'='TRE® România — din 2017';
  'wind-river-range-F4PB79X.jpg'='Peisaj montan — Wind River Range';
  'woman-side-view-close-eyes-thinking-concept-PTKET4T.jpg'='Femeie în introspecție';
  'woman-standing-among-colorful-origami-PZ9GKAU.jpg'='Femeie printre origami colorate';
  'woman-working-on-a-laptop-J5YMA9W.jpg'='Femeie citind pe laptop';
  'wooden-table-VKCH2UB.jpg'='Detaliu cald — lumânare și con de brad';
  'gravatar-author.jpg'='Avatar autor — H.M. Iulia Ioana';
}

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('galerie.html')
[void]$sb.AppendLine('Galerie foto — Simply Be! YourSELF | Saymara B. Ryon')
[void]$sb.AppendLine('Galeria completă de imagini din universul Simply Be!: portrete, programe, art-terapie, parteneri și momente din formari.')
[void]$sb.AppendLine('galerie')
[void]$sb.AppendLine('<section class="page-hero">')
[void]$sb.AppendLine('  <img class="sun" src="images/sol-ceriza.webp" alt="" aria-hidden="true">')
[void]$sb.AppendLine('  <div class="wrap">')
[void]$sb.AppendLine('    <p class="breadcrumb"><a href="index.html">Acasă</a> · Galerie</p>')
[void]$sb.AppendLine('    <h1>Galerie <em>foto</em></h1>')
[void]$sb.AppendLine('    <p class="lead mt-2">Un album din universul Simply Be! — portrete, programe, art-terapie, parteneri și momente din formari.</p>')
[void]$sb.AppendLine('  </div>')
[void]$sb.AppendLine('</section>')
[void]$sb.AppendLine('<section class="section">')
[void]$sb.AppendLine('  <div class="wrap">')
[void]$sb.AppendLine('    <div class="gallery-grid">')

$count = 0
Get-ChildItem $imgDir | Sort-Object Name | ForEach-Object {
  if ($skip -contains $_.Name) { return }
  $cap = $captions[$_.Name]
  if (-not $cap) { $cap = ($_.BaseName -replace '[-_]',' ') }
  $capEsc = $cap -replace '&','&amp;' -replace '"','&quot;'
  [void]$sb.AppendLine("      <figure class=""reveal""><img src=""images/$($_.Name)"" alt=""$capEsc"" loading=""lazy""><figcaption>$capEsc</figcaption></figure>")
  $count++
}
[void]$sb.AppendLine('    </div>')
[void]$sb.AppendLine('  </div>')
[void]$sb.AppendLine('</section>')

$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("$PSScriptRoot\src\galerie.html", $sb.ToString(), $utf8)
Write-Output "galerie.html fragment written with $count images"
