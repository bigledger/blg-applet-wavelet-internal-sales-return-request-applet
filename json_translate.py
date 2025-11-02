import json
import os
import re
from googletrans import Translator

# Define target languages for translation
LANGUAGES = {
    "ar": "Arabic",
    "hi": "Hindi",
    "id": "Indonesian",
    "ms": "Malay",
    "zh-CN": "Chinese (Simplified)",
}

def parse_ts_object(ts_content):
    """
    Extracts the main object literal from a TypeScript file's content.
    """
    match = re.search(r'=\s*\{', ts_content)
    if not match:
        raise ValueError("Could not find the start of the object literal in the TS file.")
    
    start_index = match.end() - 1
    
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

    json_str = ts_content[start_index:end_index]
    return json.loads(json_str)

def translate_text(text, target_language, translator):
    """
    Translates a given text to the specified target language.
    """
    try:
        translated = translator.translate(text, dest=target_language)
        return translated.text
    except Exception as e:
        print(f"Error translating '{text}' to '{target_language}': {e}")
        return text

def translate_dictionary(content, target_language, translator):
    """
    Recursively translates a dictionary's values.
    """
    translated_content = {}
    for key, value in content.items():
        if isinstance(value, dict):
            translated_content[key] = translate_dictionary(value, target_language, translator)
        elif isinstance(value, str):
            translated_content[key] = translate_text(value, target_language, translator)
        else:
            translated_content[key] = value # Keep non-string values as is
    return translated_content

def save_translated_content_to_ts(translated_content, target_file, lang_code):
    """
    Saves the translated dictionary to a .ts file with TypeScript export syntax.
    """
    try:
        with open(target_file, "w", encoding="utf-8") as f:
            f.write(f"export const {lang_code} = ")
            json.dump(translated_content, f, ensure_ascii=False, indent=2)
            f.write(";")
        print(f"Translation saved to {target_file}")
    except Exception as e:
        print(f"Error saving file {target_file}: {e}")

def translate_and_save_ts_files(source_file, target_directory, languages):
    """
    Translates and saves .ts files for each specified language.
    """
    if source_file.endswith("index.ts"):
        return
    try:
        with open(source_file, "r", encoding="utf-8") as f:
            ts_content = f.read()
            content = parse_ts_object(ts_content)
    except (IOError, ValueError) as e:
        print(f"Error loading or parsing source file '{source_file}': {e}")
        return

    translator = Translator()

    for lang_code, lang_name in languages.items():
        print(f"Translating to {lang_name} ({lang_code})...")
        translated_content = translate_dictionary(content, lang_code, translator)
        
        # Handle specific language code variations if necessary
        file_lang_code = 'zh' if lang_code == 'zh-CN' else lang_code
        
        target_file = os.path.join(target_directory, f"{file_lang_code}.ts")
        save_translated_content_to_ts(translated_content, target_file, file_lang_code)

if __name__ == "__main__":
    # Point this to your en.ts file
    SOURCE_FILE = "C:/Wavelet/FE/blg-applets-wavelet-erp-v3/micro-fe/projects/wavelet-erp/applets/internal-sales-inquiry-applet/src/locales/i18n/en.ts"
    # Point this to the directory where you want to save the .ts language files
    TARGET_DIRECTORY = "C:/Wavelet/FE/blg-applets-wavelet-erp-v3/micro-fe/projects/wavelet-erp/applets/internal-sales-inquiry-applet/src/locales/i18n"

    translate_and_save_ts_files(SOURCE_FILE, TARGET_DIRECTORY, LANGUAGES)