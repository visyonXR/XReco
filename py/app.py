from flask import Flask, request, send_file, make_response, jsonify, send_from_directory
from flask_cors import CORS
import os
import tempfile
import subprocess
import shutil
import sched
import threading
import time
import json
import uuid

app = Flask(__name__)
CORS(app)

temp_files_dir = os.path.join(os.path.dirname(__file__), 'temp_files')

if not os.path.exists(temp_files_dir):
    os.makedirs(temp_files_dir)

UPLOAD_FOLDER = "uploads"
IMAGE_FOLDER = os.path.join(UPLOAD_FOLDER, "images")
AUDIO_FOLDER = os.path.join(UPLOAD_FOLDER, "audio")
VIDEO_FOLDER = os.path.join(UPLOAD_FOLDER, "video")

os.makedirs(IMAGE_FOLDER, exist_ok=True)
os.makedirs(AUDIO_FOLDER, exist_ok=True)
os.makedirs(VIDEO_FOLDER, exist_ok=True)

@app.route('/uploads/<folder_name>/<random_name>/<filename>', methods=['GET'])
def serve_file(folder_name, random_name, filename):
    folder_path = os.path.join(UPLOAD_FOLDER, folder_name, random_name)
    if os.path.exists(os.path.join(folder_path, filename)):
        return send_from_directory(folder_path, filename)
    else:
        return jsonify({"error": "File not found"}), 404

def save_file(file, folder):
    if file:
        random_name = f"{uuid.uuid4().hex}"
        subfolder_path = os.path.join(folder, random_name)

        os.makedirs(subfolder_path, exist_ok=True)
        file_path = os.path.join(subfolder_path, file.filename)

        file.save(file_path)
        print(f"File saved at {file_path}")
        file_url = f"https://flask-xrcapsule.visyon.tech/{folder}/{random_name}/{file.filename}"
        
        return {"message": "File uploaded successfully", "file_url": file_url, "random_name": random_name}
    
    return {"error": "Invalid file"}, 400

@app.route("/upload/image", methods=["POST"])
def upload_image():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    if file.filename == "" or not file.content_type.startswith("image/"):
        return jsonify({"error": "Invalid image file"}), 400

    result = save_file(file, IMAGE_FOLDER)
    
    if "file_url" in result:
        return jsonify({"message": "File uploaded successfully", "file_url": result["file_url"], "random_name": result["random_name"]})
    else:
        return jsonify(result), 400

@app.route("/upload/audio", methods=["POST"])
def upload_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "" or not (file.content_type == "audio/mpeg" or file.filename.endswith(".mp3")):
        return jsonify({"error": "Invalid audio file"}), 400

    result = save_file(file, AUDIO_FOLDER)
    
    if "file_url" in result and "random_name" in result:
        return jsonify({"message": "Audio file uploaded successfully", "file_url": result["file_url"], "random_name": result["random_name"]})
    else:
        return jsonify(result), 400

@app.route("/upload/video", methods=["POST"])
def upload_video():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "" or not (file.content_type == "video/mp4" or file.filename.endswith(".mp4")):
        return jsonify({"error": "Invalid video file"}), 400

    result = save_file(file, VIDEO_FOLDER)
    
    if "file_url" in result and "random_name" in result:
        return jsonify({"message": "Video file uploaded successfully", "file_url": result["file_url"], "random_name": result["random_name"]})
    else:
        return jsonify(result), 400

def delete_temp_files():
    current_time = time.time()
    for folder_name in os.listdir(temp_files_dir):
        folder_path = os.path.join(temp_files_dir, folder_name)
        if os.path.isdir(folder_path):
            folder_creation_time = os.path.getctime(folder_path)
            if current_time - folder_creation_time > 3600: #cambiar a 48h
                shutil.rmtree(folder_path)
                print(f"The folder {folder_name} was deleted because more than 1 hour has passed since its creation")

def scheduler_thread():
    scheduler = sched.scheduler(time.time, time.sleep)
    scheduler.enter(300, 1, delete_temp_files)
    scheduler.run()

scheduler_thread = threading.Thread(target=scheduler_thread)
scheduler_thread.start()

@app.route('/')
def index():
    return open('index.html').read()

@app.route('/read_3D_model', methods=['POST'])
def read_3D_model():
    if 'files' not in request.files:
        return 'No file has been provided', 400

    files = request.files.getlist('files')
    paths = request.form.getlist('paths')

    if not files or all(file.filename == '' for file in files):
        return 'No file has been selected', 400

    original_folder_name = os.path.commonprefix(paths).split(os.sep)[0]
    random_name = f"{uuid.uuid4().hex}"
    temp_dir = os.path.join(temp_files_dir, random_name)
    os.makedirs(temp_dir, exist_ok=True)
    
    input_filepaths = []

    for file, path in zip(files, paths):
        file_path = os.path.join(temp_dir, path)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        file.save(file_path)
        input_filepaths.append(file_path)

    input_filepath = next((file for file in input_filepaths if file.endswith(('.glb', '.gltf', '.obj', '.fbx', '.usdz'))), None)

    if not input_filepath:
        return 'The file must be OBJ, GLB, GLTF, FBX, or USDZ', 400

    output_filename = os.path.basename(temp_dir) + '.glb'

    output_filepath = os.path.join(temp_dir, output_filename)
    decimation_scale = 0.5

    try:
        blender_executable = os.path.join(os.path.dirname(__file__), 'blender_4.1', 'blender')
        result = subprocess.run([
            blender_executable, '-b', '-P', os.path.join(os.path.dirname(__file__), 'mesh_reducer.py'), '--', input_filepath, output_filepath, str(decimation_scale)
        ], check=True, capture_output=True, text=True)
        print(result.stdout)
        print(result.stderr)
    except subprocess.CalledProcessError as e:
        return f"Error executing Blender: {e}\n{e.output}", 500

    file_list = []
    original_folder_path = os.path.join(temp_dir, original_folder_name)
    for root, _, files in os.walk(original_folder_path):
        for file in files:
            file_list.append(os.path.relpath(os.path.join(root, file), original_folder_path))

    print(f"Files found in '{original_folder_name}':")
    print(file_list)

    print(f"output:{output_filename}")
    response = make_response(send_file(output_filepath, as_attachment=True, download_name=output_filename))
    response.headers['Access-Control-Expose-Headers'] = 'Content-Disposition, Content-Length, Original-Folder-Name, Temp-Folder-Name, File-List'
    response.headers['Content-Length'] = str(os.path.getsize(output_filepath))
    response.headers['Original-Folder-Name'] = str(original_folder_name)
    response.headers['Temp-Folder-Name'] = str(os.path.basename(temp_dir))
    response.headers['File-List'] = json.dumps(file_list)
    return response
    
@app.route('/download_file/<temp_folder_name>/<original_folder_name>/<path:file_path>', methods=['GET'])
def download_file(temp_folder_name, original_folder_name, file_path):
    full_file_path = os.path.join(temp_files_dir, temp_folder_name, original_folder_name, file_path)
    if os.path.exists(full_file_path):
        return send_file(full_file_path, as_attachment=True, download_name=os.path.basename(full_file_path))
    else:
        return f'File {file_path} not found in folder {temp_folder_name}/{original_folder_name}', 404

@app.route('/download_procesed_file/<temp_folder_name>/<new_name_glb>', methods=['GET'])
def download_procesed_file(temp_folder_name, new_name_glb):
    full_file_path = os.path.join(temp_files_dir, temp_folder_name, new_name_glb)
    
    if os.path.exists(full_file_path):
        return send_file(full_file_path, as_attachment=True, download_name=os.path.basename(full_file_path))
    else:
        return f'File {new_name_glb} not found in folder {temp_folder_name}', 404

@app.route('/json_files_list', methods=['GET'])
def json_files_list():
    folder = os.path.join(os.path.dirname(__file__), 'jsonpublicfiles')
    files_info = []

    try:
        files = [file_name for file_name in os.listdir(folder) if file_name.endswith('.json')]
        files = sorted(files)

        for idx, file_name in enumerate(files):
            name = file_name.replace('.json', '')
            url = f"https://flask-xrcapsule.visyon.tech/json_file/{file_name}"
            files_info.append({'id': idx, 'name': name, 'url': url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
    
    return jsonify({'files': files_info})

@app.route('/json_file/<filename>', methods=['GET'])
def get_json_file(filename):
    folder = os.path.join(os.path.dirname(__file__), 'jsonpublicfiles')
    
    try:
        return send_from_directory(folder, filename, mimetype='application/json')
    except FileNotFoundError:
        return jsonify({'error': f'File {filename} not found'}), 404

@app.route('/upload_json', methods=['POST'])
def upload_json():
    folder = os.path.join(os.path.dirname(__file__), 'jsonpublicfiles')

    if not os.path.exists(folder):
        os.makedirs(folder)
        
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not file.filename.endswith('.json'):
        return jsonify({'error': 'File is not a JSON'}), 400

    try:
        file_path = os.path.join(folder, file.filename)
        file.save(file_path)
        return jsonify({'message': f'File {file.filename} uploaded successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=8080,
        debug=True
    )
