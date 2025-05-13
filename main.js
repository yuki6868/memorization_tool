const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let backend;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // main.py のパスを取得
  const backendPath = path.join(__dirname, 'main.py');
  console.log(`Backend Path: ${backendPath}`);

  // ==============================
  // Python FastAPI サーバーの起動
  // ==============================
  const backend = spawn('python', [backendPath], {
    cwd: path.join(__dirname),
    shell: true,
    env: {
        ...process.env,
        PATH: process.env.PATH + ':/Users/nakagawa/anaconda3/envs/fastapi_env/bin'
    },
    stdio: 'inherit'
  });

  backend.on('close', (code) => {
    console.log(`FastAPI Process exited with code ${code}`);
  });

  // ==============================
  // フロントエンドのロード
  // ==============================
  setTimeout(() => {
    // win.loadURL('http://localhost:8000/memos');
    win.loadFile(path.join(__dirname, 'frontapp/index.html'));
  }, 2000);  // 2秒待機してから接続
};

app.whenReady().then(createWindow);

// アプリケーション終了時にサーバーも停止
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  
  // **Pythonプロセスの終了処理**
  if (backend) {
    console.log('Pythonプロセスを終了します');
    backend.kill('SIGTERM');  // 優しく停止シグナルを送る
    // 1秒待っても終了しない場合、強制終了
    // setTimeout(() => {
    //   if (!backend.killed) {
    //     console.log('Pythonプロセスがまだ終了していないため、強制終了します');
    //     backend.kill('SIGKILL'); // 強制終了
    //   }
    // }, 1000);
  }
});
