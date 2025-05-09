const defaultHeight = 240;
const defaultWidth = 300;
const minHeight = 60;
const minWidth = 200;
const maxHeight = 800;
const maxWidth = 1000;

window.writeCode = function name (params) {
  const nusach = document.getElementById('nusach').value;
  const hideDateCheckbox = document.getElementById('hide-date');
  const hideSefiraCheckbox = document.getElementById('hide-sefira');
  const fontSizeInput = document.getElementById('font-size');
  let iframeSrc = 'https://sefirat-haomer.pages.dev/sefirat-haomer-script/live/?nusach=' + nusach;
  iframeSrc += hideDateCheckbox.checked ? '&hideDate=true' : '';
  iframeSrc += hideSefiraCheckbox.checked ? '&hideSefira=true' : '';
  iframeSrc += '&fontSize=' + fontSizeInput.value;

  const heightEl = document.getElementById('height');
  const widthEl = document.getElementById('width');
  let height = heightEl.value;
  let width = widthEl.value;

  height = isNaN(height) ? defaultHeight : height < minHeight ? minHeight : height > maxHeight ? maxHeight : height;
  width = isNaN(width) ? defaultWidth : width < minWidth ? minWidth : width > maxWidth ? maxWidth : width;

  heightEl.value = height;
  widthEl.value = width;

  const code = '<iframe src="' +
      iframeSrc +
      '" width="' + height +
      '" height="' + width +
      '" frameborder="0"></iframe>';
  const iframe = document.querySelector('iframe#iframe-preview');
  iframe.src = iframeSrc;
  iframe.height = height;
  iframe.width = width;
  document.querySelector('textarea#code').value = code;
};
