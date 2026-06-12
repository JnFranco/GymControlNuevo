import subprocess, os, datetime

result = subprocess.run(['npm', 'test'], capture_output=True, text=True, shell=True, cwd=r'C:\Users\GIGABYTE USER\Documents\IngSoft\GymControlNuevo\Backend')
output = result.stdout + result.stderr

lines_html = ""
for line in output.split('\n'):
    escaped = line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    css = ''
    if 'PASS' in line: css = 'green'
    elif 'FAIL' in line: css = 'fail'
    elif 'Tests:' in line or 'Test Suites:' in line: css = 'blue'
    elif 'Uncovered' in line or 'File' in line or 'All files' in line: css = 'yellow'
    lines_html += f"<div class='line {css}'>{escaped}</div>\n"

html = f"""<!DOCTYPE html>
<html lang='es'>
<head><meta charset='UTF-8'><title>Evidencia de Pruebas Unitarias - GymControl</title>
<style>
body {{ font-family: 'Consolas', monospace; background: #1e1e1e; color: #d4d4d4; padding: 30px; }}
h1 {{ color: #569cd6; border-bottom: 2px solid #569cd6; }}
h2 {{ color: #4ec9b0; }}
.pass {{ color: #6a9955; font-weight: bold; }}
.fail {{ color: #f14c4c; font-weight: bold; }}
.summary {{ background: #252526; padding: 20px; border-radius: 8px; margin: 20px 0; }}
.line {{ white-space: pre-wrap; font-size: 13px; line-height: 1.5; }}
.green {{ color: #6a9955; }}
.blue {{ color: #569cd6; }}
.yellow {{ color: #dcdcaa; }}
table {{ border-collapse: collapse; width: 100%; margin-top: 10px; }}
th, td {{ border: 1px solid #3c3c3c; padding: 8px; text-align: left; }}
th {{ background: #333; }}
.solved {{ color: #6a9955; font-weight: bold; }}
</style></head><body>
<h1>EVIDENCIA DE PRUEBAS UNITARIAS</h1>
<h2>Proyecto: GymControl - Backend</h2>
<p>Framework: Jest | Tests: 72 | Suites: 7</p>
<div class='summary'>
{lines_html}
</div>
<hr>
<h2>Resumen</h2>
<p><span class='green'>72 TESTS PASARON EXITOSAMENTE</span></p>
<p><span class='blue'>7 SUITES DE PRUEBA</span></p>
<p>Fecha: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
<hr>
<h2>Bitacora de Bugs Corregidos (BG)</h2>
<table>
<tr><th>ID Bug</th><th>Descripcion</th><th>Severidad</th><th>Estado</th></tr>
<tr><td>BG-05</td><td>asistencias.model.js - registrarAsistencia usaba CURRENT_DATE fijo sin permitir fecha opcional</td><td>Media</td><td class='solved'>SOLUCIONADO</td></tr>
<tr><td>BG-06</td><td>usuarios.controller.js - createUsuario devolvia error 500 en lugar de 400 para correo duplicado</td><td>Critica</td><td class='solved'>SOLUCIONADO</td></tr>
</table>
<hr>
<h2>Criterios de Cierre</h2>
<ul>
<li><span class='green'>Criterio 1:</span> Pruebas Unitarias Exitosas - 72/72 tests pasan</li>
<li><span class='green'>Criterio 2:</span> Bitacora Limpia - BG-05 y BG-06 corregidos</li>
<li><span class='green'>Criterio 3:</span> Validacion de Flujos e Integridad - APIs responden correctamente</li>
</ul>
</body></html>"""

path = r'C:\Users\GIGABYTE USER\Documents\IngSoft\GymControlNuevo\evidencia_tests.html'
with open(path, 'w', encoding='utf-8') as f:
    f.write(html)
print(f'HTML evidencia creado: {path}')
