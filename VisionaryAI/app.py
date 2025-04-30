from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
from diffusers import FluxPipeline
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize the model
pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-dev", torch_dtype=torch.bfloat16)
pipe.enable_model_cpu_offload()

@app.route('/api/generate', methods=['POST'])
def generate_image():
    try:
        data = request.json
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"generated_{timestamp}.png"
        filepath = os.path.join('static', 'generated', filename)

        # Ensure directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        # Generate image
        image = pipe(
            prompt,
            height=1024,
            width=1024,
            guidance_scale=3.5,
            num_inference_steps=50,
            max_sequence_length=512,
            generator=torch.Generator("cpu").manual_seed(0)
        ).images[0]

        # Save image
        image.save(filepath)

        return jsonify({
            'success': True,
            'imageUrl': f'/static/generated/{filename}'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 