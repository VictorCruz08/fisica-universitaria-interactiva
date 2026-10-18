"""Vuelca el texto de un rango de páginas del PDF del libro a .referencia/ (ignorada por git).

Uso:
    python -I scripts/extraer_texto.py <pagina_libro_inicio> <pagina_libro_fin> [ruta_pdf]

Las páginas se indican con la numeración impresa del libro (12.ª ed.). En el PDF
del Volumen 1, página impresa + 22 = índice de página del PDF (base 0).
Requiere `pypdf` (pip install pypdf).

El texto extraído es sólo material de consulta para seguir el orden y el nivel
del libro: NUNCA se copia al sitio. Ver CLAUDE.md, "Derechos de autor".
"""

import sys
from pathlib import Path

from pypdf import PdfReader

DESFASE = 22


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    inicio, fin = int(sys.argv[1]), int(sys.argv[2])
    raiz = Path(__file__).resolve().parent.parent
    pdf = Path(sys.argv[3]) if len(sys.argv) > 3 else raiz / "FisicaUniversitaria.pdf"
    salida = raiz / ".referencia"
    salida.mkdir(exist_ok=True)

    lector = PdfReader(str(pdf))
    destino = salida / f"paginas_{inicio}-{fin}.txt"
    with destino.open("w", encoding="utf-8") as f:
        for pagina in range(inicio, fin + 1):
            texto = lector.pages[pagina + DESFASE].extract_text() or ""
            f.write(f"\n\n===== PÁGINA {pagina} DEL LIBRO =====\n{texto}")
    print(destino)


if __name__ == "__main__":
    main()
