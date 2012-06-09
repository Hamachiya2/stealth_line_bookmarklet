(function(){
	// メイン要素
	var s = document.createElement('div');
	$(s).css({
		'position':'absolute',
		'top':'3%',
		'right':'3%',
		'width':'80%',
		'background':'#fff',
		'color':'#333',
		'border':'4px solid #474',
		'border-radius':'4px',
		'padding':'1em',
		'z-index':'99999'
	}).appendTo($('body'));

	// テキスト表示用
	var d = document.createElement('div');

	// とじるボタン
	var x = document.createElement('a');
	x.href = '#';
	$(x).text('X').css({
		'display':'block',
		'position':'absolute',
		'top':'2px',
		'right':'2px',
		'width':'14px',
		'height':'14px',
		'background':'#ddd',
		'color':'#111',
		'border':'1px solid #888',
		'font-size':'10px',
		'text-align':'center',
		'text-decoration':'none',
		'line-height':'14px'
	}).appendTo($(s)).bind('click',function(ev){
		$(s).remove();
	});

	// コンタクト取得
	$.get('https://t.line.naver.jp/rest/v1/contacts', function(r){
		// コンタクト表示
		r.data.map(function(v,i){
			var a = document.createElement('a');
			a.rel = v.mid;
			a.href = '#';
			$(a).text(v.displayName).css({'margin-left':'1em'}).appendTo($(s)).bind('click',function(ev){
				// メッセージ取得
				$.get('https://t.line.naver.jp/rest/v1/chats/'+ev.target.rel+'/messages/tail?count=100',function(m){
					var msg = '';
					if (! m.data.length) {
						$(d).text('no message.');
					}
					m.data.map(function(t){
						// メッセージの発信者名
						if (t.from == ev.target.rel) {
							msg += '[' + $(ev.target).text() + '] ';
						} else {
							msg += '[me] ';
						}

						// テキスト？ステッカー？(写真とかいうパターンもあるのかもしれない)
						msg += t.text ? t.text : 'Sticker:' + t.contentMetadata.STKID;
						// メッセージ日付
						var ts = new Date(t.createdTime);
						msg += ' &nbsp;<span style="color:#999">' + ts.getFullYear() + '/' + (ts.getMonth()-0+1) + '/' + ts.getDate() + ' ' + ts.getHours() + ':' + ts.getMinutes() + ':' + ts.getSeconds() + '</span>';
						msg += '<br>';
						$(d).html(msg);
					})
				});
			});
		});

		// テキスト表示要素追加
		$(d).css({
			'height':'10em',
			'overflow':'auto',
			'margin-top':'1em',
			'border':'1px solid #666',
			'color':'#333',
			'background':'#eee',
			'padding':'.5em'
		}).appendTo($(s));

		// 未読件数取得
		$.get('https://t.line.naver.jp/rest/v1/chats/unread', function(v){
			// コンタクト横に未読件数表示
			v.data.map(function(d){
				$('a[rel^="' + d.id + '"]', s).after('<b style="color:red">('+d.unreadCount+')</b>');
			});
		});
	});
});
