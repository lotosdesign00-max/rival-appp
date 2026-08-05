import re
import sys

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Import
    if "import { useTranslation }" not in content:
        content = content.replace("import { useApp } from '../context/AppContext';", "import { useApp } from '../context/AppContext';\nimport { useTranslation } from '../context/LanguageContext';")

    # Add t
    content = content.replace("const { profile, showToast, depositBalance } = useApp();", "const { profile, showToast, depositBalance } = useApp();\n  const { t } = useTranslation();")

    # Replace hardcoded text with t()
    content = content.replace("'Введите корректную сумму'", "t('topup_error_amount')")
    content = content.replace("'Успешно оплачено звездами'", "t('topup_success_stars')")
    content = content.replace("'Оплата отменена'", "t('topup_cancelled')")
    content = content.replace("'Ссылка на оплату открыта в новой вкладке'", "t('topup_redirect_msg')")
    
    content = content.replace("'API Telegram Stars не настроен. Пополняем в демо-режиме.'", "t('topup_demo_msg')")
    content = content.replace("`Демо: оплата через ${depositMethod} прошла успешно`", "t('topup_success_demo')")

    content = content.replace("Top Up Balance", "{t('topup_title')}")
    content = content.replace("Instant deposit via Telegram Stars or Card", "{t('topup_subtitle')}")
    content = content.replace("SELECT AMOUNT", "{t('topup_amount_label')}")
    content = content.replace("PAYMENT METHOD", "{t('topup_method_label')}")
    
    content = content.replace("val === 'Custom' ? 'Custom'", "val === 'Custom' ? t('topup_custom_amount')")
    content = content.replace("{['10', '25', '50', '100', '250', 'Custom'].map(val =>", "{['10', '25', '50', '100', '250', 'Custom'].map(val =>")
    
    content = content.replace("SUMMARY", "{t('topup_summary_title')}")
    content = content.replace("Amount</span>", "{t('topup_summary_amount')}</span>")
    content = content.replace("Processing Fee (0%)</span>", "{t('topup_summary_fee')} (0%)</span>")
    content = content.replace("Total to pay</span>", "{t('topup_summary_total')}</span>")
    content = content.replace("Secure Payments via Official APIs", "{t('topup_secure_msg')}")
    content = content.replace("Connecting to gateway...'", "t('topup_processing')")
    content = content.replace("Continue to ${", "`${t('topup_continue_btn')} ${")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

patch_file('src/components/TopUpModal.tsx')
print("Successfully patched src/components/TopUpModal.tsx")
