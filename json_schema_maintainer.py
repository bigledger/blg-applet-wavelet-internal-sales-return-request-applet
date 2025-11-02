import json
import os
import re

def parse_ts_object(ts_content):
    """
    Extracts the main object literal from a TypeScript file's content.
    """
    # Find the start of the object literal after the '='
    match = re.search(r'=\s*\{', ts_content)
    if not match:
        raise ValueError("Could not find the start of the object literal in the TS file.")
    
    start_index = match.end() - 1
    
    # Use a balance counter to find the matching closing brace
    balance = 0
    end_index = -1
    for i in range(start_index, len(ts_content)):
        if ts_content[i] == '{':
            balance += 1
        elif ts_content[i] == '}':
            balance -= 1
            if balance == 0:
                end_index = i + 1
                break
    
    if end_index == -1:
        raise ValueError("Could not find the matching closing brace for the object literal.")

    # Extract and parse the JSON part
    json_str = ts_content[start_index:end_index]
    return json.loads(json_str)

def load_schema_keys_from_ts_file(schema_file_path):
    """
    Loads schema keys from a TypeScript file.
    """
    with open(schema_file_path, 'r', encoding='utf-8') as schema_file:
        try:
            ts_content = schema_file.read()
            schema_data = parse_ts_object(ts_content)
            return get_all_keys(schema_data)
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error processing schema file {schema_file_path}: {e}")
            return set()

def get_all_keys(data, parent_keys=None):
    keys = set()
    if parent_keys is None:
        parent_keys = []
    if isinstance(data, dict):
        for key, value in data.items():
            keys.add(tuple(parent_keys + [key]))
            keys.update(get_all_keys(value, parent_keys + [key]))
    elif isinstance(data, list):
        for i, item in enumerate(data):
            keys.update(get_all_keys(item, parent_keys + [i]))
    return keys

def update_keys_in_ts_file(ts_file_path, schema_keys):
    """
    Updates a TypeScript file with missing keys from the schema.
    """
    lang_code = os.path.basename(ts_file_path).split('.')[0]
    with open(ts_file_path, 'r', encoding='utf-8') as file:
        try:
            ts_content = file.read()
            json_data = parse_ts_object(ts_content)
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error processing TS file {ts_file_path}: {e}")
            return

    need_to_update_file = False
    for key_path in schema_keys:
        if not has_key_path(key_path, json_data):
            need_to_update_file = True
            add_key_path(key_path, json_data)
    
    if need_to_update_file:
        with open(ts_file_path, 'w', encoding='utf-8') as file:
            # Reconstruct the TypeScript file content
            file.write(f"export const {lang_code} = ")
            json.dump(json_data, file, indent=2, ensure_ascii=False)
            file.write(";")
            print(f"Updated {ts_file_path} with missing keys from the schema.")

def has_key_path(target_path, data):
    # This function and add_key_path remain the same as they operate on the parsed dictionary
    if isinstance(data, dict):
        current_key = target_path[0]
        if current_key in data:
            if len(target_path) == 1:
                return True
            else:
                return has_key_path(target_path[1:], data[current_key])
    elif isinstance(data, list):
        index = target_path[0]
        if 0 <= index < len(data):
            if len(target_path) == 1:
                return True
            else:
                return has_key_path(target_path[1:], data[index])
    return False

def add_key_path(target_path, data):
    current_data = data
    for key in target_path:
        if isinstance(current_data, dict):
            if key not in current_data:
                current_data[key] = ""
            current_data = current_data[key]
        elif isinstance(current_data, list):
            index = key
            while len(current_data) <= index:
                current_data.append("")
            current_data = current_data[index]

def update_keys_in_directory(directory_path, schema_file_path):
    schema_keys = load_schema_keys_from_ts_file(schema_file_path)
    if not os.path.exists(schema_file_path):
        print(f"Schema file {schema_file_path} not found in the directory.")
        return
    for filename in os.listdir(directory_path):
        if filename.endswith(".ts") and filename != os.path.basename(schema_file_path) and filename != "index.ts":
            ts_file_path = os.path.join(directory_path, filename)
            update_keys_in_ts_file(ts_file_path, schema_keys)

if __name__ == "__main__":
    # Point this to your en.ts file
    source_schema_file = "C:/Wavelet/FE/blg-applets-wavelet-erp-v3/micro-fe/projects/wavelet-erp/applets/internal-sales-inquiry-applet/src/locales/i18n/en.ts"
    # Point this to the directory containing your .ts language files
    target_directory = "C:/Wavelet/FE/blg-applets-wavelet-erp-v3/micro-fe/projects/wavelet-erp/applets/internal-sales-inquiry-applet/src/locales/i18n"
    update_keys_in_directory(target_directory, source_schema_file)
