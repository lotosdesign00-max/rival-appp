import re
import sys

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Import
    if "import { useTranslation }" not in content:
        content = content.replace("import { useApp } from '../context/AppContext';", "import { useApp } from '../context/AppContext';\nimport { useTranslation } from '../context/LanguageContext';")

    # Add t
    content = content.replace("const { profile, showToast, withdrawBalance } = useApp();", "const { profile, showToast, withdrawBalance } = useApp();\n  const { t } = useTranslation();")

    content = content.replace("'Enter a valid amount'", "t('withdraw_error_amount')")
    content = content.replace("'Insufficient funds'", "t('withdraw_error_funds')")
    content = content.replace("`Успешный вывод $${parsedAmount.toFixed(2)}`", "`${t('withdraw_success')} $${parsedAmount.toFixed(2)}`")

    content = content.replace("Withdraw Funds", "{t('withdraw_title')}")
    content = content.replace("Transfer your available balance securely", "{t('withdraw_subtitle')}")
    content = content.replace("AVAILABLE FOR WITHDRAWAL", "{t('withdraw_available')}")
    content = content.replace("SELECT METHOD", "{t('withdraw_method_label')}")
    
    content = content.replace("Cryptocurrency", "{t('withdraw_crypto')}")
    content = content.replace("Bank Card", "{t('withdraw_card')}")
    
    content = content.replace("WITHDRAW AMOUNT", "{t('withdraw_amount_label')}")
    content = content.replace("MAX", "{t('withdraw_max_btn')}")
    
    content = content.replace("TRANSACTION SUMMARY", "{t('withdraw_summary_title')}")
    content = content.replace("Withdrawal Amount</span>", "{t('withdraw_summary_amount')}</span>")
    content = content.replace("Network Fee</span>", "{t('withdraw_summary_fee')}</span>")
    content = content.replace("Estimated Arrival</span>", "{t('withdraw_summary_time')}</span>")
    content = content.replace("~15 Mins", "{t('withdraw_summary_time_val')}")
    content = content.replace("You Receive", "{t('withdraw_summary_receive')}")
    content = content.replace("End-to-end encrypted secure withdrawal", "{t('withdraw_secure_msg')}")
    content = content.replace("Processing...'", "t('withdraw_processing')")
    content = content.replace("Confirm Withdrawal'", "t('withdraw_confirm_btn')")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

patch_file('src/components/WithdrawModal.tsx')
print("Successfully patched src/components/WithdrawModal.tsx")
