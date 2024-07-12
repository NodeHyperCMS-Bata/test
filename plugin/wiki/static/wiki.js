function get_time(now = new Date()){
    return new Date(now).toISOString().slice(0, 19).replace('T', ' ');
}

function formatTime(now = new Date()){//const gt = get_time(now);
	now = new Date(now);

	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const day = now.getDate();
	const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];

	let hour = now.getHours();
	let minute = now.getMinutes();
	let meridiem = '오전';

	if(hour >= 12){
		meridiem = '오후';
		hour -= 12;
	}

	hour = hour.toString().padStart(2, '0');
	minute = minute.toString().padStart(2, '0');
  
	const formattedDate = `${year}년 ${month}월 ${day}일 (${dayOfWeek}) ${meridiem} ${hour}:${minute}`;

	return formattedDate;//`<span class="text-info">${gt}</span> vs <span class="text-info">${formattedDate}</span>`//formattedDate;
}

document.querySelectorAll('.d-time').forEach(el => {
	el.innerHTML = formatTime(+el.getAttribute('data-time'));
});

const clipboard = new ClipboardJS('.d-copy');

clipboard.on('success', e => {
	const el = e.trigger;
    el.innerHTML = '<i class="bi bi-clipboard-check" style="width: unset;height: unset"></i>';
	el.classList.add('text-success');
	const tooltip = new bootstrap.Tooltip(el, {
		title: '복사됨',
		placement: 'bottom'
	});
	tooltip.enable();
	tooltip.show();

	setInterval(() => {
		el.innerHTML = '<i class="bi bi-clipboard" style="width: unset;height: unset"></i>';
		el.classList.remove('text-success');
		tooltip.dispose();
		tooltip.disable();
	}, 1500);
});

clipboard.on('error', e => {
	const el = e.trigger;
    el.innerHTML = '<i class="bi bi-clipboard-x" style="width: unset;height: unset"></i>';
	el.classList.add('text-darger');
});