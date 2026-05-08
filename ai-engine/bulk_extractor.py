import os
import PyPDF2
import json
import re

def clean_text(text):
    # Remove excessive whitespace and malformed characters
    text = re.sub(r'\s+', ' ', text)
    text = ''.join(i for i in text if ord(i) < 128) # Filter non-ASCII for JSON safety
    return text.strip()

def extract_bulk_cases(base_dir, output_json_path, existing_2025_json=None):
    master_cases = []
    
    # Load existing 2025 data to merge
    if existing_2025_json and os.path.exists(existing_2025_json):
        print(f"📦 Loading existing 2025 data from {existing_2025_json}...")
        with open(existing_2025_json, 'r', encoding='utf-8') as f:
            master_cases = json.load(f)
        print(f"✅ Loaded {len(master_cases)} existing cases.")

    if not os.path.exists(base_dir):
        print(f"❌ Error: Base directory {base_dir} not found.")
        return

    # Find all year folders (1950-2024)
    all_folders = [f for f in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, f)) and f.isdigit()]
    all_folders.sort() # Process chronologically

    print(f"🔍 Found {len(all_folders)} year folders in {base_dir}")

    for year_folder in all_folders:
        # Skip 2025 as we already handled it (unless we want to re-process)
        if year_folder == "2025":
            continue
            
        year_path = os.path.join(base_dir, year_folder)
        pdf_files = [f for f in os.listdir(year_path) if f.lower().endswith('.pdf')]
        
        if not pdf_files:
            continue

        print(f"\n📂 Processing Year: {year_folder} ({len(pdf_files)} files)")
        
        for index, filename in enumerate(pdf_files, 1):
            file_path = os.path.join(year_path, filename)
            
            # Simple check to avoid duplicates if re-running
            if any(c['filename'] == filename for c in master_cases):
                continue

            try:
                with open(file_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    text = ""
                    for page in reader.pages:
                        extracted = page.extract_text()
                        if extracted:
                            text += extracted + " "
                    
                    if not text.strip():
                        print(f"⚠️  Skipping empty PDF: {filename}")
                        continue

                    master_cases.append({
                        "filename": filename,
                        "year": year_folder,
                        "content": clean_text(text),
                        "local_path": file_path,
                        "court": "Supreme Court of India" # Default for this dataset
                    })
                    
                    if index % 10 == 0 or index == len(pdf_files):
                        print(f"   ✅ [{index}/{len(pdf_files)}] Extracted {filename[:30]}...")

            except Exception as e:
                print(f"   ❌ Failed {filename}: {e}")
                continue

        # Save progress after every year to avoid data loss
        print(f"💾 Saving progress... Total cases so far: {len(master_cases)}")
        with open(output_json_path, 'w', encoding='utf-8') as f:
            json.dump(master_cases, f, ensure_ascii=False, indent=4)

    print(f"\n🎉 SUCCESS: All historical data extracted and merged.")
    print(f"Total Master Dataset Size: {len(master_cases)} cases.")
    print(f"File Saved: {output_json_path}")

if __name__ == "__main__":
    # CONFIGURATION
    BASE_JUDICIAL_DIR = r"D:\Indian Judicial Data\supreme_court_judgments"
    OUTPUT_FILE = "master_judicial_dataset.json"
    EXISTING_2025 = "extracted_2025_cases.json"

    extract_bulk_cases(BASE_JUDICIAL_DIR, OUTPUT_FILE, EXISTING_2025)
