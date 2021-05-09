$(document).ready(function () {
  var defaultHeight = 240;
  var defaultWidth = 300;
  var minHeight = 60;
  var minWidth = 200;
  var maxHeight = 800;
  var maxWidth = 1000;

  window.writeCode = function name (params) {
    var iframeSrc = 'https://sefirat-haomer.vercel.app/sefirat-haomer-script/live/?nusach=' +
      $('#nusach').val();
    iframeSrc += $('#hide-date').prop('checked') ? '&hideDate=true' : '';
    iframeSrc += $('#hide-sefira').prop('checked') ? '&hideSefira=true' : '';
    iframeSrc += '&fontSize=' + $('#font-size').val();

    var height = $('#height').val();
    var width = $('#width').val();

    height = isNaN(height) ? defaultHeight : height < minHeight ? minHeight : height > maxHeight ? maxHeight : height;
    width = isNaN(width) ? defaultWidth : width < minWidth ? minWidth : width > maxWidth ? maxWidth : width;

    $('#height').val(height);
    $('#width').val(width);

    var code = '<iframe src="' +
      iframeSrc +
      '" width="' + height +
      '" height="' + width +
      '" frameborder="0"></iframe>';
    $('iframe#iframe-preview')[0].src = iframeSrc;
    $('iframe#iframe-preview')[0].height = height;
    $('iframe#iframe-preview')[0].width = width;
    $('textarea#code').val(code);
  };
});
