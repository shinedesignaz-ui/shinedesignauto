#!/usr/bin/env python3
import os
import glob

def find_redundant_folders():
    """Find folders that have a single HTML file with the same name as the folder"""
    redundant_folders = []
    
    # Get all directories
    for item in os.listdir('.'):
        if os.path.isdir(item) and not item.startswith('.'):
            folder_name = item
            expected_file = os.path.join(folder_name, f"{folder_name}.html")
            
            if os.path.exists(expected_file):
                # Count HTML files in the directory
                html_files = glob.glob(os.path.join(folder_name, "*.html"))
                if len(html_files) == 1:  # Only one HTML file
                    redundant_folders.append((folder_name, expected_file))
                    print(f"Single file folder: {folder_name} -> {expected_file}")
                else:
                    print(f"Multiple files folder: {folder_name} (keeping as-is)")
    
    return redundant_folders

if __name__ == '__main__':
    print("Scanning for folders with redundant naming...")
    redundant_folders = find_redundant_folders()
    print(f"\nFound {len(redundant_folders)} folders to fix")
