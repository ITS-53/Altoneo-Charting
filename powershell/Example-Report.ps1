<#
    Exemple : génère un rapport HTML Altonéo autonome à partir de données.
    Lancement :  pwsh ./Example-Report.ps1   (ou powershell.exe)
    Produit :    ./rapport-exemple.html
#>

Import-Module (Join-Path $PSScriptRoot 'Altoneo.psm1') -Force

# --- Données d'exemple (typiquement issues d'une requête / d'un CSV) ----------
$controls = @(
    [pscustomobject]@{ Client = 'MARTIN SAS';   Entite = 'Altonéo Audit';   Associes = 8;  Statut = 'completed' }
    [pscustomobject]@{ Client = 'DURAND SARL';  Entite = 'Altonéo Conseil'; Associes = 3;  Statut = 'partial' }
    [pscustomobject]@{ Client = 'PETIT SCI';    Entite = 'Altonéo Audit';   Associes = 5;  Statut = 'sent' }
    [pscustomobject]@{ Client = 'BERNARD SA';   Entite = 'Altonéo Dév.';    Associes = 12; Statut = 'pending' }
)

$labels = @{ completed = 'Terminé'; partial = 'Partiel'; sent = 'Envoyé'; pending = 'En attente' }

# Transforme la colonne Statut en badge HTML (colonne "brute")
$rows = $controls | ForEach-Object {
    [pscustomobject]@{
        Client   = $_.Client
        Entité   = $_.Entite
        Associés = $_.Associes
        Statut   = New-AltoneoBadge -Text $labels[$_.Statut] -Variant $_.Statut
    }
}

# --- KPI ----------------------------------------------------------------------
$kpis = @(
    New-AltoneoStat -Label 'Contrôles en cours' -Value '12' -Delta 8
    New-AltoneoStat -Label 'Taux de réponse'    -Value '86%' -Delta -3
    New-AltoneoStat -Label 'Clôturés (mois)'    -Value '28' -Delta 12
) -join ''
$kpiGrid = "<div class=`"alt-grid alt-grid--3`">$kpis</div>"

# --- Assemblage du corps ------------------------------------------------------
$table = New-AltoneoTable -Data $rows -RawColumns 'Statut' -Striped

$body = @(
    New-AltoneoAlert -Variant 'info' -Title 'Synthèse hebdomadaire' -Message 'Mise à jour automatique des contrôles d''indépendance.'
    New-AltoneoSection -Title 'Indicateurs clés' -Body $kpiGrid
    New-AltoneoSection -Title 'Contrôles en cours' -Body (New-AltoneoCard -Body $table)
) -join "`n"

# --- Génération du fichier ----------------------------------------------------
$out = Join-Path $PSScriptRoot 'rapport-exemple.html'
$path = New-AltoneoReport -Title 'Rapport Contrôles d''Indépendance' `
    -Subtitle 'Altonéo Audit — semaine 23' -Body $body -Path $out

Write-Host "Rapport généré : $path" -ForegroundColor Green
