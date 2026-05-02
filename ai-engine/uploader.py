import json
import cloudinary
import cloudinary.uploader
import time

# Configure Cloudinary (Grab these from your Cloudinary Dashboard)
cloudinary.config(
    cloud_name = 'dsr7valkc',
    api_key = '839485559776489',
    api_secret = 'E6MRVsRPVrMdBftUmfBRksgyhvU'
)

def upload_to_cloudinary(json_file):
    with open(json_file, 'r', encoding='utf-8') as f:
        cases = json.load(f)

    print(f"Found {len(cases)} cases. Starting Cloudinary upload...")

    for index, case in enumerate(cases, 1):
        # Skip if already uploaded (useful if the script gets interrupted and restarted)
        if 'cloudinary_url' in case:
            continue

        local_path = case['local_path']
        try:
            # resource_type="raw" is strictly REQUIRED for PDFs in Cloudinary
            response = cloudinary.uploader.upload(local_path, resource_type="raw", folder="lexagent_cases")
            case['cloudinary_url'] = response['secure_url']
            print(f"✅ [{index}/{len(cases)}] Uploaded: {case['filename'][:30]}...")

            # Save incrementally
            with open('extracted_cases_with_urls.json', 'w', encoding='utf-8') as out_f:
                json.dump(cases, out_f, ensure_ascii=False, indent=4)

        except Exception as e:
            print(f"❌ [{index}/{len(cases)}] Failed to upload {case['filename'][:30]}: {e}")
            time.sleep(2) # Brief pause to respect rate limits if needed

    print("\n🎉 All files uploaded successfully. 'extracted_cases_with_urls.json' is ready.")

upload_to_cloudinary('extracted_2025_cases.json')