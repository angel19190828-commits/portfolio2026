from pathlib import Path

from PIL import Image


ROOT = Path(r"C:\Users\angel\qiaooli-replica\assets\stickers")
OUT = ROOT / "web"
OUT.mkdir(exist_ok=True)

ITEMS = {
    "cat.png": ("cat.png", 420),
    "horse.png": ("horse.png", 360),
    "cake.png": ("cake.png", 460),
    "polaroids.png": ("polaroids.png", 460),
    "angel-yu-sticker.png": ("angel-yu-sticker.png", 520),
}

for source_name, (dest_name, max_width) in ITEMS.items():
    image = Image.open(ROOT / source_name).convert("RGBA")
    original_size = image.size
    if image.width > max_width:
        next_height = round(image.height * max_width / image.width)
        image = image.resize((max_width, next_height), Image.Resampling.LANCZOS)
    output = OUT / dest_name
    image.save(output, optimize=True)
    print(f"{source_name}: {original_size} -> {image.size}, {output.stat().st_size} bytes")
