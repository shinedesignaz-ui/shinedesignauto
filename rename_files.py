#!/usr/bin/env python3
import os
import shutil

def rename_files():
    """Rename redundant files to index.html"""
    renames = [
        ('coolidge/coolidge.html', 'coolidge/index.html'),
        ('mesa/mesa.html', 'mesa/index.html'),
        ('gilbert/gilbert.html', 'gilbert/index.html'),
        ('ceramic-coating/ceramic-coating.html', 'ceramic-coating/index.html'),
        ('fleet-services/fleet-services.html', 'fleet-services/index.html'),
        ('thank-you/thank-you.html', 'thank-you/index.html'),
        ('florence/florence.html', 'florence/index.html'),
        ('san-tan-valley/san-tan-valley.html', 'san-tan-valley/index.html'),
        ('memberships/memberships.html', 'memberships/index.html'),
        ('apache-junction/apache-junction.html', 'apache-junction/index.html'),
        ('scottsdale/scottsdale.html', 'scottsdale/index.html'),
        ('gold-canyon/gold-canyon.html', 'gold-canyon/index.html'),
        ('leave-a-review/leave-a-review.html', 'leave-a-review/index.html'),
        ('chandler/chandler.html', 'chandler/index.html'),
    ]
    
    for old_path, new_path in renames:
        if os.path.exists(old_path):
            shutil.move(old_path, new_path)
            print(f"Renamed: {old_path} -> {new_path}")
        else:
            print(f"File not found: {old_path}")
    
    print(f"\nCompleted renaming {len(renames)} files!")

if __name__ == '__main__':
    rename_files()
