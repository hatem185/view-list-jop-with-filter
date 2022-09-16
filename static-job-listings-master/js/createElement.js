const checkPropertyValue = (p) => {
  return Array.isArray(p)
    ? p !== undefined && p !== null && p?.length > 0
    : p !== undefined && p !== null && p?.trim()?.length > 0;
};
const createElement = ({
  tag,
  textContent,
  idName,
  classList,
  customAttrList,
} = prop) => {
  if (checkPropertyValue(tag)) {
    const ele = document.createElement(tag);

    if (checkPropertyValue(idName)) {
      ele.setAttribute("id", idName);
    } //
    if (checkPropertyValue(classList)) {
      ele.classList.add(...classList);
    } //
    if (checkPropertyValue(customAttrList)) {
      customAttrList.forEach((attr) => {
        Object.keys(attr).forEach((key) => {
          ele.setAttribute(key, attr[key]);
        });
      });
    } //
    if (checkPropertyValue(textContent)) {
      ele.appendChild(document.createTextNode(textContent));
    } //
    return ele;
  } else {
    console.error(`the tag property can not be ${tag === "" ? "empty" : tag}`);
    return;
  }
}; //END
