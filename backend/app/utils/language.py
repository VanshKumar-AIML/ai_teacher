# Simple language detection/translation placeholder
# In production, use Google Translate or LLM-based translation

def get_language_name(code: str) -> str:
    mapping = {
        "en": "English",
        "hi": "Hindi",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
    }
    return mapping.get(code, "English")

def translate_text(text: str, target_lang: str) -> str:
    # Placeholder: in a real system, call Google Translate API or use an LLM
    # For demo, we assume the LLM already generates in the target language
    return text