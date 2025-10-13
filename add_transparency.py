from PIL import Image
import os

# Open the dark background image
input_path = 'public/assets/dark-background.png'
output_path = 'public/assets/dark-background.png'

# Open the image
img = Image.open(input_path)

# Convert to RGBA if not already
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Get the image data
data = img.getdata()

# Create new image data with transparency (85% opacity = 217 alpha)
new_data = []
for item in data:
    # Keep RGB values, set alpha to 85% (217 out of 255)
    new_data.append((item[0], item[1], item[2], int(item[3] * 0.85)))

# Update image data
img.putdata(new_data)

# Save the image
img.save(output_path, 'PNG')
print(f"Added transparency to {output_path}")
