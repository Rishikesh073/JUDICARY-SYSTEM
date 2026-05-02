import os
import PyPDF2
import json

def extract_all_cases(directory_path, output_json_path):
    processed_cases = []
    
    if not os.path.exists(directory_path):
        print(f"❌ Error: Could not find the folder at {directory_path}")
        return []

    all_items = os.listdir(directory_path)
    pdf_files = [f for f in all_items if f.lower().endswith('.pdf')]
    total_files = len(pdf_files)
    
    print(f"Scanning {directory_path}...")
    print(f"Found {total_files} PDF files. Extracting ALL files now...\n")

    for index, filename in enumerate(pdf_files, 1):
        file_path = os.path.join(directory_path, filename)
        
        try:
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                # Read every page in the PDF
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + " "
                        
                # Clean the text
                clean_text = text.replace('\n', ' ').replace('\t', ' ').strip()
                
                processed_cases.append({
                    "filename": filename,
                    "year": "2025", 
                    "content": clean_text,
                    "local_path": file_path
                })
                # Terminal output so you know it hasn't frozen
                print(f"✅ [{index}/{total_files}] Extracted: {filename[:40]}...")
                
        except Exception as e:
            print(f"⚠️ [{index}/{total_files}] Failed to read {filename[:20]}... Error: {e}")
            continue

    # Save to JSON so we don't lose the data!
    print(f"\n💾 Saving data to {output_json_path}...")
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(processed_cases, f, ensure_ascii=False, indent=4)
        
    return processed_cases

# Your target folder
target_folder = r"D:\Indian Judicial Data\supreme_court_judgments\2025"
output_file = "extracted_2025_cases.json"

# Run it!
cases = extract_all_cases(target_folder, output_file)

print(f"\n🎉 Done! Successfully extracted {len(cases)} cases.")
print(f"Next step: We will use {output_file} to feed ChromaDB.")