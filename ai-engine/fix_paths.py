import json
import os

def fix_paths(filepath):
    print(f"Fixing paths in {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for item in data:
        if 'local_path' in item:
            windows_path = item['local_path']
            # Convert D:\Indian Judicial Data\supreme_court_judgments\2025\ to Mac path
            # Assuming we want to map D:\Indian Judicial Data to /Users/omchauhan/Indian Judicial Data
            mac_path = windows_path.replace("D:\\", "/Users/omchauhan/").replace("\\", "/")
            item['local_path'] = mac_path

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    print(f"Finished updating {filepath}")

if __name__ == "__main__":
    files_to_fix = [
        "extracted_2025_cases.json",
        "extracted_cases_with_urls.json"
    ]
    
    for f in files_to_fix:
        if os.path.exists(f):
            fix_paths(f)
        else:
            print(f"File not found: {f}")
