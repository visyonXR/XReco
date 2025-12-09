import bpy
import sys
import os

def clear_scene():
    bpy.ops.object.select_all(action='DESELECT')
    bpy.ops.object.select_by_type(type='MESH')
    bpy.ops.object.delete()

def import_obj(filepath):
    bpy.ops.wm.obj_import(filepath=filepath)

def import_glb(filepath):
    bpy.ops.import_scene.gltf(filepath=filepath)

def import_fbx(filepath):
    bpy.ops.import_scene.fbx(filepath=filepath)

def import_usd(filepath):
    bpy.ops.wm.usd_import(filepath=filepath)

def apply_decimation(factor):
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            bpy.context.view_layer.objects.active = obj
            decimate_modifier = bpy.ops.object.modifier_add(type='DECIMATE')
            obj.modifiers['Decimate'].ratio = factor
            bpy.ops.object.modifier_apply(modifier=obj.modifiers['Decimate'].name)

def export_glb(output_filepath):
    bpy.ops.export_scene.gltf(filepath=output_filepath, use_selection=False)

def process_geometry(input_filepath, output_filepath=None, decimation_scale=0.5):
    clear_scene()

    if(output_filepath == None):
        a, b = os.path.split(input_filepath)
        b = b.split('.')[0]
        output_filepath = a+"/decimated_"+b

        print(output_filepath)

    if(('.glb' in input_filepath.lower()) or ('.gltf' in input_filepath.lower())):
        import_glb(input_filepath)
    else:
        if(('.obj' in input_filepath.lower())):
            import_obj(input_filepath)
        else:
            if(('.usd' in input_filepath.lower()) or ('.usdz' in input_filepath.lower())):
                import_usd(input_filepath)
            else:
                if(('.fbx' in input_filepath.lower())):
                    import_fbx(input_filepath)
                else:
                    print("UNSUPPORTED FILE FORMAT")
                    return
    apply_decimation(decimation_scale)
    export_glb(output_filepath)

if __name__ == "__main__":
    argv = sys.argv
    input_filepath = argv[argv.index("--") + 1]
    output_filepath = argv[argv.index("--") + 2]
    decimation_scale = float(argv[argv.index("--") + 3])
    
    process_geometry(input_filepath, output_filepath, decimation_scale)
