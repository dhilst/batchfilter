var filters = {};

const render = canvas => {
  var oImg = new fabric.Image(document.getElementById("picture"));
  oImg.filters = []
  _(filters).entries().each(([filter, value]) => {
    oImg.filters.push(createFilter(filter, value));
  });
  let scale = $(window).width() / oImg.width;
  oImg.set({
    scaleX: scale,
    scaleY: scale,
  });
  oImg.applyFilters();
  canvas.setWidth(oImg.width * scale);
  canvas.setHeight(oImg.height * scale);
  canvas.add(oImg);
};

const createCanvas = () => {
  var canvas = new fabric.StaticCanvas('c');
  render(canvas);
  return canvas;
}

const canvas = createCanvas();

const updateNumber = (target) => {
  $(target).parent().find('.filter-value').text(target.value);
}

$('.slider').each((i, e) => {
  updateNumber(e);
})

$('.slider').on('change', (event) => {
  const [filter, value] = [$(event.target).data('filter'), event.target.value];
  filters[filter] = value;
  updateNumber(event.target);
  render(canvas);
});

$("#reset").on('click', e => {
  e.preventDefault();
  $('.slider').each((i, e) => {
    filters[$(e).data('filter')] = $(e).data('default');
    $(e).val($(e).data('default'));
    updateNumber(e);
  });
  render(canvas);
});

$('#choosepicture').on('click', e => {
  e.preventDefault();
  $('input[type=file]').click();
});

$('#custompictureinput').on('change', e => {
  $("#custompictureform").submit();
});

$('#hide').on('click', event => {
	event.preventDefault();
	$('.slider').parent().toggle();
});
