#!/usr/bin/env python3
import os
import shutil
import glob
import re

def rename_remaining_files():
    """Rename remaining redundant files to index.html"""
    remaining_renames = [
        ('coolidge/coolidge.html', 'coolidge/index.html'),
        ('mesa/mesa.html', 'mesa/index.html'),
        ('gilbert/gilbert.html', 'gilbert/index.html'),
        ('ceramic-coating/ceramic-coating.html', 'ceramic-coating/index.html'),
        ('fleet-services/fleet-services.html', 'fleet-services/index.html'),
        ('thank-you/thank-you.html', 'thank-you/index.html'),
        ('florence/florence.html', 'florence/index.html'),
        ('san-tan-valley/san-tan-valley.html', 'san-tan-valley/index.html'),
        ('apache-junction/apache-junction.html', 'apache-junction/index.html'),
        ('scottsdale/scottsdale.html', 'scottsdale/index.html'),
        ('gold-canyon/gold-canyon.html', 'gold-canyon/index.html'),
        ('leave-a-review/leave-a-review.html', 'leave-a-review/index.html'),
        ('chandler/chandler.html', 'chandler/index.html'),
    ]
    
    renamed_count = 0
    for old_path, new_path in remaining_renames:
        if os.path.exists(old_path):
            shutil.move(old_path, new_path)
            print(f"Renamed: {old_path} -> {new_path}")
            renamed_count += 1
        else:
            print(f"File not found (may already be renamed): {old_path}")
    
    return renamed_count

def update_internal_links():
    """Update all internal links across all HTML files"""
    link_mappings = {
        '/coolidge/coolidge.html': '/coolidge/',
        '/mesa/mesa.html': '/mesa/',
        '/gilbert/gilbert.html': '/gilbert/',
        '/ceramic-coating/ceramic-coating.html': '/ceramic-coating/',
        '/fleet-services/fleet-services.html': '/fleet-services/',
        '/thank-you/thank-you.html': '/thank-you/',
        '/florence/florence.html': '/florence/',
        '/san-tan-valley/san-tan-valley.html': '/san-tan-valley/',
        '/memberships/memberships.html': '/memberships/',
        '/apache-junction/apache-junction.html': '/apache-junction/',
        '/scottsdale/scottsdale.html': '/scottsdale/',
        '/gold-canyon/gold-canyon.html': '/gold-canyon/',
        '/leave-a-review/leave-a-review.html': '/leave-a-review/',
        '/chandler/chandler.html': '/chandler/',
        
        # Also handle relative links
        'coolidge/coolidge.html': '/coolidge/',
        'mesa/mesa.html': '/mesa/',
        'gilbert/gilbert.html': '/gilbert/',
        'ceramic-coating/ceramic-coating.html': '/ceramic-coating/',
        'fleet-services/fleet-services.html': '/fleet-services/',
        'thank-you/thank-you.html': '/thank-you/',
        'florence/florence.html': '/florence/',
        'san-tan-valley/san-tan-valley.html': '/san-tan-valley/',
        'memberships/memberships.html': '/memberships/',
        'apache-junction/apache-junction.html': '/apache-junction/',
        'scottsdale/scottsdale.html': '/scottsdale/',
        'gold-canyon/gold-canyon.html': '/gold-canyon/',
        'leave-a-review/leave-a-review.html': '/leave-a-review/',
        'chandler/chandler.html': '/chandler/',
    }
    
    html_files = glob.glob('**/*.html', recursive=True)
    updated_files = []
    
    for file_path in html_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Update all the link mappings
            for old_link, new_link in link_mappings.items():
                # Handle href attributes
                content = re.sub(f'href=["\']{re.escape(old_link)}["\']', f'href="{new_link}"', content)
                
                # Handle action attributes (for forms)
                content = re.sub(f'action=["\']{re.escape(old_link)}["\']', f'action="{new_link}"', content)
                
                # Handle canonical links
                content = re.sub(f'<link rel="canonical" href=["\']{re.escape(old_link)}["\']', f'<link rel="canonical" href="{new_link}"', content)
                
                # Handle Open Graph URLs
                content = re.sub(f'<meta property="og:url" content=["\']{re.escape(old_link)}["\']', f'<meta property="og:url" content="{new_link}"', content)
            
            # Only write if content changed
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                updated_files.append(file_path)
                print(f"Updated links in: {file_path}")
        
        except Exception as e:
            print(f"Error updating {file_path}: {e}")
    
    return updated_files

def main():
    print("=== FIXING WEBSITE STRUCTURE AND LINKS ===\n")
    
    print("Step 1: Renaming redundant files to index.html...")
    renamed_count = rename_remaining_files()
    print(f"Renamed {renamed_count} files\n")
    
    print("Step 2: Updating internal links across all pages...")
    updated_files = update_internal_links()
    print(f"Updated links in {len(updated_files)} files\n")
    
    print("=== SUMMARY ===")
    print(f"✅ Renamed {renamed_count} files to index.html")
    print(f"✅ Updated internal links in {len(updated_files)} files")
    print(f"✅ All URLs are now clean (e.g., /memberships/ instead of /memberships/memberships.html)")
    print("\nYour website structure is now optimized!")

if __name__ == '__main__':
    main()
