import fs from 'fs';
const file = 'src/translations.ts';
let content = fs.readFileSync(file, 'utf-8');

const ruAdd = `
    search_messages: 'Поиск сообщений...',
    no_messages_found: 'Сообщения не найдены',
    select_a_conversation: 'Выберите чат',
    choose_a_conversation_from_the_l: 'Выберите диалог из списка слева, чтобы начать общение.',
`;

const enAdd = `
    search_messages: 'Search messages...',
    no_messages_found: 'No messages found',
    select_a_conversation: 'Select a conversation',
    choose_a_conversation_from_the_l: 'Choose a conversation from the list to start chatting.',
`;

content = content.replace(/ru:\s*\{/, "ru: {\n" + ruAdd);
content = content.replace(/en:\s*\{/, "en: {\n" + enAdd);

fs.writeFileSync(file, content);
