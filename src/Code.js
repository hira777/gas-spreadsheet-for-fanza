import { SHEET_ID } from 'babel-dotenv';

function main() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName('master');

  // B1の値（時刻）をリクエストパラメータとして利用
  const date = sheet.getRange('B1').getValue();
  const ids = date
    ? fetchIdsWithNosampleMovie({ requestParameter: { gte_date: date } })
    : fetchIdsWithNosampleMovie();
  sheet.getRange('B1').setValue(getTodayDate());

  // 最後に記述されている行を取得
  const lastRow = sheet.getLastRow();
  // A列に記述されている全ての値を連想配列で取得し、1次元の配列に変換する
  const currentIds = sheet
    .getRange(`A1:A${lastRow}`)
    .getValues()
    .map(v => v[0]);
  // APIから取得したIDからシートに存在するIDを取り除き、連想配列にする。
  const filterdIds = ids
    .filter(id => currentIds.indexOf(id) < 0)
    .map(id => [id]);
  if (filterdIds.length < 1) return;
  // 最後に記述されている行からAPIのレスポンスを追記
  sheet
    .getRange(`A${lastRow}:A${filterdIds.length + lastRow - 1}`)
    .setValues(filterdIds);
}
