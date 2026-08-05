import fs from 'fs';
const file = 'src/components/SettingsModal.tsx';
let content = fs.readFileSync(file, 'utf-8');

const installBtn = `
            {/* Install App */}
            {isInstallable && (
              <button
                onClick={() => {
                  installApp();
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/40 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <Download className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-zinc-200 font-medium tracking-tight">Установить приложение</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Добавить на рабочий стол</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </button>
            )}
`;

content = content.replace('{/* Replay OS Loading Splash Animation */}', installBtn + '\n            {/* Replay OS Loading Splash Animation */}');

fs.writeFileSync(file, content);
