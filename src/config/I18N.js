
import I18n from 'react-native-i18n';

import String_en from "../string/String_en"
import String_ar from "../string/String_ar"

I18n.fallbacks = true;

I18n.translations = {
    ar: String_ar,
    en: String_en,
    
};

export default I18n;