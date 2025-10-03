#!/usr/bin/env python3
import os
import glob
import re

# Chat widget script to add
chat_widget = '''
  <!-- Chat Widget -->
  <script 
  src="https://beta.leadconnectorhq.com/loader.js"  
  data-resources-url="https://beta.leadconnectorhq.com/chat-widget/loader.js" 
 data-widget-id="68de22a3721466f47cf4ef63"   > 
 </script>'''

def add_chat_widget_to_file(file_path):
    """Add chat widget to HTML file before closing body tag"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if widget already exists
        if '68de22a3721466f47cf4ef63' in content:
            print(f"  -> Already contains chat widget, skipping: {file_path}")
            return
        
        # Check if file has </body> tag
        if '</body>' not in content:
            print(f"  -> No </body> tag found, skipping: {file_path}")
            return
        
        # Add chat widget before </body>
        new_content = content.replace('</body>', chat_widget + '\n</body>')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  -> Chat widget added successfully: {file_path}")
        
    except Exception as e:
        print(f"  -> Error processing {file_path}: {e}")

def main():
    # Get all HTML files
    html_files = glob.glob('**/*.html', recursive=True)
    
    print(f"Found {len(html_files)} HTML files")
    
    for file_path in html_files:
        if file_path == 'index.html':
            continue  # Skip main index.html as it's already done
        
        print(f"Processing: {file_path}")
        add_chat_widget_to_file(file_path)

if __name__ == '__main__':
    main()
