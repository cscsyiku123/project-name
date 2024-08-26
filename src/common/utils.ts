export function objectConvert<T>(source: any) {
  return JSON.parse(JSON.stringify(source)) as (T);
}

export const formatTime = (time: number | string | Date, formatString: string) => {
  let date = new Date(time);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes();
  let second = date.getSeconds();
  return formatString.replace("yyyy", year.toString())
    .replace("MM", month.toString())
    .replace("dd", day.toString())
    .replace("HH", hour.toString())
    .replace("mm", min.toString())
    .replace("ss", second.toString());
};
