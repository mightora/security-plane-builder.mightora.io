from pathlib import Path
import zipfile
p=Path(__file__).parent
css=(p/'src.css').read_text(encoding='utf-8')
js=(p/'src.js').read_text(encoding='utf-8')
template=(p/'template.html').read_text(encoding='utf-8')
logo='https://raw.githubusercontent.com/mightora/mightora.io/main/static/images/mightoraIoLogo4-200x900.png'
for offline in (False, True):
 h=template.replace('/*CSS*/',css).replace('/*JS*/',js).replace('%%MODE%%','Offline Edition – No Internet Connection Required' if offline else 'Client-side architecture modeller')
 if offline:
  h=h.replace('%%HEAD_DEPENDENCIES%%','<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; img-src data:; font-src data:; connect-src \'none\'; form-action \'none\'; base-uri \'none\'">')
  h=h.replace('%%HEADER%%','<header class="offline-header"><div class="brandlock"><span class="brandmark">M</span><span class="brandword">MIGHTORA <small>SECURITY PLANE BUILDER</small></span></div><span class="offline-pill">OFFLINE EDITION</span></header>')
  h=h.replace('%%FOOTER%%','<footer class="fallback-footer">Mightora · Open-source architecture planning · Everything stays on your device.</footer>')
  h=h.replace('%%LINKS%%','')
  (p/'offline.html').write_text(h,encoding='utf-8')
 else:
  deps='<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mightora/shared-ui@main/shared.css"><script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js" defer></script><script src="https://cdn.jsdelivr.net/gh/mightora/shared-ui@main/components.js" defer></script>'
  h=h.replace('%%HEAD_DEPENDENCIES%%',deps)
  h=h.replace('%%HEADER%%',f'<mightora-header site-name="Power Platform Security Plane Builder" site-url="./" logo-light="{logo}" logo-dark="{logo}" nav-links=\'[{{"label":"Builder","url":"#builder"}},{{"label":"Assessment","url":"#assessment"}},{{"label":"About","url":"#about"}},{{"label":"Mightora.io ↗","url":"https://mightora.io","ext":true}}]\'></mightora-header>')
  h=h.replace('%%FOOTER%%','<mightora-author><div class="author-fallback">Built by TechTweedie · Ian Tweedie · Practical open-source tools for solution architects.</div></mightora-author><mightora-footer><div class="fallback-footer">Power Platform Security Plane Builder by <a href="https://mightora.io">Mightora</a>. Open source: <a href="https://github.com/mightora/security-plane-builder.mightora.io">Source on GitHub</a>.</div></mightora-footer>')
  h=h.replace('%%LINKS%%','<p class="network-online">Online edition loads Mightora shared UI, js-yaml and optional branding resources. Project data is not transmitted by the builder.</p>')
  (p/'index.html').write_text(h,encoding='utf-8')
with zipfile.ZipFile(p/'offline-edition.zip','w',zipfile.ZIP_DEFLATED) as z:
 for n in ('offline.html','README.md','LICENSE'):
  z.write(p/n,'index.html' if n=='offline.html' else n)
print('Generated online, offline, and ZIP editions')
