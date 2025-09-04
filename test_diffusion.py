import torch
from diffusers import StableDiffusionXLPipeline

# 1. Load the pre-trained Stable Diffusion model
print("Loading Stable Diffusion model...")
model_id = "/Users/izverg/projects/OnlyEngine.ai/LyliaEngine/Pony_Diffusion_V6_XL"
pipe = StableDiffusionXLPipeline.from_pretrained(
    model_id,
)

# 2. Move the model to your Mac's GPU
print("Moving model to MPS (Apple Silicon GPU)...")
if torch.backends.mps.is_available():
    device = "mps"
else:
    device = "cpu"
    print("MPS device not found. Running on CPU, which will be much slower.")

pipe = pipe.to(device)

# 3. Optimize for memory
# Removed pipe.enable_attention_slicing()

# 4. Generate the image
prompt = "beautiful female feet with blue toe nail polish and gorgeous arch"
print(f"Generating image for prompt: '{prompt}'")

image = pipe(prompt, num_inference_steps=50, guidance_scale=7.5).images[0]

# 5. Save the image
output_file = "moneyshot.png"
image.save(output_file)

print(f"Image saved to {output_file}")