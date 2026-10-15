from pathlib import Path
from zipfile import ZipFile
p=Path(__file__).parent
h=(p/'offline.html').read_text(encoding='utf-8')
assert 'Offline Edition – No Internet Connection Required' in h
assert "connect-src 'none'" in h
assert 'https://' not in h
assert 'Seven Power Platform' in (p/'README.md').read_text(encoding='utf-8')
assert 'function toPlantUml' in (p/'src.js').read_text(encoding='utf-8')
assert all(x in h for x in ['community','nodeGroup','connectionKind','showLabels','exportPuml'])
assert 'TRA Access' not in h and 'TRA Access' not in (p/'src.js').read_text(encoding='utf-8')
assert all(s in h for s in ['Power Pages','Conditional Access','Dataverse','Copilot Studio','Power Automate','Import JSON','Export SVG'])
with ZipFile(p/'offline-edition.zip') as z:
 assert {'index.html','README.md','LICENSE'}<=set(z.namelist())
 assert z.read('index.html').decode('utf-8') == h
print('Build and offline packaging checks passed')
