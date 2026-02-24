#!/usr/bin/env python3
"""
Gera imagens placeholder SVG para o projeto Ice Van.
Execute com: python3 public/images/_placeholder-generator.py
"""
import os

def create_placeholder_svg(width, height, label, color1="#003957", color2="#2D92BE"):
    return f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{color1};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:{color2};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect width="{width}" height="{height}" fill="url(#g)"/>
  <text x="{width//2}" y="{height//2 - 10}" text-anchor="middle" fill="white" 
        font-family="Inter, sans-serif" font-size="18" font-weight="600">Ice Van</text>
  <text x="{width//2}" y="{height//2 + 18}" text-anchor="middle" fill="rgba(255,255,255,0.7)" 
        font-family="Inter, sans-serif" font-size="13">{label}</text>
  <text x="{width//2}" y="{height - 20}" text-anchor="middle" fill="rgba(255,255,255,0.4)" 
        font-family="Inter, sans-serif" font-size="11">{width}x{height}px</text>
</svg>'''

placeholders = [
    # Hero banners
    ("images/hero/banner-01.svg", 1920, 780, "Banner 01 — Van em Operação"),
    ("images/hero/banner-02.svg", 1920, 780, "Banner 02 — Isolamento Térmico"),
    ("images/hero/banner-03.svg", 1920, 780, "Banner 03 — Refrigeração"),
    ("images/hero/banner-04.svg", 1920, 780, "Banner 04 — Frota Refrigerada"),
    # OG Image
    ("images/og/og-image.svg", 1200, 630, "Open Graph Image", "#003957", "#F28C28"),
    # Empresa
    ("images/empresa/equipe.svg", 800, 600, "Foto da Equipe"),
    ("images/empresa/instalacoes.svg", 800, 600, "Instalações"),
    # Fotos e Serviços
    *[(f"images/fotos-servicos/foto-{i:02d}.svg", 800, 600, f"Foto de Serviço {i:02d}") for i in range(1, 10)],
    # Aplicações
    ("images/aplicacoes/fiorinos/thumb.svg", 800, 600, "Fiorino — Card"),
    ("images/aplicacoes/fiorinos/foto-01.svg", 800, 600, "Fiorino — Foto 01"),
    ("images/aplicacoes/fiorinos/foto-02.svg", 800, 600, "Fiorino — Foto 02"),
    ("images/aplicacoes/van-ducato/thumb.svg", 800, 600, "Van Ducato — Card"),
    ("images/aplicacoes/van-ducato/foto-01.svg", 800, 600, "Van Ducato — Foto 01"),
    ("images/aplicacoes/van-ducato/foto-02.svg", 800, 600, "Van Ducato — Foto 02"),
    ("images/aplicacoes/van-sprinter/thumb.svg", 800, 600, "Van Sprinter — Card"),
    ("images/aplicacoes/van-sprinter/foto-01.svg", 800, 600, "Van Sprinter — Foto 01"),
    ("images/aplicacoes/van-sprinter/foto-02.svg", 800, 600, "Van Sprinter — Foto 02"),
    ("images/aplicacoes/van-master/thumb.svg", 800, 600, "Van Master — Card"),
    ("images/aplicacoes/van-master/foto-01.svg", 800, 600, "Van Master — Foto 01"),
    ("images/aplicacoes/van-master/foto-02.svg", 800, 600, "Van Master — Foto 02"),
    ("images/aplicacoes/expert-porta-frigorifica/thumb.svg", 800, 600, "Expert c/ Porta — Card"),
    ("images/aplicacoes/expert-porta-frigorifica/foto-01.svg", 800, 600, "Expert — Foto 01"),
    ("images/aplicacoes/expert-porta-frigorifica/foto-02.svg", 800, 600, "Expert — Foto 02"),
    ("images/aplicacoes/fiorino-porta-frigorifica/thumb.svg", 800, 600, "Fiorino c/ Porta — Card"),
    ("images/aplicacoes/fiorino-porta-frigorifica/foto-01.svg", 800, 600, "Fiorino c/ Porta — Foto 01"),
    ("images/aplicacoes/fiorino-porta-frigorifica/foto-02.svg", 800, 600, "Fiorino c/ Porta — Foto 02"),
]

base = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/public"

for item in placeholders:
    if len(item) == 4:
        path, w, h, label = item
        svg = create_placeholder_svg(w, h, label)
    else:
        path, w, h, label, c1, c2 = item
        svg = create_placeholder_svg(w, h, label, c1, c2)
    
    full_path = os.path.join(base, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(svg)
    print(f"✓ {path}")

print(f"\n✅ {len(placeholders)} placeholders gerados!")
