import fs from 'fs';

const transFile = 'src/translations.ts';
let transContent = fs.readFileSync(transFile, 'utf-8');

transContent = transContent.replace(/ru:\s*\{/, "ru: {\n    install_app: 'Установить приложение',\n    add_to_home_screen: 'Добавить на рабочий стол',");
transContent = transContent.replace(/en:\s*\{/, "en: {\n    install_app: 'Install App',\n    add_to_home_screen: 'Add to home screen',");
transContent = transContent.replace(/uk:\s*\{/, "uk: {\n    install_app: 'Встановити додаток',\n    add_to_home_screen: 'Додати на робочий стіл',");
transContent = transContent.replace(/kk:\s*\{/, "kk: {\n    install_app: 'Қолданбаны орнату',\n    add_to_home_screen: 'Жұмыс үстеліне қосу',");
transContent = transContent.replace(/be:\s*\{/, "be: {\n    install_app: 'Усталяваць праграму',\n    add_to_home_screen: 'Дадаць на працоўны стол',");

fs.writeFileSync(transFile, transContent);
