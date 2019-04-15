var filters = {};

const render = _.throttle((canvas) => {
  fabric.Image.fromURL('/images/photo.jpeg', function(oImg) {
    oImg.filters = []
    _(filters).entries().each(([filter, value]) => {
      oImg.filters.push(createFilter(filter, value));
    });
    let scale = 500 / oImg.width;
    oImg.set({
      scaleX: scale,
      scaleY: scale,
    });
    oImg.applyFilters();
    canvas.setWidth(oImg.width * scale);
    canvas.setHeight(oImg.height * scale);
    canvas.add(oImg);
  });
}, 200);

const createCanvas = () => {
  var canvas = new fabric.Canvas('c');
  render(canvas);
  return canvas;
}

const canvas = createCanvas();

const updateNumber = (target) => {
  $(target).parent().next().text(target.value);
}

$('.slider').each((i, e) => {
  updateNumber(e);
})

$('.slider').on('input', (event) => {
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

$("#submit").on('click', e => {
  e.preventDefault();
  $.post('/filter',
    {
      data: JSON.stringify({
        filters,
        image: '/images/photo.jpeg',
      })
    },
    data => {
      data = $.parseJSON(data);
      $('.download')
        .html($(`<div><a href=${data.url}>${data.url}</a></div>`));
    },
    "json",
  );
});
