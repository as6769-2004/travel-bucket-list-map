import os
import requests

# Folder to save images
SAVE_DIR = "assets/gallery"
os.makedirs(SAVE_DIR, exist_ok=True)

# Place names with example image URLs
images = {
    "tajmahal.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/da/Taj-Mahal.jpg",
    "eiffel.jpg": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg",
    "colosseum.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/de/Colosseo_2020.jpg",
    "pyramids.jpg": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg",
    "greatwall.jpg": "https://upload.wikimedia.org/wikipedia/commons/6/6f/GreatWallBadaling.jpg",
    "machupicchu.jpg": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg",
    "statueofliberty.jpg": "https://upload.wikimedia.org/wikipedia/commons/a/a1/Statue_of_Liberty_7.jpg"
}

def download_images():
    for filename, url in images.items():
        path = os.path.join(SAVE_DIR, filename)
        try:
            print(f"Downloading {filename}...")
            response = requests.get(url, timeout=15)
            response.raise_for_status()
            with open(path, "wb") as f:
                f.write(response.content)
            print(f"✅ Saved {filename}")
        except Exception as e:
            print(f"❌ Failed {filename}: {e}")

if __name__ == "__main__":
    download_images()
