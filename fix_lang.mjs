import fs from 'fs';
const file = 'src/components/LanguageModal.tsx';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace("t('russian')", "'Русский'");
content = content.replace("t('russia')", "'Россия'");
content = content.replace("t('main_interface_and_prompt_lang')", "'Основной язык интерфейса и промптов'");

content = content.replace("t('ukrainian')", "'Українська'");
content = content.replace("t('ukraine')", "'Україна'");
content = content.replace("t('full_localization_of_interface')", "'Полная локализация интерфейса'");

content = content.replace("t('kazakh')", "'Қазақша'");
content = content.replace("t('kazakhstan')", "'Казахстан'");
content = content.replace("t('interface_and_navigation_langu')", "'Язык интерфейса и навигации'");

content = content.replace("t('belarusian')", "'Беларуская'");
content = content.replace("t('belarus')", "'Беларусь'");
content = content.replace("t('language_of_controls_and_setti')", "'Язык элементов управления и настроек'");

fs.writeFileSync(file, content);
