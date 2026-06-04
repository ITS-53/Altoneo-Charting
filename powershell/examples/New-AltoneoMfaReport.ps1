<#
.SYNOPSIS
    DÉMO — Rapport MFA Entra ID rebrandé avec la bibliothèque Altonéo.

.DESCRIPTION
    Reprend EXACTEMENT l'architecture du script d'origine (Export-MFA-AuthMethods.ps1) :
    payload JSON chiffré AES-GCM + rendu côté client après saisie de la passphrase.
    La SEULE chose qui change : l'habillage visuel utilise la bibliothèque Altonéo.

    Comment la bibliothèque est « importée » dans un rapport généré :
      1) La feuille de style autonome dist/altoneo.css est INLINÉE dans le <style>
         (via Get-AltoneoCss du module Altoneo.psm1) → le rapport reste un fichier unique.
      2) Le HTML statique (en-tête, KPI, filtres) utilise les classes `alt-*`.
      3) Le HTML généré DYNAMIQUEMENT en JavaScript (cartes utilisateurs, badges, tableaux)
         émet lui aussi des classes `alt-*`. C'est possible précisément parce que
         altoneo.css contient TOUTES les classes en permanence (aucun "purge" Tailwind) :
         les classes posées par le JS au runtime existent donc toujours dans la CSS.
      4) Le thème sombre réutilise la convention `[data-theme="dark"]` existante,
         désormais supportée nativement par altoneo.css.

.NOTES
    Exécution : pwsh ./New-AltoneoMfaReport.ps1            (PowerShell 7+, pour AES-GCM)
    Produit   : ./mfa-report-altoneo.html  (passphrase de démo : "Altoneo2026")
#>

param(
    [string]$OutputFolder = $PSScriptRoot,
    [string]$Passphrase   = 'Altoneo2026',
    [switch]$Dark
)

Import-Module (Join-Path $PSScriptRoot '..\Altoneo.psm1') -Force

# --------------------------------------------------------------------------
# Chiffrement (identique au script d'origine — nécessite PowerShell 7+).
# --------------------------------------------------------------------------
function Protect-AltoneoPayload {
    param(
        [Parameter(Mandatory)][string]$JsonPayload,
        [Parameter(Mandatory)][string]$Passphrase,
        [int]$Iterations = 200000
    )
    $passphraseBytes = [Text.Encoding]::UTF8.GetBytes($Passphrase)
    $rng  = [Security.Cryptography.RandomNumberGenerator]::Create()
    $salt = New-Object byte[] 16; $rng.GetBytes($salt)
    $deriver = New-Object Security.Cryptography.Rfc2898DeriveBytes($passphraseBytes, $salt, $Iterations, [Security.Cryptography.HashAlgorithmName]::SHA256)
    $key = $deriver.GetBytes(32)
    $iv  = New-Object byte[] 12; $rng.GetBytes($iv)
    $plain = [Text.Encoding]::UTF8.GetBytes($JsonPayload)
    $cipher = New-Object byte[] $plain.Length
    $tag = New-Object byte[] 16
    $aes = [Security.Cryptography.AesGcm]::new($key)
    $aes.Encrypt($iv, $plain, $cipher, $tag); $aes.Dispose(); $rng.Dispose()
    return [pscustomobject]@{
        v = 1; alg = 'AES-GCM'; kdf = 'PBKDF2-SHA256'; iter = $Iterations
        saltB64 = [Convert]::ToBase64String($salt)
        ivB64   = [Convert]::ToBase64String($iv)
        ctB64   = [Convert]::ToBase64String($cipher + $tag)
    }
}

# --------------------------------------------------------------------------
# Construction du rapport HTML brandé Altonéo (CSS inlinée).
# Prend le payload (chiffré ou non) + les compteurs, comme New-ReportHtml.
# --------------------------------------------------------------------------
function Get-AltoneoMfaReportHtml {
    param(
        [Parameter(Mandatory)]$EncryptedPayload,
        [Parameter(Mandatory)][int]$UserCount,
        [Parameter(Mandatory)][int]$MethodCount,
        [string]$Css
    )
    if (-not $Css) { $Css = Get-AltoneoCss }
    $payloadJson = $EncryptedPayload | ConvertTo-Json -Compress

    $template = @'
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Rapport d'Audit MFA — Entra ID</title>
<style>
/* ---- Bibliothèque Altonéo (inlinée) ---- */
__ALTONEO_CSS__
/* ---- Styles propres au rapport (non couverts par la lib) ---- */
.mfa-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; }
.method-cell { display:flex; align-items:center; gap:.5rem; }
.method-cell svg { width:20px; height:20px; color:var(--alt-muted); }
.phone-row { display:flex; align-items:center; gap:.5rem; }
.link-btn { background:none; border:none; color:var(--alt-link); cursor:pointer; font:inherit; font-size:.8125rem; font-weight:600; padding:2px 6px; border-radius:4px; }
.link-btn:hover { text-decoration:underline; }
.footer-note { text-align:center; font-size:.75rem; color:var(--alt-muted); margin-top:2.5rem; }
@keyframes alt-spin { to { transform: rotate(360deg); } }
</style>
</head>
<body class="alt-report">
<div class="alt-container">

  <header class="mfa-header">
    <h1 class="alt-h1">🛡️ Audit MFA — Entra ID</h1>
    <button id="themeToggle" class="alt-btn alt-btn--secondary" type="button" aria-label="Thème">🌙 / ☀️</button>
  </header>

  <!-- Panneau de déverrouillage -->
  <div id="unlockPanel" class="alt-card" style="max-width:30rem;margin:3rem auto;">
    <div class="alt-card__body" style="text-align:center;">
      <h2 class="alt-h2" style="justify-content:center;">Rapport sécurisé chiffré</h2>
      <p class="alt-muted" style="margin:0 0 1rem;">Contenu chiffré localement (AES-GCM 256 bits). Saisissez la clé d'accès pour déverrouiller.</p>
      <div class="alt-field">
        <input id="passphrase" type="password" class="alt-input" placeholder="Saisir la passphrase" aria-label="Passphrase" />
      </div>
      <button id="unlockBtn" class="alt-btn alt-btn--primary alt-btn--block" type="button">Déverrouiller le rapport</button>
      <div id="unlockMessage" class="alt-alert alt-alert--error alt-hidden" style="margin-top:1rem;text-align:left;"></div>
    </div>
  </div>

  <!-- Contenu (masqué jusqu'au déchiffrement) -->
  <div id="reportPanel" class="alt-hidden">

    <div class="alt-grid alt-grid--3" style="margin-bottom:1.5rem;">
      <div class="alt-stat alt-stat--row">
        <div class="alt-icon-box alt-icon-box--navy">👥</div>
        <div><p class="alt-stat__label">Total utilisateurs</p><p class="alt-stat__value" id="statUsers">0</p></div>
      </div>
      <div class="alt-stat alt-stat--row">
        <div class="alt-icon-box alt-icon-box--green">✓</div>
        <div><p class="alt-stat__label">Utilisateurs avec MFA</p><p class="alt-stat__value" id="statUsersMfa">0%</p></div>
      </div>
      <div class="alt-stat alt-stat--row">
        <div class="alt-icon-box alt-icon-box--gold">🔑</div>
        <div><p class="alt-stat__label">Total méthodes MFA</p><p class="alt-stat__value" id="statMethods">0</p></div>
      </div>
    </div>

    <div class="alt-row" style="flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
      <div class="alt-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input id="searchInput" type="text" class="alt-input" placeholder="Rechercher par nom, UPN ou méthode..." />
      </div>
      <select id="filterMfa" class="alt-select" style="max-width:16rem;">
        <option value="all">Tous les utilisateurs</option>
        <option value="active">MFA actif uniquement</option>
        <option value="inactive">Sans MFA uniquement</option>
      </select>
      <button id="toggleAllBtn" class="alt-btn alt-btn--secondary" type="button">Tout afficher</button>
    </div>

    <div id="usersContainer" class="alt-stack"></div>
  </div>

  <div class="footer-note">Généré le <span id="generationDate"></span> — version chiffrée sécurisée · Altonéo</div>
</div>

<script>
const encryptedPayload = __PAYLOAD_JSON__;
const $ = (id) => document.getElementById(id);
let rawReportData = null, showAllPhones = false;

function escapeHtml(v){ if(v==null) return ''; return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function b64ToBuf(b64){ const s=atob(b64), a=new Uint8Array(s.length); for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i); return a.buffer; }

// ---- Déchiffrement PBKDF2 + AES-GCM (inchangé) ----
async function decryptPayload(passphrase){
  const salt=b64ToBuf(encryptedPayload.saltB64), iv=b64ToBuf(encryptedPayload.ivB64), ct=b64ToBuf(encryptedPayload.ctB64);
  const km=await crypto.subtle.importKey('raw',new TextEncoder().encode(passphrase),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:encryptedPayload.iter,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['decrypt']);
  const dec=await crypto.subtle.decrypt({name:'AES-GCM',iv},key,ct);
  return new TextDecoder().decode(dec);
}

// ---- Helpers de rendu : ILS ÉMETTENT DES CLASSES alt-* ----
const methodBadge = (type) => `<span class="alt-badge alt-badge--info">${escapeHtml(type)}</span>`;

function phoneCell(num){
  if(!num) return '<span class="alt-muted">—</span>';
  const masked='*'.repeat(num.length);
  return `<div class="phone-row">
    <span class="alt-mono" data-full="${escapeHtml(num)}" data-masked="${escapeHtml(masked)}">${escapeHtml(masked)}</span>
    <button class="link-btn" type="button" onclick="togglePhone(this)">Afficher</button>
  </div>`;
}
function togglePhone(btn){
  const s=btn.previousElementSibling, masked=btn.textContent.trim()==='Afficher';
  s.textContent = masked ? s.dataset.full : s.dataset.masked;
  btn.textContent = masked ? 'Masquer' : 'Afficher';
}
function toggleAllPhones(){
  showAllPhones=!showAllPhones;
  document.querySelectorAll('.phone-row .alt-mono').forEach(s=>s.textContent=showAllPhones?s.dataset.full:s.dataset.masked);
  document.querySelectorAll('.phone-row .link-btn').forEach(b=>b.textContent=showAllPhones?'Masquer':'Afficher');
  $('toggleAllBtn').textContent=showAllPhones?'Tout masquer':'Tout afficher';
}

const STRONG=['Téléphone','Microsoft Authenticator','Clé FIDO2','Code OATH (TOTP)','Passe d’accès temporaire (TAP)'];

function renderReport(data){
  $('generationDate').textContent=new Date(data.generatedAt).toLocaleString('fr-FR');
  $('statUsers').textContent=data.userCount;
  $('statMethods').textContent=data.methodCount;
  let mfaActive=0;
  const c=$('usersContainer'); c.innerHTML='';

  data.users.forEach(user=>{
    const strong=user.Methods.some(m=>STRONG.includes(m.MethodType));
    if(strong) mfaActive++;
    const badge = strong
      ? '<span class="alt-badge alt-badge--success">✓ MFA actif</span>'
      : '<span class="alt-badge alt-badge--error">✕ Sans MFA</span>';

    let body;
    if(!user.Methods.length){
      body='<div class="alt-card__body"><p class="alt-muted" style="text-align:center;margin:0;">Aucune méthode configurée.</p></div>';
    } else {
      const rows=user.Methods.map(m=>{
        const phoneType = m.PhoneType ? `<span class="alt-badge alt-badge--warning">${escapeHtml(m.PhoneType)}</span>` : '<span class="alt-muted">—</span>';
        return `<tr>
          <td><div class="method-cell">${methodBadge(m.MethodType)}</div></td>
          <td>${phoneType}</td>
          <td>${m.PhoneNumber?phoneCell(m.PhoneNumber):'<span class="alt-muted">—</span>'}</td>
          <td class="alt-muted">${escapeHtml(m.Details)}</td>
        </tr>`;
      }).join('');
      body=`<div class="alt-card__body" style="padding:0;">
        <table class="alt-table">
          <thead><tr><th>Méthode</th><th>Type tél.</th><th>Numéro / Valeur</th><th>Détails</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>`;
    }

    const card=document.createElement('div');
    card.className='alt-card'; card.dataset.mfa=strong?'active':'inactive';
    card.innerHTML=`
      <div class="alt-card__header" style="display:flex;justify-content:space-between;align-items:center;">
        <div><h3 class="alt-card__title">${escapeHtml(user.DisplayName)}</h3><p class="alt-card__subtitle alt-mono">${escapeHtml(user.UserPrincipalName)}</p></div>
        ${badge}
      </div>${body}`;
    c.appendChild(card);
  });

  $('statUsersMfa').textContent = (data.userCount>0?Math.round(mfaActive/data.userCount*100):0)+'%';
}

function filterResults(){
  const q=$('searchInput').value.toLowerCase(), f=$('filterMfa').value;
  document.querySelectorAll('.alt-card[data-mfa]').forEach(card=>{
    const t=card.querySelector('.alt-card__title').textContent.toLowerCase();
    const u=card.querySelector('.alt-card__subtitle').textContent.toLowerCase();
    const meth=Array.from(card.querySelectorAll('.alt-badge--info')).map(b=>b.textContent.toLowerCase()).join(' ');
    const ok=(t.includes(q)||u.includes(q)||meth.includes(q)) && (f==='all'||card.dataset.mfa===f);
    card.classList.toggle('alt-hidden',!ok);
  });
}

// ---- Thème : convention [data-theme] supportée par altoneo.css ----
function setTheme(t){ document.documentElement.setAttribute('data-theme',t); localStorage.setItem('theme',t); }
$('themeToggle').addEventListener('click',()=>setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'));
setTheme(localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));

$('unlockBtn').addEventListener('click',async()=>{
  const msg=$('unlockMessage'); msg.classList.add('alt-hidden');
  const pass=$('passphrase').value.trim();
  if(!pass){ msg.textContent='Veuillez saisir la passphrase.'; msg.classList.remove('alt-hidden'); return; }
  $('unlockBtn').disabled=true; $('unlockBtn').textContent='Déchiffrement…';
  try{
    rawReportData=JSON.parse(await decryptPayload(pass));
    $('unlockPanel').classList.add('alt-hidden');
    $('reportPanel').classList.remove('alt-hidden');
    renderReport(rawReportData);
  }catch(e){ msg.textContent='Échec du déchiffrement. Vérifiez la passphrase.'; msg.classList.remove('alt-hidden'); }
  finally{ $('unlockBtn').disabled=false; $('unlockBtn').textContent='Déverrouiller le rapport'; }
});
$('searchInput').addEventListener('input',filterResults);
$('filterMfa').addEventListener('change',filterResults);
$('toggleAllBtn').addEventListener('click',toggleAllPhones);
$('passphrase').addEventListener('keydown',e=>{ if(e.key==='Enter') $('unlockBtn').click(); });
</script>
</body>
</html>
'@
    return $template.Replace('__ALTONEO_CSS__', $Css).Replace('__PAYLOAD_JSON__', $payloadJson)
}

# --------------------------------------------------------------------------
# Harnais de démonstration (ignoré quand le fichier est simplement dot-sourcé).
# --------------------------------------------------------------------------
if ($MyInvocation.InvocationName -ne '.') {
    $sampleUsers = @(
        [pscustomobject]@{ DisplayName='Corentin Hayer'; UserPrincipalName='c.hayer@altoneo.fr'; Methods=@(
            [pscustomobject]@{ MethodType='Microsoft Authenticator'; PhoneType=$null; PhoneNumber=$null; Details='Appareil: iPhone 15' }
            [pscustomobject]@{ MethodType='Téléphone'; PhoneType='mobile'; PhoneNumber='+33612345678'; Details='Type: mobile' }
        )}
        [pscustomobject]@{ DisplayName='Émilie Cottais'; UserPrincipalName='e.cottais@altoneo.fr'; Methods=@(
            [pscustomobject]@{ MethodType='Clé FIDO2'; PhoneType=$null; PhoneNumber=$null; Details='Modèle: YubiKey 5' }
        )}
        [pscustomobject]@{ DisplayName='Jean Sans-MFA'; UserPrincipalName='j.sansmfa@altoneo.fr'; Methods=@() }
    )
    $methodCount = ($sampleUsers | ForEach-Object { $_.Methods.Count } | Measure-Object -Sum).Sum

    $reportObject = [pscustomobject]@{
        generatedAt = (Get-Date).ToString('u')
        userCount   = $sampleUsers.Count
        methodCount = $methodCount
        users       = $sampleUsers
    }

    $payload = Protect-AltoneoPayload -JsonPayload ($reportObject | ConvertTo-Json -Depth 10 -Compress) -Passphrase $Passphrase
    $html = Get-AltoneoMfaReportHtml -EncryptedPayload $payload -UserCount $sampleUsers.Count -MethodCount $methodCount

    $out = Join-Path $OutputFolder 'mfa-report-altoneo.html'
    $html | Out-File -FilePath $out -Encoding UTF8
    Write-Host "Rapport généré : $out" -ForegroundColor Green
    Write-Host "Passphrase de démo : $Passphrase" -ForegroundColor Yellow
}
