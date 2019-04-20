const canvas = new fabric.StaticCanvas('c');
const img = new fabric.Image($('img')[0]);

console.log(_, window.savedfilter);

_(window.savedfilter).entries().each(([filter, value]) => {

  if ((['_id', 'picture']).indexOf(filter) !== -1)
    return;

  img.filters.push(createFilter(filter, value));
  let scale = $(window).width() / img.width;
  img.set({
    scaleX: scale,
    scaleY: scale,
  });
  img.applyFilters();
  canvas.setWidth(img.width * scale);
  canvas.setHeight(img.height * scale);
  canvas.add(img);
});

$('form').on('submit', e => {
  const form = $(e.target);
  const fileinput = form.find('input[type=file]')[0]
  if (!fileinput.files.length) {
    e.preventDefault();
    $(fileinput).click();
  }
});

$('input[type=file]').on('change', e => {
  const fileinput = $(e.target); 
  const button = fileinput.parent().find('button');
  button.text(`Upload ${fileinput[0].files.length} files`);
});
