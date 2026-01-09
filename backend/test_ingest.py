import sys
import os

print("Starting test...")
try:
    import rag_service
    print("rag_service imported successfully")
except Exception as e:
    print(f"Failed to import rag_service: {e}")
    sys.exit(1)

test_file = "debug_test.txt"
with open(test_file, "w", encoding="utf-8") as f:
    f.write("This is a debug test file content.")

try:
    print(f"Attempting to ingest {test_file}...")
    count = rag_service.ingest_document(test_file, test_file)
    print(f"Ingest successful. Chunks: {count}")
except Exception as e:
    print(f"Ingest failed: {e}")
    import traceback
    traceback.print_exc()
finally:
    if os.path.exists(test_file):
        os.remove(test_file)
