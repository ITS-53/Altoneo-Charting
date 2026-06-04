<#
.SYNOPSIS
    Helpers PowerShell pour générer des rapports HTML à l'identité Altonéo.

.DESCRIPTION
    Ce module produit des fragments HTML utilisant les classes `alt-*` de
    dist/altoneo.css. La fonction New-AltoneoReport embarque la CSS *inline*,
    donc le rapport final est un fichier .html autonome (aucune dépendance,
    idéal pour l'archivage ou l'envoi par e-mail).

    Compatible Windows PowerShell 5.1 et PowerShell 7+.

.EXAMPLE
    Import-Module ./Altoneo.psm1
    $body  = New-AltoneoCard -Title "Synthèse" -Body "<p>Bonjour</p>"
    New-AltoneoReport -Title "Mon rapport" -Body $body -Path .\rapport.html
#>

# ------------------------------------------------------------------ utilitaires

function ConvertTo-AltHtml {
    param([string]$Text)
    if ($null -eq $Text) { return "" }
    return ($Text -replace '&', '&amp;' -replace '<', '&lt;' -replace '>', '&gt;' -replace '"', '&quot;')
}

function Get-AltoneoCss {
    <# Retourne le contenu de dist/altoneo.css. #>
    [CmdletBinding()]
    param([string]$CssPath)
    if (-not $CssPath) {
        $CssPath = Join-Path $PSScriptRoot '..\dist\altoneo.css'
    }
    if (-not (Test-Path $CssPath)) {
        throw "Feuille de style introuvable : $CssPath"
    }
    return (Get-Content -Path $CssPath -Raw -Encoding UTF8)
}

# ------------------------------------------------------------------ composants

function New-AltoneoBadge {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, Position = 0)][string]$Text,
        [ValidateSet('neutral','info','success','warning','error','navy','gold',
                     'pending','sent','partial','completed','draft')]
        [string]$Variant = 'neutral'
    )
    return "<span class=`"alt-badge alt-badge--$Variant`">$(ConvertTo-AltHtml $Text)</span>"
}

function New-AltoneoButton {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, Position = 0)][string]$Text,
        [ValidateSet('primary','secondary','navy','danger','ghost')][string]$Variant = 'primary',
        [string]$Href
    )
    $cls = "alt-btn alt-btn--$Variant"
    if ($Href) { return "<a class=`"$cls`" href=`"$Href`">$(ConvertTo-AltHtml $Text)</a>" }
    return "<button class=`"$cls`">$(ConvertTo-AltHtml $Text)</button>"
}

function New-AltoneoAlert {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, Position = 0)][string]$Message,
        [ValidateSet('info','success','warning','error')][string]$Variant = 'info',
        [string]$Title
    )
    $titleHtml = if ($Title) { "<p class=`"alt-alert__title`">$(ConvertTo-AltHtml $Title)</p>" } else { "" }
    return "<div class=`"alt-alert alt-alert--$Variant`"><div>$titleHtml$(ConvertTo-AltHtml $Message)</div></div>"
}

function New-AltoneoStat {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Label,
        [Parameter(Mandatory)][string]$Value,
        [Nullable[double]]$Delta,
        [string]$DeltaSuffix = '%'
    )
    $deltaHtml = ""
    if ($null -ne $Delta) {
        $dir = if ($Delta -ge 0) { 'up' } else { 'down' }
        $arrow = if ($Delta -ge 0) { '▲' } else { '▼' }
        $abs = [math]::Abs($Delta)
        $deltaHtml = "<span class=`"alt-stat__delta alt-stat__delta--$dir`">$arrow $abs$DeltaSuffix</span>"
    }
    return @"
<div class="alt-stat">
  <p class="alt-stat__label">$(ConvertTo-AltHtml $Label)</p>
  <p class="alt-stat__value">$(ConvertTo-AltHtml $Value)</p>
  $deltaHtml
</div>
"@
}

function New-AltoneoCard {
    [CmdletBinding()]
    param(
        [string]$Title,
        [string]$Subtitle,
        [Parameter(Mandatory)][string]$Body,
        [string]$Footer
    )
    $header = ""
    if ($Title -or $Subtitle) {
        $sub = if ($Subtitle) { "<p class=`"alt-card__subtitle`">$(ConvertTo-AltHtml $Subtitle)</p>" } else { "" }
        $header = "<div class=`"alt-card__header`"><h3 class=`"alt-card__title`">$(ConvertTo-AltHtml $Title)</h3>$sub</div>"
    }
    $foot = if ($Footer) { "<div class=`"alt-card__footer`">$Footer</div>" } else { "" }
    return "<div class=`"alt-card`">$header<div class=`"alt-card__body`">$Body</div>$foot</div>"
}

function New-AltoneoTable {
    <#
    .SYNOPSIS Construit un <table> Altonéo depuis une collection d'objets.
    .PARAMETER Data      Tableau d'objets (PSCustomObject/hashtable).
    .PARAMETER Columns   Ordre/sélection des colonnes (défaut : toutes les propriétés).
    .PARAMETER RawColumns Colonnes dont les valeurs sont déjà du HTML (badges…) : non échappées.
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][object[]]$Data,
        [string[]]$Columns,
        [string[]]$RawColumns = @(),
        [switch]$Striped
    )
    if (-not $Columns -or $Columns.Count -eq 0) {
        $Columns = $Data[0].PSObject.Properties.Name
    }
    $thead = ($Columns | ForEach-Object { "<th>$(ConvertTo-AltHtml $_)</th>" }) -join ''
    $rows = foreach ($row in $Data) {
        $cells = foreach ($col in $Columns) {
            $val = $row.$col
            if ($RawColumns -contains $col) { "<td>$val</td>" }
            else { "<td>$(ConvertTo-AltHtml ([string]$val))</td>" }
        }
        "<tr>$($cells -join '')</tr>"
    }
    $cls = "alt-table alt-table--bordered"
    if ($Striped) { $cls += " alt-table--striped" }
    return "<table class=`"$cls`"><thead><tr>$thead</tr></thead><tbody>$($rows -join '')</tbody></table>"
}

function New-AltoneoSection {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Title,
        [Parameter(Mandatory)][string]$Body
    )
    return "<section style=`"margin-bottom:2rem;`"><h2 class=`"alt-h2`">$(ConvertTo-AltHtml $Title)</h2>$Body</section>"
}

# ------------------------------------------------------------------ document

function New-AltoneoReport {
    <#
    .SYNOPSIS Assemble un document HTML complet et autonome (CSS inline).
    .PARAMETER Dark Active le thème sombre.
    .PARAMETER Path Si fourni, écrit le fichier et retourne son chemin ; sinon retourne le HTML.
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Title,
        [Parameter(Mandatory)][string]$Body,
        [string]$Subtitle,
        [switch]$Dark,
        [switch]$Logo,
        [string]$Path,
        [string]$CssPath
    )
    $css = Get-AltoneoCss -CssPath $CssPath
    $bodyClass = if ($Dark) { "alt-report alt-dark" } else { "alt-report" }
    $subHtml = if ($Subtitle) { "<p class=`"alt-muted`">$(ConvertTo-AltHtml $Subtitle)</p>" } else { "" }

    $html = @"
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>$(ConvertTo-AltHtml $Title)</title>
<style>
$css
</style>
</head>
<body class="$bodyClass">
<div class="alt-container">
<header style="margin-bottom:1.5rem;">
<h1 class="alt-h1">$(ConvertTo-AltHtml $Title)</h1>
$subHtml
</header>
$Body
<footer class="alt-footer" style="border-radius:.75rem;margin-top:2rem;">
<p class="alt-footer__copy">© $((Get-Date).Year) Altonéo — rapport généré le $((Get-Date).ToString('dd/MM/yyyy HH:mm')).</p>
</footer>
</div>
</body>
</html>
"@

    if ($Path) {
        $html | Out-File -FilePath $Path -Encoding UTF8
        return (Resolve-Path $Path).Path
    }
    return $html
}

Export-ModuleMember -Function `
    Get-AltoneoCss, ConvertTo-AltHtml, `
    New-AltoneoBadge, New-AltoneoButton, New-AltoneoAlert, New-AltoneoStat, `
    New-AltoneoCard, New-AltoneoTable, New-AltoneoSection, New-AltoneoReport
