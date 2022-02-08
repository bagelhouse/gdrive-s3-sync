export function replaceUrlParam(url: string, paramName: string, paramValue: string)
{
  if (paramValue == null) {
    paramValue = ""
  }
  const pattern = new RegExp("\\b("+paramName+"=).*?(&|#|$)")
  if (url.search(pattern)>=0) {
    return url.replace(pattern,"$1" + paramValue + "$2")
  }
  url = url.replace(/[?#]$/,"")
  return url + (url.indexOf("?")>0 ? "&" : "?") + paramName + "=" + paramValue
}