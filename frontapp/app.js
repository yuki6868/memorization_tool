// グローバルスコープでFastAPIのURLを定義
const apiUrl = 'http://localhost:8000/memos';

// 編集中のメモIDを保持する変数
let editingMemoId = null;

/**
* メッセージをアラートダイアログで表示する関数
*/
function displayMessage(message) {
    // アラート：テキストをポップアップ表示させるもの
    alert(message);
}

/**
* フォームをリセットし新規登録モードに戻す関数
*/
function resetForm() {
    // フォームのタイトルをリセット
    // htmlのタグのidがformTitleである場所を探しその文章を'メモの作成'に変更する
    document.getElementById('formTitle').textContent = 'やったことの登録';
    // 項目：タイトルをリセット
    document.getElementById('title').value = '';
    // 項目：詳細をリセット
    document.getElementById('description').value = '';
    // 項目：日付をリセット
    document.getElementById('date').value = '';
    // 項目：手応えをリセット
    document.getElementById('radio').value = '';
    // 更新実行ボタンを非表示にする
    document.getElementById('updateButton').style.display = 'none';
    // 新規登録ボタンを再表示
    document.querySelector('#createDoForm button[type="submit"]').style.display = 'block';
    // 編集中のメモIDをリセット
    editingMemoId = null;
}

/**
* 新規登録：非同期関数
*/
async function createMemo(memo) {
    try {
        // APIに「POSTリクエスト」を送信してメモを作成します。
        // headersに'Content-Type'を'application/json'に設定し
        // JSON形式のデータを送信
        console.log(memo)
        const response = await fetch(apiUrl, {
            method: 'POST',
            // JSON形式を扱うのでその形式に合わせる(Content-Typeをapplication/jsonに変更する理由)
            headers: {'Content-Type': 'application/json'},
            // メモオブジェクトをJSON文字列に変換して送信
            body: JSON.stringify(memo)
        });
        // レスポンスのボディをJSONとして解析
        const data = await response.json();
        // レスポンスが成功した場合（HTTPステータスコード：200）
        // レスポンスが成功したかどうかを表すもの
        if (response.ok) {
            // 成功メッセージをアラートで表示
            displayMessage(data.message);
            // フォームをリセットして新規入力状態に戻す
            resetForm();
            // HTML内のメモ一覧を表示する部分を取得
            const memosTableBody = document.querySelector('#willdo tbody');
            // 一覧をクリア
            // memosTableBody.innerHTML = '';
            // 取得したメモのデータを１つずつ設定
            const row = document.createElement('tr');
            // 行の中身：タイトル、説明、編集と削除ボタン
            console.log(memo)
            row.innerHTML = `
                <td>${memo.title}</td>
                <td>${memo.description}</td>
                <td>${memo.studied_on}</td>
            `;
            // 作成した行をテーブルのbodyに追加
            console.log('結果', row)
            memosTableBody.appendChild(row);
            // メモ一覧を最新の状態に更新
            await fetchAndDisplayMemos();
        } else {
            // レスポンスが失敗した場合、エラーメッセージを表示
            if (response.status === 422) {
                // バリデーションエラーの場合
                displayMessage('入力内容に誤りがあります。');
            } else {
                displayMessage(data.detail);
            }
        }
    } catch (error) {
        // ネットワークエラーやその他の理由でリクエスト自体が失敗した場合
        console.error('メモ作成中にエラーが発生しました:', error);
    }
}

/**
* 更新：非同期関数
*/
async function updateMemo(memo) {
    try {
        // APIに「PUTリクエスト」を送信してメモを更新します。
        // headersに'Content-Type'を'application/json'に設定し
        // JSON形式のデータを送信
        const response = await fetch(`${apiUrl}${editingMemoId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(memo)
        });
        // レスポンスのボディをJSONとして解析
        const data = await response.json();
        // レスポンスが成功した場合（HTTPステータスコード：200）
        if (response.ok) {
            // 成功メッセージをアラートで表示
            displayMessage(data.message);
            // フォームをリセットして新規入力状態に戻す
            resetForm();
            // メモ一覧を最新の状態に更新
            await fetchAndDisplayMemos();
        } else {
            // レスポンスが失敗した場合、エラーメッセージを表示
            if (response.status === 422) {
                // バリデーションエラーの場合
                displayMessage('入力内容に誤りがあります。');
            } else {
                displayMessage(data.detail);
            }
        }
    } catch (error) {
        // ネットワークエラーやその他の理由でリクエスト自体が失敗した場合
        console.error('メモ更新中にエラーが発生しました:', error);
    }
}

/**
* 削除：非同期関数
*/
async function deleteMemo(memoId) {
    try {
        // APIに「DELETEリクエスト」を送信してメモを削除します。
        const response = await fetch(`${apiUrl}${memoId}`, {
            method: 'DELETE'
        });
        // レスポンスのボディをJSONとして解析
        const data = await response.json();
        // レスポンスが成功した場合（HTTPステータスコード：200）
        if (response.ok) {
            // 成功メッセージをアラートで表示
            displayMessage(data.message);
            // メモ一覧を最新の状態に更新
            await fetchAndDisplayMemos();
        } else {
            // レスポンスが失敗した場合、エラーメッセージを表示
            displayMessage(data.detail);
        }
    } catch (error) {
        // ネットワークエラーやその他の理由でリクエスト自体が失敗した場合
        console.error('メモ削除中にエラーが発生しました:', error);
    }
}

/**
* メモ一覧をサーバーから取得して表示する非同期関数
*/
async function fetchAndDisplayMemos() {
    try {
        // APIに「GETリクエスト」を送信してメモ一覧を取得します。
        const response = await fetch(apiUrl);
        // レスポンスが失敗した場合、エラーを投げます。
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // レスポンスのボディをJSONとして解析
        const memos = await response.json();
        // HTML内のメモ一覧を表示する部分を取得
        const memosTableBody = document.querySelector('#willdo tbody');
        // 一覧をクリア
        memosTableBody.innerHTML = '';
        // 取得したメモのデータを１つずつ設定
        memos.forEach(memo => {
            // 行を作成
            const row = document.createElement('tr');
            // 行の中身：タイトル、説明、編集と削除ボタン
            row.innerHTML = `
                <td>${memo.title}</td>
                <td>${memo.description}</td>
                <td>${memo.studied_on}</td>
            `;
            // 作成した行をテーブルのbodyに追加
            memosTableBody.appendChild(row);
        });
    } catch (error) {
        // ネットワークエラーやその他の理由でリクエスト自体が失敗した場合
        console.error('メモ一覧の取得中にエラーが発生しました:', error);
    }
}

/**
* 特定のメモを編集するための非同期関数
*/
async function editMemo(memoId) {
    // 編集するメモのIDをグローバル変数に設定
    editingMemoId = memoId;
    // サーバーから特定のIDのメモのデータを取得するリクエストを送信
    const response = await fetch(`${apiUrl}${memoId}`);
    // レスポンスのJSONを解析し、メモデータを取得
    const memo = await response.json();
    // レスポンスが正常でなければ、エラーメッセージを表示し、処理を終了
    if (!response.ok) {
        await displayMessage(memo.detail);
        return;
    }
    // 取得したメモのタイトルと説明をフォームに設定
    document.getElementById('title').value = memo.title;
    document.getElementById('description').value = memo.description;
    // === フォーム ===
    // フォームの見出しを「メモの編集」に更新
    document.getElementById('formTitle').textContent = 'メモの編集';
    // 更新実行ボタンを表示にする
    document.getElementById('updateButton').style.display = 'block';
    // 新規登録ボタンを非表示にする
    document.querySelector('#createDoForm button[type="submit"]').style.display = 'none';
}

/**
* ドキュメントの読み込みが完了した後に実行されるイベントリスナー
* つまり、ドキュメントの読み込みが完了した時点で、以下のコードが実行されます。
*/
document.addEventListener('DOMContentLoaded', () => {
    // フォームの要素を取得
    console.log('haro')
    const form = document.getElementById('createDoForm');
    // const form = document.myform.submit();

    // フォームの送信イベントに対する処理を設定 form.onsubmit = async (event) => {      document.getElementById('newButton').onclick = async (event) => {
    form.onsubmit = async (event) => {      
        // フォームのデフォルトの送信動作を防止 event.preventDefault();
        event.preventDefault();
        // タイトルと説明の入力値を取得
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const studied_on = document.getElementById('start').value;
        const radios = document.getElementsByName('radio_num');
        const len = radios.length;
        let radio = "";
        for (let i = 0; i < len; i++){
            if (radios[i].checked){
                radio = radios[i].value;
            }
        }
        console.log("title:", title);
        console.log("description:", description);
        console.log("date:", studied_on); // ここ要チェック
        console.log("radioValue:", radio); // ここも要チェック
        // メモオブジェクトを作成
        const memo = { title, description, studied_on, radio};

        // 編集中のメモIDがある場合は更新、なければ新規作成を実行
        if (editingMemoId) {
            await updateMemo(memo);
        } else {
            await createMemo(memo);
        }
    };

    // 更新ボタンのクリックイベントに対する処理を設定
    document.getElementById('updateButton').onclick = async () => {
        // タイトルと説明の入力値を取得
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        // 更新関数を実行
        await updateMemo({ title, description });
    };

    // メモ一覧テーブル内のクリックイベントを監視
    // つまりメモ一覧テーブル内の任意のクリックに対してイベントリスナーを設定
    document.querySelector('#willdo tbody').addEventListener('click', async (event) => {
        // クリックされた要素が編集ボタンだった場合の処理
        if (event.target.className === 'edit') {
            // クリックされた編集ボタンからメモIDを取得
            const memoId = event.target.dataset.id;
            // 編集関数を実行
            await editMemo(memoId);
        // クリックされた要素が削除ボタンだった場合の処理
        } else if (event.target.className === 'delete') {
            // クリックされた削除ボタンからメモIDを取得
            const memoId = event.target.dataset.id;
            // 削除関数を実行
            await deleteMemo(memoId);
        }
    });
});

/**
* ドキュメントの読み込みが完了した時にメモ一覧を表示する関数を呼び出す
*/
document.addEventListener('DOMContentLoaded', fetchAndDisplayMemos);