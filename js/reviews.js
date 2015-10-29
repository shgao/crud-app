Parse.initialize("cDq1mGbr3R8h5NT3pYYAoQhGNp6YtnTSZ8KkRjHu","TerRozeCRgm63jkwjQJ0mDRWHgQff0QoUGdzJbLk");

var Review = Parse.Object.extend('Review');

var rate = 0;
var star = 0;
var tot = 0;

$('.click').raty({ path: 'img', click: function(score, evt) {
    rate = parseInt(score, 10);
  }});

$('form').submit(function() {
	var userReview = new Review();

	userReview.set('title', $('#title').val());
	userReview.set('review', $('#text').val());
	userReview.set('rating', rate);
	userReview.set('helpful', 0);
	userReview.set('total', 0);
	$('#title').val("");
	$('#text').val("");
	$('.click').raty({ path: 'img'});

	userReview.save(null, {
		success:getData
	});
	
	return false;
});

var getData = function() {
	var query = new Parse.Query(Review);

	query.descending('createdAt');

	query.notEqualTo('review', '');

	query.find({
		success:function(results) {
			buildList(results);
		}
	})
}

var buildList = function(data) {
	$('#reviews').empty();

	star = 0;
	tot = data.length;

	data.forEach(function(d) {
		addItem(d);
	});

	$('.rate').raty({ path: 'img', readOnly: true, score: 0.5 * Math.round((star/tot)/0.5) });
}

var addItem = function(item) {
	var helpful = item.get('helpful');
	var total = item.get('total');
	var day = jQuery.trim(item.get('createdAt')).split('GMT');
	star += item.get('rating');

	var d = $('<div>').addClass('review');

	var rating = $('<span>').appendTo(d).raty({ path: 'img', readOnly: true, score: item.get('rating') });
	var title = $('<h2>').addClass('title').text(item.get('title')).appendTo(d);

	var h = $('<p>').addClass('helpful').text('Was this review helpful?  ');
	var yes = $('<span>').addClass('yes').text('Yes').appendTo(h);
	$(h).append(' / ');
	var no = $('<span>').addClass('no').text('No').appendTo(h);
	$(h).append('?</p>');

	yes.click(function() {
		item.increment('helpful');
		item.increment('total');
		item.save(null, {
			success:getData
		});
	});

	no.click(function() {
		item.increment('total');
		item.save(null, {
			success:getData
		});
	});

	$(h).appendTo(d);

	var date = $('<p>').addClass('date').text(day[0]).appendTo(d);

	var reviewtext = $('<p>').addClass('reviewtext').text(item.get('review')).appendTo(d);

	var s = $('<p>');
	var helped = $('<span>').addClass('helped').text(helpful).appendTo(s);
	$(s).append(' out of ');
	var tot = $('<span>').addClass('total').text(total).appendTo(s);
	$(s).append(' found this review helpful.').appendTo(d);

	$(d).appendTo($('#reviews'));
}

getData();