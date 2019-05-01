import { API_ID, AFFILIATE_ID } from 'babel-dotenv';

const HITS = 100;
const BASE_URI = 'https://api.dmm.com/affiliate/v3/ItemList';
const BASE_REQUEST_PARAMETER = {
  api_id: API_ID,
  affiliate_id: AFFILIATE_ID,
  site: 'FANZA',
  service: 'digital',
  floor: 'videoa',
  hits: HITS,
  sort: 'date',
  output: 'json'
};

function fetchIdsWithNosampleMovie({ requestParameter = {} }) {
  const endPoint = `${BASE_URI}?${serialize({
    ...BASE_REQUEST_PARAMETER,
    ...requestParameter
  })}`;
  // const totalCount = fetchResult(endPoint).total_count;
  const totalCount = 300;

  let ids = [];
  for (let offset = 0; offset < totalCount; offset += HITS) {
    const endPoint = `${BASE_URI}?${serialize({
      ...BASE_REQUEST_PARAMETER,
      ...requestParameter,
      offset: `${offset + 1}`
    })}`;
    const _ids = fetchResult(endPoint)
      .items.filter(item => item.sampleMovieURL === undefined)
      .map(item => item.content_id);
    ids = ids.concat(_ids);
  }
  return ids;
}

function fetchResult(endPoint) {
  // APIのレスポンスを取得
  const response = UrlFetchApp.fetch(endPoint);
  // レスポンスをパースする
  return JSON.parse(response.getContentText()).result;
}

function serialize(obj) {
  let str = [];
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const key = encodeURIComponent(prop);
      const value = encodeURIComponent(obj[prop]);
      str.push(`${key}=${value}`);
    }
  }
  return str.join('&');
}
