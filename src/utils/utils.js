export function userToArr(str){
  return (str || '').split(",")[1];
}

export function filterbyToString(filterby){
  switch (filterby) {
    case 1:
      return "紧急";
    case 2:
      return "高优";
    case 3:
      return "有标签";
    case 4:
      return "无标签";
    case 99:
      return "置顶";
    default:
      return filterby;
  }
}

export function ordbyToString(ordby){
  switch (ordby) {
    case 1:
      return "标签优先";
    case 2:
      return "顺序优先";
    default:
      return ordby;
  }
}

export function timerangeToString(timerange){
  switch (timerange) {
    case 1:
      return "今日";
    case 2:
      return "本周";
    case 3:
      return "本月";
    case 4:
      return "今年";
    default:
      return timerange;
  }
}