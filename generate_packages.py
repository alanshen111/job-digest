"""
Generates the browser distribution packages
Make sure to compile the TypeScript files first
"""

import os
import shutil
import subprocess

CHROME_OUTPUT_DIR = "dist-chrome"
FIREFOX_OUTPUT_DIR = "dist-firefox"
CHROME_MANIFEST_DIR = "manifest-chrome"
FIREFOX_MANIFEST_DIR = "manifest-firefox"
COMPILED_FILES_DIR = "dist"

def create_directory(directory):
    if os.path.exists(directory):
        shutil.rmtree(directory)
        print(f"Deleted existing directory: {directory}")
    os.makedirs(directory)
    print(f"Created directory: {directory}")

def compile_typescript():
    print("Compiling TypeScript files...")
    try:
        subprocess.check_call(['tsc'], cwd=os.getcwd(), shell=True)
        print("TypeScript compilation completed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error during TypeScript compilation: {e}")
        exit(1)

def copy_files(src_dir, dest_dir):
    for filename in os.listdir(src_dir):
        src = os.path.join(src_dir, filename)
        dest = os.path.join(dest_dir, filename)
        if os.path.isdir(src):
            shutil.copytree(src, dest)
        else:
            shutil.copy2(src, dest)

def delete_test_manifest(dist_dir):
    manifest_path = os.path.join(dist_dir, 'manifest.json')
    if os.path.exists(manifest_path):
        os.remove(manifest_path) 
        print(f"Deleted {manifest_path}")

compile_typescript()
create_directory(CHROME_OUTPUT_DIR)
create_directory(FIREFOX_OUTPUT_DIR)
delete_test_manifest(COMPILED_FILES_DIR)
copy_files(COMPILED_FILES_DIR, CHROME_OUTPUT_DIR)
copy_files(COMPILED_FILES_DIR, FIREFOX_OUTPUT_DIR)
copy_files(CHROME_MANIFEST_DIR, CHROME_OUTPUT_DIR)
copy_files(FIREFOX_MANIFEST_DIR, FIREFOX_OUTPUT_DIR)

print("Packaging completed.")
